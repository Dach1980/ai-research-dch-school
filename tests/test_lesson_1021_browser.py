import json
import os
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from playwright.sync_api import sync_playwright
from test_canonical_lesson_browser import QuietHandler

ROOT=Path(__file__).resolve().parents[1]

class Lesson1021BrowserTests(unittest.TestCase):
    def test_18_configs(self):
        catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0185")
        evidence=os.environ.get("DCH_1021_EVIDENCE")
        if evidence:
            evidence=Path(evidence)
            evidence.mkdir(parents=True,exist_ok=True)
        server=ThreadingHTTPServer(("127.0.0.1",0),QuietHandler)
        thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
        try:
            with sync_playwright() as p:
                browser=p.chromium.launch()
                for locale,route in lesson["url_i18n"].items():
                    for theme in ("light","dark"):
                        for width in (375,768,1440):
                            with self.subTest(locale=locale,theme=theme,width=width):
                                page=browser.new_page(viewport={"width":width,"height":1000},reduced_motion="no-preference")
                                try:
                                    page.add_init_script(f"localStorage.setItem('dch-school-theme','{theme}')")
                                    page.route("**/scripts/account-ui.js",lambda r:r.fulfill(status=200,content_type="application/javascript",body=""))
                                    errors=[]
                                    page.on("pageerror",lambda e:errors.append(str(e)))
                                    response=page.goto(f"http://127.0.0.1:{server.server_port}/"+route,wait_until="domcontentloaded")
                                    self.assertEqual(response.status,200)
                                    page.locator("main[data-design-ready='true']").wait_for()
                                    self.assertEqual(page.locator("html").get_attribute("data-theme"),theme)
                                    self.assertEqual(page.locator("main h1").count(),1)
                                    micro = page.locator("#shap-1021-cancellation .dch-method-passport")
                                    micro.locator("summary").click()
                                    micro.locator("button").nth(0).click()
                                    self.assertEqual(micro.locator("[role=status]").get_attribute("data-correct"),"false")
                                    micro.locator("button").nth(1).click()
                                    self.assertEqual(micro.locator("[role=status]").get_attribute("data-correct"),"true")
                                    micro.locator("summary").click()
                                    self.assertEqual(page.locator(".dch-v2-planet-code").text_content(),"10.2.1")
                                    self.assertEqual(page.locator(".dch-v2-toc-link").count(),13)
                                    self.assertEqual(page.locator("#lesson-outcomes li").count(),9)
                                    self.assertEqual(page.locator("#lesson-sections > section").count(),9)
                                    self.assertEqual(page.locator(".shap-global-figure svg").count(),5)
                                    self.assertEqual(page.locator("#lesson-glossary .glossary-entry").count(),15)
                                    self.assertEqual(page.locator("#lesson-quiz fieldset").count(),12)
                                    link=page.locator('a[href="practice/a-10-2-1-shap-global-importance.py"]')
                                    self.assertEqual(link.count(),1)
                                    self.assertEqual(page.request.get(link.evaluate("el=>el.href")).status,200)
                                    self.assertEqual(page.locator("header .language-switcher").count(),1)
                                    self.assertEqual(page.locator("header [data-dch-theme-control]").count(),1)
                                    page.wait_for_function("Array.from(document.querySelectorAll('.shap-global-figure')).every(f=>f.dataset.scrollable===String(f.querySelector('.pfi-diagram-viewport').scrollWidth>f.querySelector('.pfi-diagram-viewport').clientWidth+1))")
                                    issues=page.evaluate("""() => {
                                      const errors=[];
                                      const lum=s=>s.match(/[0-9.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
                                      const surface=getComputedStyle(document.documentElement).getPropertyValue('--lds-surface').trim();
                                      const probe=document.createElement('span');probe.style.color=surface;document.body.append(probe);const bg=getComputedStyle(probe).color;probe.remove();
                                      for(const svg of document.querySelectorAll('.shap-global-figure svg')){
                                        const vb=svg.viewBox.baseVal, viewport=svg.parentElement, fig=viewport.parentElement;
                                        if(viewport.scrollWidth>viewport.clientWidth+1){
                                          if(!['auto','scroll'].includes(getComputedStyle(viewport).overflowX))errors.push('unscrollable SVG');
                                          if(getComputedStyle(fig.querySelector('.shap-scroll-hint')).display==='none')errors.push('missing hint');
                                          viewport.scrollLeft=viewport.scrollWidth;
                                          if(viewport.scrollLeft<=0)errors.push('scroll failed');
                                          viewport.scrollLeft=0;
                                        }
                                        for(const t of svg.querySelectorAll('text')){
                                          const b=t.getBBox(),ctm=t.getScreenCTM(),scale=Math.min(Math.hypot(ctm.a,ctm.b),Math.hypot(ctm.c,ctm.d));
                                          const rect=t.closest('[data-node-id]')?.querySelector('rect');
                                          const back=rect?getComputedStyle(rect).fill:bg,fore=getComputedStyle(t).fill;
                                          const ratio=(Math.max(lum(fore),lum(back))+.05)/(Math.min(lum(fore),lum(back))+.05);
                                          if(parseFloat(getComputedStyle(t).fontSize)*scale<14)errors.push('small text '+t.textContent);
                                          if(ratio<4.5)errors.push('contrast '+t.textContent);
                                          if(rect){const r=rect.getBBox();if(b.x<r.x+4||b.y<r.y||b.x+b.width>r.x+r.width-4||b.y+b.height>r.y+r.height-4)errors.push('clipping '+t.textContent);}
                                        }
                                        for(const node of svg.querySelectorAll('rect,text,path,circle')){
                                          const b=node.getBBox();if(b.x < -1||b.y < -1||b.x+b.width>vb.width+1||b.y+b.height>vb.height+1)errors.push('viewBox '+node.tagName+' '+node.textContent);
                                        }
                                        const plotLabels=Array.from(svg.querySelectorAll('[data-role=plot-label]')).map(t=>[t.textContent,t.getBBox()]);
                                        for(let i=0;i<plotLabels.length;i++)for(let j=i+1;j<plotLabels.length;j++){
                                          const [a,p]=plotLabels[i],[b,q]=plotLabels[j];
                                          if(p.x<q.x+q.width-2&&q.x<p.x+p.width-2&&p.y<q.y+q.height-2&&q.y<p.y+p.height-2)errors.push('labels overlap '+a+' / '+b);
                                        }
                                      }
                                      const hist=Array.from(document.querySelectorAll('[data-diagram-kind=interval] [data-count]')).reduce((a,x)=>a+Number(x.dataset.count),0);
                                      if(hist!==256)errors.push('bootstrap count');
                                      if(document.documentElement.scrollWidth>innerWidth+1)errors.push('page overflow');
                                      return errors;
                                    }""")
                                    self.assertEqual(issues,[])
                                    toggle=page.locator(".dch-v2-outcomes-toggle")
                                    toggle.click()
                                    self.assertFalse(page.locator("#lesson-outcomes > ul").is_visible())
                                    toggle.click()
                                    self.assertTrue(page.locator("#lesson-outcomes > ul").is_visible())
                                    if evidence:
                                        prefix=f"{locale}-{theme}-{width}"
                                        page.evaluate("window.scrollTo(0,0)")
                                        page.screenshot(path=str(evidence/f"{prefix}-page.png"),animations="allow")
                                        for i,fig in enumerate(page.locator(".shap-global-figure").all(),1):
                                            fig.screenshot(path=str(evidence/f"{prefix}-figure-{i}.png"),animations="allow")
                                            v=fig.locator(".pfi-diagram-viewport")
                                            if v.evaluate("v=>v.scrollWidth>v.clientWidth+1"):
                                                v.evaluate("v=>{v.scrollLeft=v.scrollWidth}")
                                                fig.screenshot(path=str(evidence/f"{prefix}-right-{i}.png"),animations="allow")
                                                v.evaluate("v=>{v.scrollLeft=0}")
                                    page.locator(".dch-v2-primary").click()
                                    self.assertTrue(page.evaluate("location.hash.startsWith('#shap-1021-')"))
                                    self.assertEqual(errors,[])
                                finally:
                                    page.close()
                browser.close()
        finally:
            server.shutdown();server.server_close();thread.join(timeout=2)
