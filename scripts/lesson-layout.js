(function(){
"use strict";
var main=document.querySelector("main.lesson, main.container");
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
  "a-1-2-1-les-a-0002.html": {
    "uid": "les-a-0002",
    "old": "1.1.3",
    "code": "1.2.1",
    "theme": 1,
    "module": 2
  },
  "a-1-2-2-les-a-0052.html": {
    "uid": "les-a-0052",
    "old": "1.1.4",
    "code": "1.2.2",
    "theme": 1,
    "module": 2
  },
  "a-2-1-1-les-a-0003.html": {
    "uid": "les-a-0003",
    "old": "1.2.1",
    "code": "2.1.1",
    "theme": 2,
    "module": 1
  },
  "a-2-1-2-les-a-0004.html": {
    "uid": "les-a-0004",
    "old": "1.2.2",
    "code": "2.1.2",
    "theme": 2,
    "module": 1
  },
  "a-2-1-3-les-a-0056.html": {
    "uid": "les-a-0056",
    "old": "1.2.3",
    "code": "2.1.3",
    "theme": 2,
    "module": 1
  },
  "a-2-2-1-les-a-0050.html": {
    "uid": "les-a-0050",
    "old": "1.2.4",
    "code": "2.2.1",
    "theme": 2,
    "module": 2
  },
  "a-2-2-2-les-a-0005.html": {
    "uid": "les-a-0005",
    "old": "1.2.5",
    "code": "2.2.2",
    "theme": 2,
    "module": 2
  },
  "a-2-2-3-les-a-0006.html": {
    "uid": "les-a-0006",
    "old": "1.2.6",
    "code": "2.2.3",
    "theme": 2,
    "module": 2
  },
  "a-3-1-1-les-a-0007.html": {
    "uid": "les-a-0007",
    "old": "1.3.1",
    "code": "3.1.1",
    "theme": 3,
    "module": 1
  },
  "a-3-1-2-les-a-0008.html": {
    "uid": "les-a-0008",
    "old": "1.3.2",
    "code": "3.1.2",
    "theme": 3,
    "module": 1
  },
  "a-3-1-3-les-a-0053.html": {
    "uid": "les-a-0053",
    "old": "1.3.3",
    "code": "3.1.3",
    "theme": 3,
    "module": 1
  },
  "a-3-2-1-les-a-0054.html": {
    "uid": "les-a-0054",
    "old": "1.3.4",
    "code": "3.2.1",
    "theme": 3,
    "module": 2
  },
  "a-3-2-2-les-a-0055.html": {
    "uid": "les-a-0055",
    "old": "1.3.5",
    "code": "3.2.2",
    "theme": 3,
    "module": 2
  },
  "a-3-2-3-les-a-0009.html": {
    "uid": "les-a-0009",
    "old": "1.3.6",
    "code": "3.2.3",
    "theme": 3,
    "module": 2
  },
  "a-4-1-1-les-a-0010.html": {
    "uid": "les-a-0010",
    "old": "1.4.1",
    "code": "4.1.1",
    "theme": 4,
    "module": 1
  },
  "a-4-1-2-les-a-0011.html": {
    "uid": "les-a-0011",
    "old": "1.4.2",
    "code": "4.1.2",
    "theme": 4,
    "module": 1
  },
  "a-4-1-3-les-a-0012.html": {
    "uid": "les-a-0012",
    "old": "1.4.3",
    "code": "4.1.3",
    "theme": 4,
    "module": 1
  },
  "a-4-2-1-les-a-0013.html": {
    "uid": "les-a-0013",
    "old": "1.4.4",
    "code": "4.2.1",
    "theme": 4,
    "module": 2
  },
  "a-4-2-2-les-a-0014.html": {
    "uid": "les-a-0014",
    "old": "1.4.5",
    "code": "4.2.2",
    "theme": 4,
    "module": 2
  },
  "a-5-1-1-les-a-0043.html": {
    "uid": "les-a-0043",
    "old": "1.5.1",
    "code": "5.1.1",
    "theme": 5,
    "module": 1
  },
  "a-5-1-2-les-a-0044.html": {
    "uid": "les-a-0044",
    "old": "1.5.2",
    "code": "5.1.2",
    "theme": 5,
    "module": 1
  },
  "a-5-1-3-les-a-0045.html": {
    "uid": "les-a-0045",
    "old": "1.5.3",
    "code": "5.1.3",
    "theme": 5,
    "module": 1
  },
  "a-5-1-4-les-a-0046.html": {
    "uid": "les-a-0046",
    "old": "1.5.4",
    "code": "5.1.4",
    "theme": 5,
    "module": 1
  },
  "a-5-2-1-les-a-0047.html": {
    "uid": "les-a-0047",
    "old": "1.5.5",
    "code": "5.2.1",
    "theme": 5,
    "module": 2
  },
  "a-5-2-2-les-a-0015.html": {
    "uid": "les-a-0015",
    "old": "1.5.6",
    "code": "5.2.2",
    "theme": 5,
    "module": 2
  },
  "a-5-2-3-les-a-0048.html": {
    "uid": "les-a-0048",
    "old": "1.5.7",
    "code": "5.2.3",
    "theme": 5,
    "module": 2
  },
  "a-5-2-4-les-a-0057.html": {
    "uid": "les-a-0057",
    "old": "1.5.8",
    "code": "5.2.4",
    "theme": 5,
    "module": 2
  },
  "a-7-1-1-les-a-0018.html": {
    "uid": "les-a-0018",
    "old": "4.2.1",
    "code": "7.1.1",
    "theme": 7,
    "module": 1
  }
};
canonicalLessonByRoute["a-1-2-1-les-a-0002.html"] = canonicalLessonByRoute["a-1-2-1-les-a-0002.html"];
var canonicalLessonByUid = {};
Object.keys(canonicalLessonByRoute).forEach(function(route){
 var item=canonicalLessonByRoute[route];
 canonicalLessonByUid[item.uid]=item;
});
window.DCH_CANONICAL_LESSON_BY_UID=canonicalLessonByUid;
var currentFile=window.location.pathname.split("/").pop().replace(/-(en|zh)\.html$/,".html");
var currentCanonicalLesson=canonicalLessonByRoute[currentFile];
if(currentCanonicalLesson){
 var eyebrowForNumbering=main&&main.querySelector(".eyebrow");
 if(eyebrowForNumbering){
  eyebrowForNumbering.textContent=eyebrowForNumbering.textContent.replace(/THEME\s+\d+\s+·\s+MODULE\s+\d+\s+·\s+LESSON\s+[\d.]+/i,
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
 if(description){var descriptionValue=description.getAttribute("content")||"";description.setAttribute("content",descriptionValue.replace(/^(Урок|Lesson)\s+[\d.]+/i,function(prefix){return prefix.replace(/[\d.]+$/,currentCanonicalLesson.code);}));}
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
 main.querySelectorAll(".lesson-glossary .lesson-glossary").forEach(function(nested){
  var parent=nested.parentElement;
  while(nested.firstChild)parent.insertBefore(nested.firstChild,nested);
  nested.remove();
 });
 var existingHero=main.querySelector(":scope > .track-hero");
 if(main.classList.contains("lesson")){
  var intro=main.querySelector(":scope > .lesson-intro");
  var eyebrow=intro?intro.querySelector(":scope > .eyebrow"):main.querySelector(":scope > .eyebrow");
  var h1=intro?intro.querySelector(":scope > h1"):main.querySelector(":scope > h1");
  var lead=intro?intro.querySelector(":scope > .lead"):main.querySelector(":scope > .lead");
  var metadata=intro&&intro.querySelector(":scope > .lesson-meta");
  var outcomes=main.querySelector(":scope > .outcomes, :scope > .panel, :scope > #lesson-outcomes");
  if(eyebrow&&h1&&lead&&!existingHero){
   var hero=document.createElement("section");hero.className="track-hero article-hero lesson-standard-hero";
   [eyebrow,h1,lead].forEach(function(node){hero.appendChild(node);});
   if(metadata)hero.appendChild(metadata);
   if(outcomes)hero.appendChild(outcomes);
   if(intro)intro.remove();
   var code=(eyebrow.textContent.match(/\b\d+\.\d+\.\d+\b/)||[])[0]||"AI";
   var planet=document.createElement("div");planet.className="lesson-planet-banner";
   var copy=document.createElement("div");var label=document.createElement("span");label.className="planet-label";label.textContent=labels.lesson+" "+code;
   var p=document.createElement("p");p.textContent=lead.textContent;copy.append(label,p);
   var art=document.createElement("div");art.className="lesson-planet-art";
   var sphere=document.createElement("div");sphere.className="lesson-planet-sphere";sphere.setAttribute("aria-hidden","true");sphere.textContent=code;
   art.appendChild(sphere);planet.append(copy,art);
   var article=document.createElement("article");article.className="article-body lesson-standard-article";
   while(main.firstChild){article.appendChild(main.firstChild);}
   main.append(hero,planet,article);
  }
  main.classList.add("lesson-standard-page");
  var articleBody=main.querySelector(":scope > .article-body");
  if(articleBody)articleBody.classList.add("lesson-standard-article");
  var practiceRoot=main.querySelector("#lesson-practice");
  var sourcesRoot=main.querySelector("#lesson-sources");
  var quizRoot=main.querySelector("#lesson-quiz");
  if(practiceRoot)practiceRoot.classList.add("lesson-practice");
  if(sourcesRoot)sourcesRoot.classList.add("lesson-sources");
  if(quizRoot)quizRoot.classList.add("lesson-check");
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
 fetch(catalogUrl.href).then(function(response){
  if(!response.ok)throw new Error("Catalog request failed");
  return response.json();
 }).then(function(catalog){
  var allLessons=(catalog.lessons||[]).filter(function(item){
   return item.track_uid==="trk-a"&&item.url_i18n&&item.url_i18n[locale];
  }).sort(function(a,b){return a.code.localeCompare(b.code,"en",{numeric:true});});
  var published=allLessons.filter(function(item){
   return item.status==="published"&&item.content_state==="published";
  });
  var currentPath=window.location.pathname.split("/").pop();
  var currentLesson=allLessons.find(function(item){return item.url_i18n[locale].split("/").pop()===currentPath;});
  if(!currentLesson)return;
  var index=published.findIndex(function(item){return item.uid===currentLesson.uid;});
  var fragment=document.createDocumentFragment();
  var previous=null;
  if(index>=0){
   previous=index>0?published[index-1]:null;
  }else{
   previous=published.filter(function(item){return item.code.localeCompare(currentLesson.code,"en",{numeric:true})<0;}).pop()||null;
  }
  if(previous&&previous.url_i18n&&previous.url_i18n[locale]){
   fragment.appendChild(link("secondary",new URL(previous.url_i18n[locale],rootUrl).href,text.previous+displayCode(previous)));
  }
  var next=index>=0&&index<published.length-1?published[index+1]:null;
  if(next&&next.url_i18n&&next.url_i18n[locale]){
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
  if(!nav.querySelector("a,span")){
   var fallback=document.createDocumentFragment();
   var suffix=locale==="ru"?"":"-"+locale;
   fallback.appendChild(link("secondary",new URL("learning-map/index"+suffix+".html",rootUrl).href,text.map));
   fallback.appendChild(link("secondary",new URL("tracks/understanding-ai"+suffix+".html",rootUrl).href,text.track));
   fallback.appendChild(link("secondary",new URL("lessons/index"+suffix+".html",rootUrl).href,text.all));
   nav.setAttribute("aria-label",text.aria);nav.replaceChildren(fallback);
  }
 });
})();
