(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
function create(code,labels){
  const root=document.createElement("div");root.className="dch-v2-planet";root.dataset.paused="false";
  const svg=document.createElementNS(NS,"svg");svg.setAttribute("viewBox","0 0 240 204");svg.setAttribute("aria-hidden","true");svg.setAttribute("focusable","false");
  svg.innerHTML='<defs><radialGradient id="dch-v2-sphere" cx="30%" cy="26%" r="82%"><stop offset="0" stop-color="#e0edff"/><stop offset=".35" stop-color="#7ca1df"/><stop offset=".72" stop-color="#34568f"/><stop offset="1" stop-color="#101e44"/></radialGradient><radialGradient id="dch-v2-halo"><stop offset="0" stop-color="#72a4ff" stop-opacity=".48"/><stop offset="1" stop-color="#72a4ff" stop-opacity="0"/></radialGradient></defs><circle class="dch-v2-halo" cx="120" cy="102" r="98" fill="url(#dch-v2-halo)"/><g transform="rotate(-27 120 102)"><ellipse cx="120" cy="102" rx="103" ry="40" fill="none" stroke="#82b1ff" stroke-width="1.3"/><circle class="dch-v2-satellite dch-v2-satellite-a" r="4.5" fill="#70aaff" stroke="#e7f0ff" stroke-width="1"/></g><g transform="rotate(38 120 102)"><ellipse cx="120" cy="102" rx="88" ry="34" fill="none" stroke="#a992f0" stroke-width="1.2"/><circle class="dch-v2-satellite dch-v2-satellite-b" r="3.6" fill="#b49aff" stroke="#f3ebff" stroke-width="1"/></g><circle cx="120" cy="102" r="59" fill="url(#dch-v2-sphere)" stroke="#b5cef7" stroke-width="1"/><text x="120" y="109" text-anchor="middle" font-size="21" font-weight="800" fill="#fff" class="dch-v2-planet-code"/></svg>'.replace("</svg>","");
  svg.querySelector(".dch-v2-planet-code").textContent=code;
  const button=document.createElement("button");button.type="button";button.className="dch-v2-motion";root.append(svg,button);
  const media=window.matchMedia("(prefers-reduced-motion: reduce)");let manual=false,visible=true;
  function sync(){root.dataset.paused=String(manual||!visible||document.hidden||media.matches);button.disabled=media.matches;button.setAttribute("aria-pressed",String(manual||media.matches));button.textContent=media.matches?labels.reduced:manual?labels.resume:labels.pause;}
  button.addEventListener("click",()=>{manual=!manual;sync();});
  if(media.addEventListener)media.addEventListener("change",sync);else media.addListener(sync);
  document.addEventListener("visibilitychange",sync);
  if("IntersectionObserver" in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:0}).observe(root);
  sync();return root;
}
window.DCHLessonPlanet={create};
})();
