(function(global){
"use strict";
const NS="http://www.w3.org/2000/svg";
const MIN_FONT=14, LINE=21, PAD_X=18, PAD_Y=16, GAP=28, MARGIN=24;
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
 const words=String(text).split(/\s+/);
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
 const titleFont="700 16px system-ui, sans-serif";
 const bodyFont="14px system-ui, sans-serif";
 const title=wrap(ctx,node.title,width-PAD_X*2,titleFont);
 const body=node.detail?wrap(ctx,node.detail,width-PAD_X*2,bodyFont):[];
 const height=PAD_Y*2+title.length*LINE+ (body.length?8+body.length*19:0);
 return {...node,width,height,titleLines:title,bodyLines:body};
}
function addTextLines(group,lines,x,y,fontSize,weight,color,lineHeight){
 lines.forEach((line,i)=>group.append(svgEl("text",{x,y:y+i*lineHeight,"font-size":fontSize,"font-weight":weight,fill:color},line)));
}
function render(spec){
 if(!spec||!["flow","grid"].includes(spec.layout)||!Array.isArray(spec.nodes)||!spec.nodes.length)throw new TypeError("Invalid typed SVG diagram specification");
 const ctx=measureContext();
 const nodeWidth=spec.layout==="flow"?190:300;
 const nodes=spec.nodes.map(n=>prepareNode(ctx,n,nodeWidth));
 let positions=[];
 if(spec.layout==="flow"){
  let x=MARGIN,maxH=0;
  nodes.forEach(n=>{positions.push({x,y:MARGIN,node:n});x+=nodeWidth+GAP;maxH=Math.max(maxH,n.height);});
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
  positions.push({x:MARGIN+col*(nodeWidth+colGap),y:rowY,node:n});
 });
 const width=MARGIN*2+nodeWidth*2+colGap;
 const height=MARGIN*2+rowHeights.reduce((a,b)=>a+b,0)+Math.max(0,rowHeights.length-1)*rowGap;
 return compose(spec,nodes,positions,width,height,ctx);
}
function compose(spec,nodes,positions,width,height){
 const root=svgEl("svg",{viewBox:`0 0 ${Math.ceil(width)} ${Math.ceil(height)}`,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:"100%",height:"auto","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
 positions.forEach(({x,y,node},i)=>{
  const group=svgEl("g",{"data-node-id":node.id,"data-node-bounds":`${x},${y},${node.width},${node.height}`});
  group.append(svgEl("rect",{x,y,width:node.width,height:node.height,rx:12,fill:node.tone==="bad"?colors.bad:node.tone==="accent"?colors.accent:colors.surface,stroke:colors.line,"stroke-width":1.5}));
  const titleY=y+PAD_Y+16;
  addTextLines(group,node.titleLines,x+PAD_X,titleY,16,700,colors.ink,LINE);
  if(node.bodyLines.length)addTextLines(group,node.bodyLines,x+PAD_X,titleY+node.titleLines.length*LINE+8,14,400,colors.muted,19);
  root.append(group);
  if(spec.layout==="flow"&&i<positions.length-1){
   const next=positions[i+1],midY=y+node.height/2;
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
