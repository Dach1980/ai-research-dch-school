import json
import os
import threading
import unittest
from pathlib import Path
from http.server import ThreadingHTTPServer
from test_canonical_lesson_browser import QuietHandler
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
class Lesson1012BrowserTests(unittest.TestCase):
    def test_geometry_locales_themes(self):
        catalog=json.loads((ROOT/"data/catalog/catalog-v3.json").read_text(encoding="utf-8"))
        lesson=next(x for x in catalog["lessons"] if x["uid"]=="les-a-0183")
        evidence=os.environ.get("DCH_VISUAL_EVIDENCE")
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
                                page=browser.new_page(viewport={"width":width,"height":1000})
                                try:
                                    page.add_init_script(f"localStorage.setItem('dch-school-theme','{theme}');")
                                    page.route("**/scripts/account-ui.js",lambda r:r.fulfill(status=200,content_type="application/javascript",body=""))
                                    errors=[]
                                    page.on("pageerror",lambda e:errors.append(str(e)))
                                    response=page.goto(f"http://127.0.0.1:{server.server_port}/"+route,wait_until="domcontentloaded")
                                    self.assertEqual(response.status,200)
                                    page.locator(".shap-compute-figure svg").last.wait_for()
                                    self.assertEqual(page.locator("html").get_attribute("data-theme"),theme)
                                    self.assertEqual(page.locator(".shap-compute-figure svg").count(),5)
                                    self.assertEqual(page.locator("#lesson-sections > section").count(),9)
                                    self.assertEqual(page.locator("#lesson-glossary .glossary-entry").count(),15)
                                    self.assertEqual(page.locator("#lesson-quiz fieldset").count(),10)
                                    self.assertEqual(errors,[])
                                    page.wait_for_function("Array.from(document.querySelectorAll('.shap-compute-figure')).every(f=>f.dataset.scrollable===String(f.querySelector('.pfi-diagram-viewport').scrollWidth>f.querySelector('.pfi-diagram-viewport').clientWidth+1))")
                                    issues=page.evaluate("""() => {
                                      const errors=[];
                                      const lum=s=>s.match(/[0-9.]+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4}).reduce((a,v,i)=>a+v*[.2126,.7152,.0722][i],0);
                                      for(const svg of document.querySelectorAll('.shap-compute-figure svg')){
                                        const vb=svg.viewBox.baseVal, viewport=svg.parentElement, fig=viewport.parentElement;
                                        if(viewport.scrollWidth>viewport.clientWidth+1){
                                          if(getComputedStyle(viewport).overflowX!=='auto' && getComputedStyle(viewport).overflowX!=='scroll')errors.push('unscrollable SVG');
                                          if(getComputedStyle(fig.querySelector('.shap-scroll-hint')).display==='none')errors.push('missing scroll hint');
                                          const initial=viewport.scrollLeft;viewport.scrollLeft=viewport.scrollWidth;
                                          if(viewport.scrollLeft<=0)errors.push('horizontal scrolling failed');
                                          viewport.scrollLeft=initial;
                                        }
                                        if(fig.dataset.diagramKind==='growth'){
                                          const cell=svg.querySelector('[data-node-id="row-4-col-2"]');
                                          if(!cell||cell.querySelectorAll('text').length!==1)errors.push('factorial wraps');
                                        }
                                        for(const group of svg.querySelectorAll('[data-node-id]')){
                                          const rect=group.querySelector('rect'),r=rect.getBBox();
                                          for(const t of group.querySelectorAll('text')){
                                            const b=t.getBBox(),f=getComputedStyle(t).fill,bg=getComputedStyle(rect).fill;
                                            const ratio=(Math.max(lum(f),lum(bg))+.05)/(Math.min(lum(f),lum(bg))+.05);
                                            if(b.x<r.x+5||b.y<r.y||b.x+b.width>r.x+r.width-5||b.y+b.height>r.y+r.height-5)errors.push('node clipping '+t.textContent);
                                            if(ratio<4.5)errors.push('contrast '+ratio+' '+t.textContent);
                                            const ctm=t.getScreenCTM(),scale=Math.min(Math.hypot(ctm.a,ctm.b),Math.hypot(ctm.c,ctm.d));
                                            if(parseFloat(getComputedStyle(t).fontSize)*scale<14)errors.push('rendered font '+t.textContent);
                                          }
                                        }
                                        for(const node of svg.querySelectorAll('rect,text,path')){
                                          const b=node.getBBox();
                                          if(b.x < -1||b.y < -1||b.x+b.width>vb.width+1||b.y+b.height>vb.height+1)errors.push('viewBox '+node.tagName);
                                        }
                                      }
                                      if(document.documentElement.scrollWidth>innerWidth+1)errors.push('page overflow');
                                      return errors;
                                    }""")
                                    self.assertEqual(issues,[])
                                    if evidence:
                                        prefix=f"{locale}-{theme}-{width}"
                                        page.screenshot(path=str(evidence / f"{prefix}-page.png"),animations="disabled")
                                        for i,figure in enumerate(page.locator(".shap-compute-figure").all(),1):
                                            figure.screenshot(path=str(evidence / f"{prefix}-figure-{i}.png"),animations="disabled")
                                            viewport=figure.locator(".pfi-diagram-viewport")
                                            if viewport.evaluate("v => v.scrollWidth>v.clientWidth+1"):
                                                viewport.evaluate("v => {v.scrollLeft=v.scrollWidth}")
                                                figure.screenshot(path=str(evidence / f"{prefix}-right-{i}.png"),animations="disabled")
                                                viewport.evaluate("v => {v.scrollLeft=0}")
                                finally: page.close()
                browser.close()
                if evidence:
                    self.assertEqual(len(list(evidence.glob("*-page.png"))),18)
                    self.assertEqual(len(list(evidence.glob("*-figure-*.png"))),90)
        finally:
            server.shutdown();server.server_close();thread.join(timeout=2)
