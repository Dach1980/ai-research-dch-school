(function(global){
"use strict";
const NS="http://www.w3.org/2000/svg";
const MIN_FONT=14, LINE=21, PAD_X=12, PAD_Y=14, GAP=24, MARGIN=24;
function svgEl(name,attrs={},text){
 const el=document.createElementNS(NS,name);
 Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));
 if(text!==undefined)el.textContent=text;
 return el;
}
function measureContext(){
 const canvas=document.createElement("canvas");
 const ctx=canvas.getContext("2d");
 if(!ctx)throw new Error("SVG renderer requires Canvas text measurement");
 return ctx;
}
function wrap(ctx,text,maxWidth,font){
 ctx.font=font;
 const words=String(text).split(/\s+/).flatMap(word=>{ if(ctx.measureText(word).width<=maxWidth)return [word]; const chars=Array.from(word),parts=[];let part=""; for(const char of chars){const next=part+char;if(part&&ctx.measureText(next).width>maxWidth){parts.push(part);part=char;}else part=next;} if(part)parts.push(part);return parts; });
 const lines=[];let line="";
 for(const word of words){
  const candidate=line?line+" "+word:word;
  if(line&&ctx.measureText(candidate).width>maxWidth){lines.push(line);line=word;}
  else line=candidate;
 }
 if(line)lines.push(line);
 return lines.length?lines:[""];
}
function prepareNode(ctx,node,width){
 const titleFont="700 15px system-ui, sans-serif";
 const bodyFont="14px system-ui, sans-serif";
 const title=wrap(ctx,node.title,width-PAD_X*2,titleFont);
 const body=node.detail?wrap(ctx,node.detail,width-PAD_X*2,bodyFont):[];
 const height=PAD_Y*2+title.length*LINE+ (body.length?8+body.length*19:0);
 return {...node,width,height,titleLines:title,bodyLines:body};
}
function addTextLines(group,lines,x,y,fontSize,weight,color,lineHeight){
 const accent=String(color).includes("--lds-accent-ink");
 lines.forEach((line,i)=>group.append(svgEl("text",{x,y:y+i*lineHeight,"font-size":fontSize,"font-weight":weight,style:`fill:${color}${accent?" !important":""}`,"data-role":"node-text"},line)));
}
function chartFrame(spec){
 const width=760,height=430,left=112,right=710,top=74,bottom=326;
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
 const root=svgEl("svg",{viewBox:"0 0 "+width+" "+height,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:width+"px",height:height+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 root.append(svgEl("path",{d:"M "+left+" "+top+" V "+bottom+" H "+right,fill:"none",stroke:colors.ink,"stroke-width":2}));
 [top+63,top+126,top+189].forEach(y=>root.append(svgEl("path",{d:"M "+left+" "+y+" H "+right,fill:"none",stroke:colors.line,"stroke-dasharray":"5 7"})));
 root.append(svgEl("text",{x:(left+right)/2,y:382,"text-anchor":"middle","font-size":17,fill:colors.ink},spec.xLabel||"x"));
 root.append(svgEl("text",{x:30,y:(top+bottom)/2,transform:"rotate(-90 30 "+((top+bottom)/2)+")","text-anchor":"middle","font-size":17,fill:colors.ink},spec.yLabel||"y"));
 return {root,width,height,left,right,top,bottom,colors};
}
function renderWeightedScatter(spec){
 const f=chartFrame(spec),{root,left,right,top,bottom,colors}=f;
 const points=Array.isArray(spec.points)?spec.points:[];
 const line=points.map((p,i)=>(i?"L ":"M ")+(left+p[0]*(right-left))+" "+(bottom-p[1]*(bottom-top))).join(" ");
 root.append(svgEl("path",{d:line,fill:"none",stroke:colors.accent,"stroke-width":3,"stroke-dasharray":"8 6","stroke-linecap":"round"}));
 points.forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:4+Math.max(0,Math.min(1,p[2]||0))*9,fill:colors.good,opacity:.78,stroke:colors.surface,"stroke-width":1.5,"data-weight":p[2]})));
 root.append(svgEl("text",{x:left+8,y:top+20,"font-size":14,fill:colors.muted},spec.pointNote||"Larger marker = greater weight"));
 return chartFigure(root,spec);
}
function renderBars(spec){
 const width=760,height=390,left=260,right=690,top=82,row=76,zero=left+(right-left)/2;
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
 const root=svgEl("svg",{viewBox:"0 0 "+width+" "+height,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:width+"px",height:height+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 root.append(svgEl("path",{d:"M "+zero+" "+(top-22)+" V "+(top+row*spec.bars.length-12),stroke:colors.ink,"stroke-width":2}));
 spec.bars.forEach((b,i)=>{
  const y=top+i*row,w=Math.abs(b.value)*850,x=b.value>=0?zero:zero-w;
  root.append(svgEl("text",{x:left-14,y:y+19,"text-anchor":"end","font-size":16,fill:colors.ink},b.label));
  root.append(svgEl("rect",{x,y:y,width:w,height:30,rx:5,fill:b.value>=0?colors.good:colors.bad,opacity:.9}));
  root.append(svgEl("text",{x:b.value>=0?x+w+8:x-8,y:y+21,"text-anchor":b.value>=0?"start":"end","font-size":15,"font-weight":700,fill:colors.ink},(b.value>0?"+":"")+b.value.toFixed(2)));
 });
 root.append(svgEl("text",{x:zero,y:height-25,"text-anchor":"middle","font-size":14,fill:colors.muted},spec.zeroLabel||"0"));
 return chartFigure(root,spec);
}
function renderTable(spec){
 const width=760,rowH=48,top=82,height=top+rowH*(spec.rows.length+1)+30,left=28,col1=430,col2=width-left-col1;
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)"};
 const root=svgEl("svg",{viewBox:"0 0 "+width+" "+height,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:width+"px",height:height+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 root.append(svgEl("rect",{x:left,y:top,width:col1+col2,height:rowH,rx:8,fill:colors.accent,opacity:.13}));
 spec.columns.forEach((v,i)=>root.append(svgEl("text",{x:left+16+(i?col1:0),y:top+30,"font-size":15,"font-weight":700,fill:colors.ink},v)));
 spec.rows.forEach((r,i)=>{
  const y=top+rowH*(i+1);
  root.append(svgEl("path",{d:"M "+left+" "+y+" H "+(left+col1+col2),stroke:colors.line}));
  root.append(svgEl("text",{x:left+16,y:y+30,"font-size":15,fill:colors.ink},r[0]));
  root.append(svgEl("text",{x:left+col1+16,y:y+30,"font-size":15,"font-weight":700,fill:colors.ink},r[1]));
 });
 return chartFigure(root,spec);
}
function chartFigure(root,spec){
 const figure=document.createElement("figure");figure.className="pfi-figure pfi-figure--shared";
 const viewport=document.createElement("div");viewport.className="pfi-diagram-viewport";viewport.setAttribute("role","region");viewport.setAttribute("aria-label",spec.scrollLabel||spec.title);viewport.tabIndex=0;viewport.append(root);figure.append(viewport);
 const caption=document.createElement("figcaption");caption.textContent=spec.caption;figure.append(caption);return figure;
}
function renderChart(spec){
 const width=760,height=430,left=96,right=700,top=82,bottom=326;
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
 const root=svgEl("svg",{viewBox:"0 0 "+width+" "+height,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:width+"px",height:height+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 root.append(svgEl("path",{d:"M "+left+" "+top+" V "+bottom+" H "+right,fill:"none",stroke:colors.ink,"stroke-width":2}));
 [top+62,top+124,top+186].forEach(y=>root.append(svgEl("path",{d:"M "+left+" "+y+" H "+right,fill:"none",stroke:colors.line,"stroke-dasharray":"5 7"})));
 if(spec.layout==="plot"){
  const points=Array.isArray(spec.points)?spec.points:[];
  const path=points.map((p,i)=>(i?"L ":"M ")+(left+p[0]*(right-left))+" "+(bottom-p[1]*(bottom-top))).join(" ");
  root.append(svgEl("path",{d:path,fill:"none",stroke:colors.accent,"stroke-width":5,"stroke-linecap":"round","stroke-linejoin":"round"}));
  points.filter((_,i)=>i===2||i===5).forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:7,fill:colors.good})));
  (spec.annotations||[]).forEach(a=>{
   const x=Math.max(left,Math.min(right-210,left+a.x*(right-left))),y=Math.max(48,Math.min(bottom-24,bottom-a.y*(bottom-top)-20));
   root.append(svgEl("rect",{x,y,width:205,height:36,rx:8,fill:colors.surface,stroke:colors.line}));
   root.append(svgEl("text",{x:x+102,y:y+23,"text-anchor":"middle","font-size":14,fill:colors.ink},a.text));
  });
  if(spec.sparseLabel)root.append(svgEl("text",{x:right-120,y:bottom-18,"font-size":14,fill:colors.muted},spec.sparseLabel));
 }else{
  if(spec.neighborhood){
   const n=spec.neighborhood,cx=left+n.center[0]*(right-left),cy=bottom-n.center[1]*(bottom-top);
   root.append(svgEl("ellipse",{cx,cy,rx:n.radius*(right-left),ry:n.radius*(bottom-top),fill:colors.accent,opacity:.12,stroke:colors.accent,"stroke-width":3,"stroke-dasharray":"9 6","data-role":"neighborhood-boundary"}));
   root.append(svgEl("text",{x:cx+8,y:cy-n.radius*(bottom-top)+22,"font-size":15,"font-weight":700,fill:colors.accent,"data-role":"neighborhood-label"},n.label||"Neighborhood"));
   (n.distant||[]).forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:6,fill:colors.bad,opacity:.9,"data-role":"distant-point"})));
   (n.nearby||[]).forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:6.5,fill:colors.good,opacity:.9,"data-role":"nearby-point"})));
   root.append(svgEl("circle",{cx,cy,r:11,fill:colors.accent,stroke:colors.surface,"stroke-width":3,"data-role":"explained-instance"}));
   root.append(svgEl("text",{x:cx+15,y:cy-13,"font-size":17,"font-weight":700,fill:colors.accent,"data-role":"instance-label"},"x₀"));
  }else{
   (spec.observed||[]).forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:5.5,fill:colors.good,opacity:.78})));
   (spec.synthetic||[]).forEach(p=>root.append(svgEl("circle",{cx:left+p[0]*(right-left),cy:bottom-p[1]*(bottom-top),r:6,fill:colors.bad,opacity:.9})));
  }
  const legendY=46;
  root.append(svgEl("circle",{cx:130,cy:legendY,r:6,fill:colors.good}),svgEl("text",{x:145,y:legendY+5,"font-size":15,fill:colors.ink},spec.observedLabel||"Observed"));
  root.append(svgEl("circle",{cx:390,cy:legendY,r:6,fill:colors.bad}),svgEl("text",{x:405,y:legendY+5,"font-size":15,fill:colors.ink},spec.syntheticLabel||"Synthetic"));
 }
 root.append(svgEl("text",{x:(left+right)/2,y:382,"text-anchor":"middle","font-size":17,fill:colors.ink},spec.xLabel||"Feature value"));
 root.append(svgEl("text",{x:26,y:(top+bottom)/2,transform:"rotate(-90 26 "+((top+bottom)/2)+")","text-anchor":"middle","font-size":17,fill:colors.ink},spec.yLabel||"Model response"));
 const figure=document.createElement("figure");figure.className="pfi-figure pfi-figure--shared";
 const viewport=document.createElement("div");viewport.className="pfi-diagram-viewport";viewport.setAttribute("role","region");viewport.setAttribute("aria-label",spec.scrollLabel||spec.title);viewport.tabIndex=0;viewport.append(root);figure.append(viewport);
 const caption=document.createElement("figcaption");caption.textContent=spec.caption;figure.append(caption);return figure;
}
function render(spec){
 if(!spec||!["flow","grid","plot","scatter","weighted-scatter","bars","table"].includes(spec.layout))throw new TypeError("Invalid typed SVG diagram specification");
 if(spec.layout==="weighted-scatter")return renderWeightedScatter(spec);\n if(spec.layout==="bars")return renderBars(spec);\n if(spec.layout==="table")return renderTable(spec);\n if(spec.layout==="plot"||spec.layout==="scatter")return renderChart(spec);
 if(!Array.isArray(spec.nodes)||!spec.nodes.length)throw new TypeError("Node-based SVG diagrams require nodes");
 const ctx=measureContext();
 const nodeWidth=spec.layout==="flow"?142:300;
 const nodes=spec.nodes.map(n=>prepareNode(ctx,n,nodeWidth));
 let positions=[];
 if(spec.layout==="flow"){
  let x=MARGIN;const maxH=Math.max(...nodes.map(n=>n.height));
  nodes.forEach(n=>{positions.push({x,y:MARGIN,node:{...n,height:maxH}});x+=nodeWidth+GAP;});
  const width=x-GAP+MARGIN,height=maxH+MARGIN*2;
  return compose(spec,nodes,positions,width,height,ctx);
 }
 const colGap=32,rowGap=24,cols=2;
 const colWidths=[nodeWidth,nodeWidth],rowHeights=[];
 for(let i=0;i<nodes.length;i+=cols)rowHeights.push(Math.max(...nodes.slice(i,i+cols).map(n=>n.height)));
 let y=MARGIN;
 nodes.forEach((n,i)=>{
  const row=Math.floor(i/cols),col=i%cols;
  const rowY=MARGIN+rowHeights.slice(0,row).reduce((a,b)=>a+b+rowGap,0);
  const visualCol=spec.sequence&&spec.serpentine&&row%2===1?1-col:col;
  positions.push({x:MARGIN+visualCol*(nodeWidth+colGap),y:rowY,node:n});
 });
 const width=MARGIN*2+nodeWidth*2+colGap;
 const height=MARGIN*2+rowHeights.reduce((a,b)=>a+b,0)+Math.max(0,rowHeights.length-1)*rowGap;
 return compose(spec,nodes,positions,width,height,ctx);
}
function compose(spec,nodes,positions,width,height){
 const root=svgEl("svg",{viewBox:`0 0 ${Math.ceil(width)} ${Math.ceil(height)}`,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:String(Math.ceil(width))+"px",height:Math.ceil(height)+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
 if(spec.layout==="grid"&&spec.connectSequence!==false){
  positions.slice(0,-1).forEach((pos,i)=>{
   const next=positions[i+1],sameRow=Math.abs(pos.y-next.y)<1;
   let d;
   if(sameRow){
    const forward=next.x>pos.x,y=pos.y+pos.node.height/2;
    const sx=forward?pos.x+pos.node.width+3:pos.x-3,ex=forward?next.x-10:next.x+next.node.width+10;
    d=`M ${sx} ${y} H ${ex} m ${forward?-7:7} -6 l ${forward?7:-7} 6 ${forward?-7:7} 6`;
   }else{
    const sx=pos.x+pos.node.width/2,sy=pos.y+pos.node.height+3,ex=next.x+next.node.width/2,ey=next.y-9;
    d=`M ${sx} ${sy} V ${ey} m -6 -7 l 6 7 -6 7`;
   }
   root.append(svgEl("path",{d,fill:"none",stroke:colors.accent,"stroke-width":2.5,"stroke-linecap":"square","stroke-linejoin":"miter","data-role":"workflow-arrow"}));
  });
 }
 positions.forEach(({x,y,node},i)=>{
  const group=svgEl("g",{"data-node-id":node.id,"data-node-bounds":`${x},${y},${node.width},${node.height}`,"data-tone":node.tone||"surface"});
  group.append(svgEl("rect",{x,y,width:node.width,height:node.height,rx:12,fill:node.tone==="bad"?colors.bad:node.tone==="accent"?colors.accent:colors.surface,stroke:colors.line,"stroke-width":1.5}));
  const titleBlock=node.titleLines.length*LINE,bodyBlock=node.bodyLines.length?8+node.bodyLines.length*19:0;
  const contentHeight=titleBlock+bodyBlock;
  const titleY=y+(node.height-contentHeight)/2+16;
  const textInk=node.tone==="accent"?"var(--lds-accent-ink)":colors.ink;
  const textMuted=node.tone==="accent"?"var(--lds-accent-ink)":colors.muted;
  addTextLines(group,node.titleLines,x+PAD_X,titleY,15,700,textInk,LINE);
  if(node.bodyLines.length)addTextLines(group,node.bodyLines,x+PAD_X,titleY+titleBlock+8,14,400,textMuted,19);
  root.append(group);
  if(spec.layout==="flow"&&i<positions.length-1){
   const next=positions[i+1],midY=MARGIN+node.height/2;
   root.append(svgEl("path",{d:`M ${x+node.width+5} ${midY} H ${next.x-8} m -8 -7 l 8 7 -8 7`,fill:"none",stroke:colors.accent,"stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"}));
  }
 });
 const figure=document.createElement("figure");figure.className="pfi-figure pfi-figure--shared";
 const viewport=document.createElement("div");viewport.className="pfi-diagram-viewport";viewport.setAttribute("role","region");viewport.setAttribute("aria-label",spec.scrollLabel||spec.title);viewport.tabIndex=0;
 viewport.append(root);figure.append(viewport);
 const caption=document.createElement("figcaption");caption.textContent=spec.caption;figure.append(caption);
 return figure;
}
global.DCHLessonSVG={version:"1.0.0",render};
})(window);
