(function(){
"use strict";
var main=document.querySelector("main.lesson");
var lang=(document.documentElement.lang||"ru").toLowerCase();
var labels=lang.indexOf("zh")===0?{lesson:"课程",planet:"知识星球"}:lang.indexOf("en")===0?{lesson:"LESSON",planet:"KNOWLEDGE PLANET"}:{lesson:"УРОК",planet:"ПЛАНЕТА ЗНАНИЙ"};
/* Canonical numbering overlay for the 30 already-published Track A lessons.
 * Legacy filenames, canonical URLs, lesson UIDs and stored progress remain unchanged.
 * Mapping source: CANONICAL_LESSON_MIGRATION_CROSSWALK_2026-11-17.csv
 */
var canonicalLessonByRoute = {
  "a-1-1-1.html": {
    "uid": "les-a-0001",
    "old": "1.1.1",
    "code": "1.1.1",
    "theme": 1,
    "module": 1
  },
  "a-1-1-2.html": {
    "uid": "les-a-0051",
    "old": "1.1.2",
    "code": "1.1.2",
    "theme": 1,
    "module": 1
  },
  "a-1-1-3.html": {
    "uid": "les-a-0002",
    "old": "1.1.3",
    "code": "1.2.1",
    "theme": 1,
    "module": 2
  },
  "a-1-1-4.html": {
    "uid": "les-a-0052",
    "old": "1.1.4",
    "code": "1.2.2",
    "theme": 1,
    "module": 2
  },
  "a-1-2-1.html": {
    "uid": "les-a-0003",
    "old": "1.2.1",
    "code": "2.1.1",
    "theme": 2,
    "module": 1
  },
  "a-1-2-2.html": {
    "uid": "les-a-0004",
    "old": "1.2.2",
    "code": "2.1.2",
    "theme": 2,
    "module": 1
  },
  "a-1-2-3.html": {
    "uid": "les-a-0056",
    "old": "1.2.3",
    "code": "2.1.3",
    "theme": 2,
    "module": 1
  },
  "a-1-2-4.html": {
    "uid": "les-a-0050",
    "old": "1.2.4",
    "code": "2.2.1",
    "theme": 2,
    "module": 2
  },
  "a-1-2-5.html": {
    "uid": "les-a-0005",
    "old": "1.2.5",
    "code": "2.2.2",
    "theme": 2,
    "module": 2
  },
  "a-1-2-6.html": {
    "uid": "les-a-0006",
    "old": "1.2.6",
    "code": "2.2.3",
    "theme": 2,
    "module": 2
  },
  "a-1-3-1.html": {
    "uid": "les-a-0007",
    "old": "1.3.1",
    "code": "3.1.1",
    "theme": 3,
    "module": 1
  },
  "a-1-3-2.html": {
    "uid": "les-a-0008",
    "old": "1.3.2",
    "code": "3.1.2",
    "theme": 3,
    "module": 1
  },
  "a-1-3-3.html": {
    "uid": "les-a-0053",
    "old": "1.3.3",
    "code": "3.1.3",
    "theme": 3,
    "module": 1
  },
  "a-1-3-4.html": {
    "uid": "les-a-0054",
    "old": "1.3.4",
    "code": "3.2.1",
    "theme": 3,
    "module": 2
  },
  "a-1-3-5.html": {
    "uid": "les-a-0055",
    "old": "1.3.5",
    "code": "3.2.2",
    "theme": 3,
    "module": 2
  },
  "a-1-3-6.html": {
    "uid": "les-a-0009",
    "old": "1.3.6",
    "code": "3.2.3",
    "theme": 3,
    "module": 2
  },
  "a-1-4-1.html": {
    "uid": "les-a-0010",
    "old": "1.4.1",
    "code": "4.1.1",
    "theme": 4,
    "module": 1
  },
  "a-1-4-2.html": {
    "uid": "les-a-0011",
    "old": "1.4.2",
    "code": "4.1.2",
    "theme": 4,
    "module": 1
  },
  "a-1-4-3.html": {
    "uid": "les-a-0012",
    "old": "1.4.3",
    "code": "4.1.3",
    "theme": 4,
    "module": 1
  },
  "a-1-4-4.html": {
    "uid": "les-a-0013",
    "old": "1.4.4",
    "code": "4.2.1",
    "theme": 4,
    "module": 2
  },
  "a-1-4-5.html": {
    "uid": "les-a-0014",
    "old": "1.4.5",
    "code": "4.2.2",
    "theme": 4,
    "module": 2
  },
  "a-1-5-1.html": {
    "uid": "les-a-0043",
    "old": "1.5.1",
    "code": "5.1.1",
    "theme": 5,
    "module": 1
  },
  "a-1-5-2.html": {
    "uid": "les-a-0044",
    "old": "1.5.2",
    "code": "5.1.2",
    "theme": 5,
    "module": 1
  },
  "a-1-5-3.html": {
    "uid": "les-a-0045",
    "old": "1.5.3",
    "code": "5.1.3",
    "theme": 5,
    "module": 1
  },
  "a-1-5-4.html": {
    "uid": "les-a-0046",
    "old": "1.5.4",
    "code": "5.1.4",
    "theme": 5,
    "module": 1
  },
  "a-1-5-5.html": {
    "uid": "les-a-0047",
    "old": "1.5.5",
    "code": "5.2.1",
    "theme": 5,
    "module": 2
  },
  "a-1-5-6.html": {
    "uid": "les-a-0015",
    "old": "1.5.6",
    "code": "5.2.2",
    "theme": 5,
    "module": 2
  },
  "a-1-5-7.html": {
    "uid": "les-a-0048",
    "old": "1.5.7",
    "code": "5.2.3",
    "theme": 5,
    "module": 2
  },
  "a-1-5-8.html": {
    "uid": "les-a-0057",
    "old": "1.5.8",
    "code": "5.2.4",
    "theme": 5,
    "module": 2
  },
  "a-4-2-1.html": {
    "uid": "les-a-0018",
    "old": "4.2.1",
    "code": "7.1.1",
    "theme": 7,
    "module": 1
  }
};
var canonicalLessonByUid = {};
Object.keys(canonicalLessonByRoute).forEach(function(route){
 var item=canonicalLessonByRoute[route];
 canonicalLessonByUid[item.uid]=item;
});
window.DCH_CANONICAL_LESSON_BY_UID=canonicalLessonByUid;
var currentFile=window.location.pathname.split("/").pop().replace(/-(en|zh)\\.html$/,".html");
var currentCanonicalLesson=canonicalLessonByRoute[currentFile];
if(currentCanonicalLesson){
 var eyebrowForNumbering=main&&main.querySelector(".eyebrow");
 if(eyebrowForNumbering){
  eyebrowForNumbering.textContent=eyebrowForNumbering.textContent.replace(/THEME\\s+\\d+\\s+·\\s+MODULE\\s+\\d+\\s+·\\s+LESSON\\s+[\\d.]+/i,
   "THEME "+currentCanonicalLesson.theme+" · MODULE "+currentCanonicalLesson.module+" · LESSON "+currentCanonicalLesson.code);
 }
 var titleElement=document.querySelector("title");
 if(titleElement&&titleElement.textContent.indexOf(currentCanonicalLesson.old)===0){
  titleElement.textContent=currentCanonicalLesson.code+titleElement.textContent.slice(currentCanonicalLesson.old.length);
  document.title=titleElement.textContent;
 }
 var ogTitle=document.querySelector('meta[property="og:title"]');
 if(ogTitle){var ogValue=ogTitle.getAttribute("content")||"";if(ogValue.indexOf(currentCanonicalLesson.old)===0)ogTitle.setAttribute("content",currentCanonicalLesson.code+ogValue.slice(currentCanonicalLesson.old.length));}
 var description=document.querySelector('meta[name="description"]');
 if(description){var descriptionValue=description.getAttribute("content")||"";description.setAttribute("content",descriptionValue.replace(/^(Урок|Lesson)\\s+[\\d.]+/i,function(prefix){return prefix.replace(/[\\d.]+$/,currentCanonicalLesson.code);}));}
 var planetLabel=main&&main.querySelector(".planet-label");
 if(planetLabel&&planetLabel.textContent.indexOf(currentCanonicalLesson.old)>=0){planetLabel.textContent=planetLabel.textContent.replace(currentCanonicalLesson.old,currentCanonicalLesson.code);}
 var planetSphere=main&&main.querySelector(".lesson-planet-sphere");
 if(planetSphere&&planetSphere.textContent.trim()===currentCanonicalLesson.old){planetSphere.textContent=currentCanonicalLesson.code;}
}

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
 * The explicit curriculum sequence is the authority for lesson order; the catalog owns publication state.
 * this shared normalizer makes legacy page markup render consistently.
 */
(function(){
 "use strict";
 var nav=document.querySelector("nav.lesson-nav");
 if(!nav)return;
 var lang=(document.documentElement.lang||"ru").toLowerCase();
 var locale=lang.indexOf("zh")===0?"zh":lang.indexOf("en")===0?"en":"ru";
 var labels={
  ru:{aria:"Навигация по уроку",previous:"← Предыдущий урок ",next:"Следующий урок ",nextSoon:"Следующий урок скоро",map:"Карта знаний ↗",track:"Программа Track A",all:"Все уроки ↗"},
  en:{aria:"Lesson navigation",previous:"← Previous lesson ",next:"Next lesson ",nextSoon:"Next lesson coming soon",map:"Knowledge map ↗",track:"Track A programme",all:"All lessons ↗"},
  zh:{aria:"课程导航",previous:"← 上一课 ",next:"下一课 ",nextSoon:"下一课即将推出",map:"知识地图 ↗",track:"Track A 学习计划",all:"全部课程 ↗"}
 };
 var text=labels[locale];
 var script=document.querySelector('script[src$="lesson-layout.js"]');
 var scriptUrl=script&&script.src?script.src:document.baseURI;
 var catalogUrl=new URL("../data/catalog/catalog-v3.json",scriptUrl);
 var rootUrl=new URL("../",scriptUrl);
 function displayCode(item){var registry=window.DCH_CANONICAL_LESSON_BY_UID||{};var mapped=item&&registry[item.uid];return mapped?mapped.code:item.code;}
 function link(className,href,label){
  var a=document.createElement("a");
  a.className="button "+className;
  a.href=href;
  a.textContent=label;
  return a;
 }
 Promise.all([fetch(catalogUrl.href),fetch(new URL("../data/curriculum-sequence-track-a.json",scriptUrl).href)]).then(function(responses){
  if(!responses[0].ok||!responses[1].ok)throw new Error("Catalog or curriculum sequence request failed");
  return Promise.all(responses.map(function(response){return response.json();}));
 }).then(function(payload){
  var catalog=payload[0],sequence=payload[1];
  var steps=sequence.steps||[];
  var byUid={};
  (catalog.lessons||[]).forEach(function(item){byUid[item.uid]=item;});
  var currentPath=window.location.pathname.split("/").pop();
  var index=steps.findIndex(function(step){
   if(step.kind!=="lesson")return false;
   var item=byUid[step.lesson_uid];
   return item&&item.url_i18n&&item.url_i18n[locale]&&item.url_i18n[locale].split("/").pop()===currentPath;
  });
  if(index<0)return;
  var fragment=document.createDocumentFragment();
  var previousStep=index>0?steps[index-1]:null;
  var previous=previousStep&&previousStep.kind==="lesson"?byUid[previousStep.lesson_uid]:null;
  if(previous&&previous.status==="published"&&previous.url_i18n&&previous.url_i18n[locale]){
   fragment.appendChild(link("secondary",new URL(previous.url_i18n[locale],rootUrl).href,text.previous+displayCode(previous)));
  }
  var nextStep=index<steps.length-1?steps[index+1]:null;
  var next=nextStep&&nextStep.kind==="lesson"?byUid[nextStep.lesson_uid]:null;
  if(next&&next.status==="published"&&next.url_i18n&&next.url_i18n[locale]){
   fragment.appendChild(link("primary",new URL(next.url_i18n[locale],rootUrl).href,text.next+displayCode(next)+" ↗"));
  }else{
   var pending=document.createElement("span");
   pending.className="button primary is-disabled";
   pending.setAttribute("aria-disabled","true");
   pending.textContent=text.nextSoon;
   fragment.appendChild(pending);
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
