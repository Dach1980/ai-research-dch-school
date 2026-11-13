(function(){
"use strict";
var lang=(document.documentElement.lang||"ru").toLowerCase();
var words=lang.indexOf("zh")===0?{check:"检查答案",correct:"回答正确！",wrong:"还不正确。",empty:"请选择一个答案。",answer:"解释："}:lang.indexOf("en")===0?{check:"Check answer",correct:"Correct!",wrong:"Not quite.",empty:"Choose an option first.",answer:"Explanation: "}:{check:"Проверить ответ",correct:"Верно!",wrong:"Пока неверно.",empty:"Сначала выберите вариант ответа.",answer:"Объяснение: "};
function styleLegacyGlossaries(){
document.querySelectorAll("main dl, .lesson dl, .lesson-page dl").forEach(function(dl){if(dl.dataset.cards==="1")return;var nodes=Array.from(dl.children);if(!nodes.length)return;var grid=document.createElement("div");grid.className="lesson-glossary";for(var i=0;i<nodes.length;i+=2){var term=nodes[i],definition=nodes[i+1];if(!term||!definition)continue;var card=document.createElement("article");card.className="glossary-entry";var number=document.createElement("span");number.className="term-index";number.textContent=String(i/2+1).padStart(2,"0");var title=document.createElement("strong");title.className="term";title.textContent=term.textContent;var en=document.createElement("span");en.className="term-en";en.textContent="TERM";var p=document.createElement("p");p.textContent=definition.textContent;card.append(number,title,en,p);grid.append(card);}dl.replaceWith(grid);});
}
function enhanceExplicitChecks(){
document.querySelectorAll(".lesson-check-question[data-correct]").forEach(function(card){
if(card.dataset.enhanced==="1")return;var boxes=Array.from(card.querySelectorAll('input[type="checkbox"]'));var button=card.querySelector(".lesson-check-button");var feedback=card.querySelector(".lesson-check-feedback");if(!boxes.length||!button||!feedback)return;
if(card.dataset.mode==="single"||card.dataset.mode==="yesno")boxes.forEach(function(box){box.addEventListener("change",function(){if(box.checked)boxes.forEach(function(other){if(other!==box)other.checked=false;});});});
button.addEventListener("click",function(){var selected=boxes.filter(function(box){return box.checked;}).map(function(box){return box.value;}).sort();var expected=card.dataset.correct.split(",").sort();feedback.hidden=false;feedback.classList.remove("is-correct","is-wrong");if(!selected.length){feedback.textContent=words.empty;return;}var ok=selected.length===expected.length&&selected.every(function(value,index){return value===expected[index];});feedback.classList.add(ok?"is-correct":"is-wrong");feedback.textContent=(ok?words.correct:words.wrong)+" "+(card.dataset.explanation||"");});
card.dataset.enhanced="1";
});
}
styleLegacyGlossaries();enhanceExplicitChecks();
})();
