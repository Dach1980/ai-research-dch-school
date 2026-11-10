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
  var sphere=document.createElement("div");sphere.className="lesson-planet-sphere";sphere.setAttribute("aria-hidden","true");sphere.textContent=code||"AI";
  art.appendChild(sphere);planet.appendChild(art);
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