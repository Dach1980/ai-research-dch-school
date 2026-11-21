(function(){
"use strict";
const lesson=window.DCH_ALE_813;
if(!lesson)throw new Error("ALE lesson data is missing");
const raw=(document.documentElement.lang||"ru").toLowerCase();
const locale=raw.startsWith("zh")?"zh":raw.startsWith("en")?"en":"ru";
const data=lesson.content[locale];
const L={ru:{outcomes:"Результаты обучения",practice:"Практическая работа",sources:"Источники и дополнительное чтение",quiz:"Проверка знаний",submit:"Проверить ответы",correct:"Верно",incorrect:"Неверно",score:"Результат",install:"Установка",run:"Запуск",expected:"Ожидаемые наблюдения",glossary:"Словарь терминов",task:"Задание"},en:{outcomes:"Learning outcomes",practice:"Practical lab",sources:"Sources and further reading",quiz:"Knowledge check",submit:"Check answers",correct:"Correct",incorrect:"Incorrect",score:"Score",install:"Install",run:"Run",expected:"Expected observations",glossary:"Key terms",task:"Task"},zh:{outcomes:"学习成果",practice:"实践实验",sources:"参考资料与延伸阅读",quiz:"知识检测",submit:"检查答案",correct:"正确",incorrect:"错误",score:"得分",install:"安装",run:"运行",expected:"预期观察",glossary:"术语词典",task:"任务"}}[locale];
const byId=id=>document.getElementById(id),make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
document.title="8.1.3 — "+data.title+" — AI Research DCH School";byId("lesson-title").textContent=data.title;byId("lesson-lead").textContent=data.lead;
const out=byId("lesson-outcomes");out.append(make("h2","",L.outcomes));const ul=make("ul");data.outcomes.forEach(x=>ul.append(make("li","",x)));out.append(ul);
let seq=0;
function svgNode(tag,attrs={},value){
 const el=document.createElementNS("http://www.w3.org/2000/svg",tag);
 Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));
 if(value!==undefined)el.textContent=value;
 return el;
}
function diagram(kind){
 const id=++seq,zh=locale==="zh",en=locale==="en";
 const T=zh?{observed:"观测样本",global:"全局替换",local:"局部区间",feature:"特征值",rooms:"房间数",bin:"区间",mean:"区间平均差分",acc:"累积 ALE",pdp:"PDP：全局平均",ice:"ICE：个体曲线",ale:"ALE：局部累积",x:"特征值",y:"模型输出"}:en?{observed:"Observed rows",global:"Global substitutions",local:"Local bin",feature:"Floor area",rooms:"Room count",bin:"Bin",mean:"Mean bin difference",acc:"Accumulated ALE",pdp:"PDP: global average",ice:"ICE: individual curves",ale:"ALE: local accumulation",x:"Feature value",y:"Model output"}:{observed:"Наблюдаемые строки",global:"Глобальные подстановки",local:"Локальный интервал",feature:"Площадь",rooms:"Число комнат",bin:"Интервал",mean:"Средняя разность бина",acc:"Накопленный ALE",pdp:"PDP: глобальное среднее",ice:"ICE: индивидуальные кривые",ale:"ALE: локальное накопление",x:"Значение признака",y:"Выход модели"};
 const title=kind==="dependence"?T.global:kind==="algorithm"?T.acc:T.ale;
 const desc=kind==="dependence"?(zh?"相关特征的观测点沿对角线分布；全局替换产生远离观测云的组合。":en?"Observed correlated predictors form a diagonal cloud; global substitutions create combinations far from observed data.":"Наблюдения зависимых признаков образуют диагональное облако; глобальные подстановки создают комбинации вне области наблюдений."):kind==="algorithm"?(zh?"样本按特征区间分组，计算边界预测差，求区间均值并逐箱累积。":en?"Rows are grouped into feature bins; boundary prediction differences are averaged and accumulated bin by bin.":"Строки группируются по интервалам; разности предсказаний на границах усредняются и накапливаются по бинам."):(zh?"PDP 对全局替换求平均，ICE 展示个体曲线，ALE 累积局部区间变化。":en?"PDP averages global substitutions, ICE displays individual curves, and ALE accumulates local within-bin changes.":"PDP усредняет глобальные подстановки, ICE показывает индивидуальные кривые, ALE накапливает локальные изменения.");
 const uid="ale-"+locale+"-"+kind+"-"+id;
 const root=svgNode("svg",{viewBox:"0 0 900 440",width:"100%",height:"440",role:"img","aria-labelledby":uid+"-title "+uid+"-desc","data-diagram-type":"ale-"+kind,"data-diagram-renderer":"ale-scientific-v2","preserveAspectRatio":"xMidYMid meet"});
 root.append(svgNode("title",{id:uid+"-title"},title),svgNode("desc",{id:uid+"-desc"},desc));
 const ink="var(--lds-ink)",muted="var(--lds-muted)",grid="var(--lds-line)",accent="var(--lds-accent)",good="var(--lds-good)",bad="var(--lds-bad)",surface="var(--lds-surface)";
 const txt=(x,y,s,size=15,anchor="middle",weight=400,color=ink)=>root.append(svgNode("text",{x,y,"font-size":size,"text-anchor":anchor,"font-weight":weight,fill:color},s));
 const line=(d,color=ink,width=2,dash="")=>root.append(svgNode("path",{d,fill:"none",stroke:color,"stroke-width":width,"stroke-dasharray":dash,"stroke-linecap":"round","stroke-linejoin":"round"}));
 const dot=(x,y,fill,rad=5,stroke="none")=>root.append(svgNode("circle",{cx:x,cy:y,r:rad,fill,stroke,"stroke-width":2}));
 const box=(x,y,w,h,fill="none",stroke=grid)=>root.append(svgNode("rect",{x,y,width:w,height:h,rx:8,fill,stroke,"stroke-width":1.5}));
 if(kind==="dependence"){
  const L=105,R=830,U=75,D=350;
  line("M "+L+" "+U+" V "+D+" H "+R,ink,2);
  [0,1,2,3].forEach(i=>line("M "+L+" "+(D-i*82)+" H "+R,grid,1,"4 7"));
  const points=[[.08,.12],[.13,.18],[.18,.22],[.23,.25],[.28,.31],[.33,.34],[.38,.40],[.43,.44],[.48,.49],[.53,.53],[.58,.60],[.63,.63],[.68,.70],[.73,.74],[.78,.78],[.83,.85],[.88,.88],[.93,.94],[.21,.17],[.39,.46],[.61,.57],[.76,.81]];
  points.forEach(([x,y])=>dot(L+x*(R-L),D-y*(D-U),good,5));
  [.12,.5,.88].forEach(x=>line("M "+(L+x*(R-L))+" "+U+" V "+D,bad,1.5,"5 6"));
  [[.12,.88],[.88,.12],[.12,.55],[.88,.45]].forEach(([x,y])=>dot(L+x*(R-L),D-y*(D-U),"none",7,bad));
  box(390,175,150,95,surface,accent);txt(465,199,T.local,14,"middle",700,accent);txt(465,223,T.observed,13);txt(465,245,"X₋ⱼ retained",12,"middle",400,muted);
  txt(465,397,T.feature+" →",16);root.append(svgNode("text",{x:27,y:220,transform:"rotate(-90 27 220)","font-size":16,"text-anchor":"middle",fill:ink},T.rooms+" →"));
  dot(130,32,good,5);txt(225,37,T.observed,14,"start");dot(430,32,"none",6,bad);txt(535,37,T.global,14,"start");
 }else if(kind==="algorithm"){
  txt(450,38,zh?"分箱 → 局部差分 → 累积":en?"Binning → local differences → accumulation":"Бины → локальные разности → накопление",19,"middle",700);
  const xs=[75,350,625];
  ["Δ̂₁ = 3","Δ̂₂ = 2","Δ̂₃ = −1"].forEach((v,i)=>{box(xs[i],78,250,62,i%2?surface:"none");txt(xs[i]+125,103,T.bin+" "+(i+1),14,"middle",700);txt(xs[i]+125,126,v,17,"middle",700,accent);if(i<2)txt(xs[i]+262,116,"→",22,"middle",700,accent);});
  txt(450,204,T.mean,16,"middle",700);
  line("M 105 360 H 820",ink,2);line("M 105 250 V 360",ink,2);
  const xx=[105,340,575,810],vv=[0,3,5,4],yy=vv.map(v=>350-v*15);
  line("M "+xx[0]+" "+yy[0]+" H "+xx[1]+" V "+yy[1]+" H "+xx[2]+" V "+yy[2]+" H "+xx[3]+" V "+yy[3],accent,4);
  xx.forEach((x,i)=>{dot(x,yy[i],accent,5);txt(x,yy[i]-13,String(vv[i]),13,"middle",700);});
  txt(450,405,T.acc,16,"middle",700);
 }else{
  const panels=[{x:35,title:T.pdp,type:"pdp"},{x:335,title:T.ice,type:"ice"},{x:635,title:T.ale,type:"ale"}];
  panels.forEach(p=>{
   const x=p.x+24,y=112,w=238,h=220;txt(x+w/2,62,p.title,15,"middle",700);
   line("M "+x+" "+y+" V "+(y+h)+" H "+(x+w),ink,1.7);
   [1,2,3].forEach(i=>line("M "+x+" "+(y+i*55)+" H "+(x+w),grid,1,"3 6"));
   if(p.type==="pdp")line("M "+(x+8)+" "+(y+180)+" C "+(x+70)+" "+(y+165)+", "+(x+120)+" "+(y+100)+", "+(x+230)+" "+(y+48),accent,4);
   else if(p.type==="ice"){line("M "+(x+8)+" "+(y+190)+" L "+(x+230)+" "+(y+48),good,2);line("M "+(x+8)+" "+(y+160)+" L "+(x+230)+" "+(y+92),good,2);line("M "+(x+8)+" "+(y+205)+" L "+(x+230)+" "+(y+132),good,2);line("M "+(x+8)+" "+(y+180)+" L "+(x+230)+" "+(y+74),good,2);}
   else{line("M "+(x+8)+" "+(y+185)+" H "+(x+78)+" V "+(y+145)+" H "+(x+150)+" V "+(y+92)+" H "+(x+230)+" V "+(y+118),accent,4);line("M "+(x+8)+" "+(y+115)+" H "+(x+230),muted,1.2,"4 5");}
   txt(x+w/2,y+h+32,T.x,13);
  });
  txt(450,420,T.y,14);
 }
 const figure=document.createElement("figure");figure.className="pfi-figure pfi-figure--shared ale-scientific-figure";
 const viewport=document.createElement("div");viewport.className="pfi-diagram-viewport";viewport.setAttribute("role","region");viewport.setAttribute("aria-label",desc);viewport.tabIndex=0;viewport.append(root);figure.append(viewport);
 const caption=document.createElement("figcaption");caption.textContent=kind==="dependence"?(zh?"绿色：观测数据；红色：全局替换产生的低支持组合。":en?"Green: observed data; red: low-support combinations created by global substitutions.":"Зелёный: наблюдения; красный: комбинации глобальных подстановок с низкой поддержкой данных."):kind==="algorithm"?(zh?"先计算每个区间的平均局部差分，再按区间顺序累积。":en?"Average local differences within each bin, then accumulate them in feature order.":"Сначала усредняются локальные разности внутри бинов, затем они накапливаются по порядку интервалов."):(zh?"示意曲线用于比较计算方式；纵轴刻度仅作概念说明。":en?"Conceptual curves compare calculation strategies; vertical scales are illustrative.":"Концептуальные кривые сравнивают методы; вертикальные масштабы условны.");
 figure.append(caption);return figure;
}
const root=byId("lesson-sections");data.sections.forEach(s=>{const section=make("section","xai-canonical-section");section.id="ale-"+s[0];section.append(make("h2","xai-canonical-section-title",s[1]));const body=make("div","xai-canonical-section-content");s[2].forEach(p=>body.append(make("p","",p)));if(s[0]==="definition")body.append(make("div","formula", "ALEⱼ(z) = ∫₍z₀₎ᶻ E[∂f(X)/∂Xⱼ | Xⱼ=t] dt − C"));if(["motivation","algorithm","choices"].includes(s[0]))body.append(diagram(s[0]==="motivation"?"dependence":s[0]==="choices"?"comparison":"algorithm"));section.append(body);root.append(section);});
const p=data.practice,pr=byId("lesson-practice");pr.append(make("h2","",L.practice),make("h3","",p.title),make("p","",p.intro),make("h3","",L.task),make("p","",p.task),make("p","",L.install+": python -m pip install numpy pandas matplotlib scikit-learn"));const pre=make("pre","language-python"),code=make("code","language-python");code.textContent=lesson.practiceCode;pre.dataset.language="python";pre.append(code);pr.append(pre,make("p","",L.run+": python lessons/practice/a-8-1-3-accumulated-local-effects.py"),make("h3","",L.expected),make("p","",p.expected));
const src=byId("lesson-sources");src.append(make("h2","",L.sources));const ol=make("ol");data.sources.forEach(([label,url])=>{const li=make("li"),a=make("a","",label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";li.append(a);ol.append(li);});src.append(ol);
if(!window.DCHLessonComponents||typeof window.DCHLessonComponents.renderGlossary!=="function")throw new Error("Canonical glossary component unavailable");window.DCHLessonComponents.renderGlossary(byId("lesson-glossary"),data.glossary,L.glossary);
const quiz=byId("lesson-quiz");quiz.append(make("h2","",L.quiz));const form=make("form","knowledge-check"),feedback=make("div","quiz-feedback");feedback.setAttribute("aria-live","polite");data.quiz.forEach((q,i)=>{const fs=make("fieldset");fs.append(make("legend","",(i+1)+". "+q[0]));q[1].forEach((option,j)=>{const label=make("label"),input=document.createElement("input");input.type="radio";input.name="q"+i;input.value=String(j);label.append(input,make("span","",option));fs.append(label);});form.append(fs);});const submit=make("button","quiz-submit",L.submit);submit.type="submit";form.append(submit,feedback);form.addEventListener("submit",event=>{event.preventDefault();let score=0;const result=make("ol");data.quiz.forEach((q,i)=>{const chosen=form.querySelector('input[name="q'+i+'"]:checked'),ok=chosen&&Number(chosen.value)===q[2];if(ok)score++;const li=make("li");li.append(make("strong","",(i+1)+". "+(ok?L.correct:L.incorrect)),make("p","",q[3]));result.append(li);});feedback.replaceChildren(document.createTextNode(L.score+": "+score+" / "+data.quiz.length),result);feedback.classList.add("is-visible");});quiz.append(form);
})();