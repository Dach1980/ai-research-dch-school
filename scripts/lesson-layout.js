(function(){
"use strict";
var main=document.querySelector("main.lesson");
var lang=(document.documentElement.lang||"ru").toLowerCase();
var labels=lang.indexOf("zh")===0?{lesson:"课程",planet:"知识星球"}:lang.indexOf("en")===0?{lesson:"LESSON",planet:"KNOWLEDGE PLANET"}:{lesson:"УРОК",planet:"ПЛАНЕТА ЗНАНИЙ"};
function normalizePlanet(root,code,lead){
 var planet=root.querySelector(".lesson-planet-banner,.planet-banner,.planet");
 if(!planet)return;
 planet.classList.add("lesson-planet-banner");
 var oldOrb=planet.querySelector(".orb");
 if(oldOrb){oldOrb.classList.add("lesson-planet-sphere");}
 if(!planet.querySelector(".lesson-planet-art")){
  var art=document.createElement("div");art.className="lesson-planet-art";
  if(oldOrb){oldOrb.parentNode.insertBefore(art,oldOrb);art.appendChild(oldOrb);}
  else{var sphere=document.createElement("div");sphere.className="lesson-planet-sphere";sphere.setAttribute("aria-hidden","true");sphere.textContent=code||"AI";art.appendChild(sphere);}
  planet.appendChild(art);
 }
 if(!planet.querySelector(".planet-label")){
  var label=document.createElement("span");label.className="planet-label";label.textContent=labels.planet;
  planet.insertBefore(label,planet.firstChild);
 }
 if(lead&&!planet.querySelector("p")){var p=document.createElement("p");p.textContent=lead.textContent;planet.appendChild(p);}
}
if(main){
 var existingHero=main.querySelector(":scope > .track-hero");
 if(main.classList.contains("lesson")){
  var eyebrow=main.querySelector(":scope > .eyebrow");
  var h1=main.querySelector(":scope > h1");
  var lead=main.querySelector(":scope > .lead");
  var outcomes=main.querySelector(":scope > .outcomes, :scope > .panel");
  if(eyebrow&&h1&&lead&&!existingHero){
   var hero=document.createElement("section");hero.className="track-hero article-hero lesson-standard-hero";
   [eyebrow,h1,lead].forEach(function(node){hero.appendChild(node);});
   if(outcomes)hero.appendChild(outcomes);
   var code=(eyebrow.textContent.match(/\b\d+\.\d+\.\d+\b/)||[])[0]||"AI";
   var planet=document.createElement("div");planet.className="lesson-planet-banner";
   var copy=document.createElement("div");var label=document.createElement("span");label.className="planet-label";label.textContent=labels.lesson+" "+code;
   var p=document.createElement("p");p.textContent=lead.textContent;copy.append(label,p);
   var art=document.createElement("div");art.className="lesson-planet-art";
   var sphere=document.createElement("div");sphere.className="lesson-planet-sphere";sphere.setAttribute("aria-hidden","true");sphere.textContent=code;
   art.appendChild(sphere);planet.append(copy,art);hero.appendChild(planet);
   var article=document.createElement("article");article.className="article-body lesson-standard-article";
   while(main.firstChild){article.appendChild(main.firstChild);}
   main.append(hero,article);
  }
  main.classList.add("lesson-standard-page");
  var articleBody=main.querySelector(":scope > .article-body");
  if(articleBody)articleBody.classList.add("lesson-standard-article");
  normalizePlanet(main,(main.querySelector(".eyebrow")?.textContent.match(/\b\d+\.\d+\.\d+\b/)||[])[0],main.querySelector(".lead"));
 }else{
  var hero=main.querySelector(":scope > .track-hero");
  if(hero)hero.classList.add("article-hero");
  normalizePlanet(main,(main.querySelector(".eyebrow")?.textContent.match(/\b\d+\.\d+\.\d+\b/)||[])[0],main.querySelector(".lead"));
 }
}
})();

/*
 * Canonical Track A lesson navigation.
 * The catalog is the authority for publication state and lesson order;
 * this shared normalizer makes legacy page markup render consistently.
 */
(function(){
 "use strict";
 var nav=document.querySelector("nav.lesson-nav");
 if(!nav)return;
 var lang=(document.documentElement.lang||"ru").toLowerCase();
 var locale=lang.indexOf("zh")===0?"zh":lang.indexOf("en")===0?"en":"ru";
 var labels={
  ru:{aria:"Навигация по уроку",previous:"← Предыдущий урок ",next:"Следующий урок ",map:"Карта знаний ↗",track:"Программа Track A",all:"Все уроки ↗"},
  en:{aria:"Lesson navigation",previous:"← Previous lesson ",next:"Next lesson ",map:"Knowledge map ↗",track:"Track A programme",all:"All lessons ↗"},
  zh:{aria:"课程导航",previous:"← 上一课 ",next:"下一课 ",map:"知识地图 ↗",track:"Track A 学习计划",all:"全部课程 ↗"}
 };
 var text=labels[locale];
 var script=document.querySelector('script[src$="lesson-layout.js"]');
 var scriptUrl=script&&script.src?script.src:document.baseURI;
 var catalogUrl=new URL("../data/catalog/catalog-v3.json",scriptUrl);
 var rootUrl=new URL("../",scriptUrl);
 function link(className,href,label){
  var a=document.createElement("a");
  a.className="button "+className;
  a.href=href;
  a.textContent=label;
  return a;
 }
 fetch(catalogUrl.href).then(function(response){
  if(!response.ok)throw new Error("Catalog request failed");
  return response.json();
 }).then(function(catalog){
  var published=(catalog.lessons||[]).filter(function(item){
   return item.track_uid==="trk-a"&&item.status==="published"&&item.url_i18n&&item.url_i18n[locale];
  }).sort(function(a,b){
   var aa=a.code.split(".").map(Number),bb=b.code.split(".").map(Number);
   for(var i=0;i<Math.max(aa.length,bb.length);i++){
    var diff=(aa[i]||0)-(bb[i]||0);if(diff)return diff;
   }
   return 0;
  });
  var currentPath=window.location.pathname.split("/").pop();
  var index=published.findIndex(function(item){
   return item.url_i18n[locale].split("/").pop()===currentPath;
  });
  if(index<0)return;
  var fragment=document.createDocumentFragment();
  if(index>0){
   var previous=published[index-1];
   fragment.appendChild(link("secondary",new URL(previous.url_i18n[locale],rootUrl).href,text.previous+previous.code));
  }
  if(index<published.length-1){
   var next=published[index+1];
   fragment.appendChild(link("primary",new URL(next.url_i18n[locale],rootUrl).href,text.next+next.code+" ↗"));
  }
  var suffix=locale==="ru"?"":"-"+locale;
  fragment.appendChild(link("secondary",new URL("learning-map/index"+suffix+".html",rootUrl).href,text.map));
  fragment.appendChild(link("secondary",new URL("tracks/understanding-ai"+suffix+".html",rootUrl).href,text.track));
  fragment.appendChild(link("secondary",new URL("lessons/index"+suffix+".html",rootUrl).href,text.all));
  nav.setAttribute("aria-label",text.aria);
  nav.replaceChildren(fragment);
 }).catch(function(error){
  console.warn("DCH lesson navigation could not be synchronized with the catalog.",error);
 });
})();
