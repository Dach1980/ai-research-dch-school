(function(){
  "use strict";
  var KEY="dch-school-theme";
  var media=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;
  function labels(){var lang=(document.documentElement.lang||"ru").toLowerCase();return lang.indexOf("zh")===0?{light:"☀ 浅色",dark:"☾ 深色",system:"◐ 跟随系统"}:lang.indexOf("en")===0?{light:"☀ Light",dark:"☾ Dark",system:"◐ System"}:{light:"☀ Светлая",dark:"☾ Тёмная",system:"◐ Системная"};}
  function preference(){try{return localStorage.getItem(KEY)||localStorage.getItem("dch-theme")||"system"}catch(_){return "system"}}
  function apply(){
    var pref=preference(),words=labels();
    var resolved=pref==="system"?(media&&media.matches?"dark":"light"):pref;
    document.documentElement.dataset.theme=resolved;
    document.documentElement.dataset.themePreference=pref;
    document.querySelectorAll("[data-dch-theme-control]").forEach(function(button){
      button.textContent=words[pref];
      var lang=(document.documentElement.lang||"ru").toLowerCase();
      button.setAttribute("aria-label",lang.indexOf("zh")===0?"主题："+words[pref]+"。点击切换":lang.indexOf("en")===0?"Theme: "+words[pref]+". Activate to change.":"Тема оформления: "+words[pref]+". Нажмите, чтобы изменить");
      button.setAttribute("aria-pressed",pref!=="system"?"true":"false");
      button.title=words[pref];
    });
    var meta=document.querySelector('meta[name="theme-color"]');
    if(meta)meta.content=resolved==="dark"?"#080d1b":"#f4f7fc";
  }
  function cycle(){var order=["system","light","dark"],current=preference();var next=order[(order.indexOf(current)+1)%order.length];try{localStorage.setItem(KEY,next)}catch(_){}apply();}
  function ensureControl(){
    var controls=document.querySelectorAll(".theme-toggle,[data-dch-theme-control]");
    if(!controls.length){
      var header=document.querySelector(".site-header");
      if(header){var button=document.createElement("button");button.type="button";button.className="theme-switcher";button.dataset.dchThemeControl="";header.appendChild(button);}
    }
    document.querySelectorAll(".theme-toggle").forEach(function(button){button.dataset.dchThemeControl="";});
    document.querySelectorAll("[data-dch-theme-control]").forEach(function(button){if(!button.dataset.dchBound){button.dataset.dchBound="1";button.addEventListener("click",cycle);}});
    apply();
  }
  window.DCHTheme={apply:apply,cycle:cycle,preference:preference};
  ensureControl();
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",ensureControl,{once:true});
  if(media){var onChange=function(){if(preference()==="system")apply();};if(media.addEventListener)media.addEventListener("change",onChange);else if(media.addListener)media.addListener(onChange);}
})();
