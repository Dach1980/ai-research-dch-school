(function(global){
"use strict";
const NS="http://www.w3.org/2000/svg";
const W=720, PAD=24, LINE=22;
function el(tag,attrs={},text){const n=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>n.setAttribute(k,String(v)));if(text!==undefined)n.textContent=text;return n;}
function wrap(text,max,font="16px system-ui, sans-serif"){
 const c=document.createElement("canvas"),ctx=c.getContext("2d");ctx.font=font;
 const words=String(text).split(/\s+/);const lines=[];let line="";
 for(const word of words){let candidate=line?line+" "+word:word;if(line&&ctx.measureText(candidate).width>max){lines.push(line);line=word;}else line=candidate;}
 if(line)lines.push(line);return lines;
}
function text(g,str,x,y,max,opts={}){const size=opts.size||16,weight=opts.weight||400,color=opts.color||"var(--lds-ink)",lh=opts.line||21;const lines=wrap(str,max,weight+" "+size+"px system-ui, sans-serif");lines.forEach((s,i)=>g.append(el("text",{x,y:y+i*lh,"font-size":size,"font-weight":weight,fill:color},s)));return lines.length*lh;}
function rect(g,x,y,w,h,fill="var(--lds-surface)",stroke="var(--lds-line)",r=12){g.append(el("rect",{x,y,width:w,height:h,rx:r,fill,stroke,"stroke-width":1.5,"data-node-bounds":x+","+y+","+w+","+h}));}
function line(g,x1,y1,x2,y2,color="var(--lds-line)",width=2){g.append(el("path",{d:"M "+x1+" "+y1+" L "+x2+" "+y2,fill:"none",stroke:color,"stroke-width":width,"stroke-linecap":"round"}));}
function arrow(g,x1,y1,x2,y2){line(g,x1,y1,x2,y2,"var(--lds-accent)",2);g.append(el("path",{d:"M "+(x2-7)+" "+(y2-5)+" L "+x2+" "+y2+" L "+(x2-7)+" "+(y2+5),fill:"none",stroke:"var(--lds-accent)","stroke-width":2}));}
function base(spec,height){const root=el("svg",{viewBox:"0 0 "+W+" "+height,width:W+"px",height:height+"px",role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v2"});root.append(el("title",{id:spec.id+"-title"},spec.title),el("desc",{id:spec.id+"-desc"},spec.description));return root;}
function figure(root,spec){const f=document.createElement("figure");f.className="pfi-figure pfi-figure--shared";const v=document.createElement("div");v.className="pfi-diagram-viewport";v.setAttribute("role","region");v.setAttribute("aria-label",spec.scrollLabel||spec.title);v.tabIndex=0;v.append(root);f.append(v);const cap=document.createElement("figcaption");cap.textContent=spec.caption;f.append(cap);return f;}
function matrix(s){const root=base(s,560),d=s.diagramData;const x0=116,y0=104,cw=270,ch=170,gap=18;
 root.append(el("text",{x:34,y:300,transform:"rotate(-90 34 300)","font-size":15,"font-weight":700,fill:"var(--lds-ink)","text-anchor":"middle"},d.y));
 text(root,d.x,250,548,460,{size:15,weight:700});
 const fills=["var(--lds-accent)","var(--lds-good)","var(--lds-bad)","var(--lds-bad)"];
 d.cells.forEach((c,i)=>{const col=i%2,row=Math.floor(i/2),x=x0+col*(cw+gap),y=y0+row*(ch+gap);rect(root,x,y,cw,ch,fills[i], "var(--lds-line)");let yy=y+30;yy+=text(root,c.title,x+15,yy,cw-30,{size:16,weight:700,color:i===0?"var(--lds-accent-ink)":"var(--lds-ink)"});yy+=10;text(root,c.detail,x+15,yy,cw-30,{size:15,color:i===1?"var(--lds-accent-ink)":"var(--lds-ink)",line:20});});
 text(root,d.yHigh,62,112,70,{size:13,weight:700});text(root,d.yLow,62,472,70,{size:13,weight:700});text(root,d.xLow,116,520,160,{size:13});text(root,d.xHigh,545,520,160,{size:13});
 line(root,100,455,100,125,"var(--lds-ink)",2);arrow(root,100,125,100,113);line(root,116,500,680,500,"var(--lds-ink)",2);arrow(root,680,500,692,500);
 return figure(root,s);}
function causal(s){const d=s.diagramData,root=base(s,700),cols=[24,250,492],widths=[202,220,204],rowH=91,start=92;
 d.headers.forEach((h,i)=>{rect(root,cols[i],30,widths[i],42,"var(--lds-accent)","var(--lds-accent)",8);text(root,h,cols[i]+10,57,widths[i]-20,{size:15,weight:700,color:"var(--lds-accent-ink)"});});
 d.rows.forEach((r,i)=>{const y=start+i*rowH;rect(root,cols[0],y,widths[0],70);text(root,r[0],cols[0]+12,y+27,widths[0]-24,{size:15,weight:700});rect(root,cols[1],y,widths[1],70,"var(--lds-surface-secondary)");text(root,r[1],cols[1]+12,y+23,widths[1]-24,{size:14,line:18});rect(root,cols[2],y,widths[2],70);text(root,r[2],cols[2]+12,y+23,widths[2]-24,{size:14,line:18});arrow(root,cols[0]+widths[0]+5,y+35,cols[1]-7,y+35);arrow(root,cols[1]+widths[1]+5,y+35,cols[2]-7,y+35);});
 return figure(root,s);}
function comparison(s){const d=s.diagramData,root=base(s,790);text(root,d.tableTitle,24,34,670,{size:17,weight:700});const x=[24,300,465],w=[276,165,165],top=58,rh=38;
 d.columns.forEach((v,i)=>{rect(root,x[i],top,w[i],rh,"var(--lds-accent)","var(--lds-accent)",6);text(root,v,x[i]+9,top+25,w[i]-18,{size:14,weight:700,color:"var(--lds-accent-ink)"});});
 d.rows.forEach((r,i)=>{const y=top+rh*(i+1);r.forEach((v,j)=>{rect(root,x[j],y,w[j],rh,"var(--lds-surface)","var(--lds-line)",3);text(root,v,x[j]+9,y+25,w[j]-18,{size:14,weight:j?600:400});});});
 const cards=[["jaccard",24,290],["spearman",368,290],["coeff",24,480],["fidelity",368,480]];
 cards.forEach(([key,x0,y])=>{rect(root,x0,y,328,170);text(root,d[key],x0+13,y+27,300,{size:16,weight:700});const body=d[key+"Text"]||d[key+"Formula"];text(root,body,x0+13,y+55,300,{size:14,line:19});if(key==="jaccard")text(root,d.jaccardFormula,x0+13,y+135,300,{size:14,weight:700,color:"var(--lds-accent)"});});
 return figure(root,s);}
function experiment(s){const d=s.diagramData,root=base(s,650);rect(root,140,24,440,82,"var(--lds-accent)","var(--lds-accent)");text(root,d.object,160,55,400,{size:17,weight:700,color:"var(--lds-accent-ink)"});text(root,d.prediction,160,82,400,{size:14,color:"var(--lds-accent-ink)"});
 const x=[24,368];line(root,360,106,360,122,"var(--lds-accent)",2);line(root,188,122,532,122,"var(--lds-accent)",2);line(root,188,122,188,136,"var(--lds-accent)",2);line(root,532,122,532,136,"var(--lds-accent)",2);[d.runA,d.runB].forEach((label,i)=>{const xx=x[i];rect(root,xx,140,328,192);text(root,label,xx+14,169,300,{size:17,weight:700});text(root,i===0?d.sampleA:d.sampleB,xx+14,202,300,{size:14});rect(root,xx+14,220,300,91,"var(--lds-surface-secondary)");text(root,i===0?d.featuresA:d.featuresB,xx+26,252,276,{size:16,weight:700});text(root,i===0?d.rankA:d.rankB,xx+26,280,276,{size:14});});
 rect(root,24,365,672,110);text(root,d.compare,42,395,630,{size:17,weight:700});text(root,d.compareText,42,428,630,{size:15,line:21});
 rect(root,24,500,672,120,"var(--lds-surface-secondary)");text(root,d.conclusion,42,532,630,{size:17,weight:700});text(root,d.conclusionText,42,565,630,{size:15,line:21});
 return figure(root,s);}


function grid(s){
 const spec=s,nodes=spec.nodes||[],cols=2,cardW=(W-PAD*2-16)/2,cardH=154,gap=16;
 const rows=Math.ceil(nodes.length/cols),height=74+rows*(cardH+gap)+24,root=base(spec,height);
 const positions=nodes.map((node,i)=>({node,x:PAD+(i%cols)*(cardW+gap),y:68+Math.floor(i/cols)*(cardH+gap)}));
 if(spec.sequence&&spec.serpentine){positions.forEach((p,i)=>{if(Math.floor(i/cols)%2===1)p.x=PAD+(cols-1-(i%cols))*(cardW+gap);});}
 if(spec.connectSequence===true){
  positions.slice(0,-1).forEach((p,i)=>{
   const q=positions[i+1],sx=p.x+cardW/2,sy=p.y+cardH,ex=q.x+cardW/2,ey=q.y;
   const d=`M ${sx} ${sy} V ${ey} H ${ex}`;
   root.append(el("path",{"data-role":"workflow-arrow",d,fill:"none",stroke:"var(--lds-accent)","stroke-width":2.2,"stroke-linecap":"round"}));
  });
 }
 positions.forEach(({node,x,y})=>{
  rect(root,x,y,cardW,cardH,"var(--lds-surface)","var(--lds-line)",12);
  text(root,node.title,x+16,y+32,cardW-32,{size:17,weight:750});
  text(root,node.detail,x+16,y+66,cardW-32,{size:14,line:20,color:"var(--lds-muted)"});
 });
 return figure(root,spec);
}
function flow(s){
 const nodes=s.nodes||[],count=Math.max(1,nodes.length),gap=10,cardW=Math.min(128,(W-PAD*2-gap*(count-1))/count),cardH=188;
 const total=count*cardW+(count-1)*gap,startX=(W-total)/2,root=base(s,300);
 text(root,s.title||"",PAD,38,W-PAD*2,{size:19,weight:750});
 nodes.forEach((node,i)=>{
  const x=startX+i*(cardW+gap),y=86;
  rect(root,x,y,cardW,cardH,"var(--lds-surface)","var(--lds-line)",10);
  rect(root,x,y,cardW,44,"var(--lds-accent)","var(--lds-accent)",8);
  text(root,node.title,x+8,y+28,cardW-16,{size:13,weight:750,color:"var(--lds-accent-ink)"});
  text(root,node.detail,x+10,y+72,cardW-20,{size:12,line:17,color:"var(--lds-ink)"});
  if(i<nodes.length-1)arrow(root,x+cardW+1,y+cardH/2,x+cardW+gap-2,y+cardH/2);
 });
 return figure(root,s);
}
function renderWeightedScatter(s){
 const n=s.neighborhood||{},root=base(s,610),x0=100,y0=74,w=540,h=440;
 rect(root,x0,y0,w,h,"var(--lds-surface-secondary)","var(--lds-line)",8);
 const point=p=>[x0+p[0]*w,y0+(1-p[1])*h],center=point(n.center||[.5,.5]),radius=(n.radius||.25)*Math.min(w,h);
 root.append(el("circle",{"data-role":"neighborhood-boundary",cx:center[0],cy:center[1],r:radius,fill:"var(--lds-accent)","fill-opacity":".10",stroke:"var(--lds-accent)","stroke-width":2,"stroke-dasharray":"8 6"}));
 (n.distant||[]).forEach(p=>{const q=point(p);root.append(el("circle",{"data-role":"distant-point",cx:q[0],cy:q[1],r:6,fill:"var(--lds-muted)",stroke:"var(--lds-surface)","stroke-width":2}));});
 (n.nearby||[]).forEach(p=>{const q=point(p);root.append(el("circle",{"data-role":"nearby-point",cx:q[0],cy:q[1],r:7,fill:"var(--lds-good)",stroke:"var(--lds-surface)","stroke-width":2}));});
 root.append(el("circle",{"data-role":"explained-instance",cx:center[0],cy:center[1],r:10,fill:"var(--lds-bad)",stroke:"var(--lds-surface)","stroke-width":3}));
 text(root,n.label||"",Math.min(center[0]+16,x0+w-170),Math.max(y0+20,center[1]-16),160,{size:13,weight:750,color:"var(--lds-ink)"});
 root.append(el("text",{"data-role":"instance-label",x:center[0]+13,y:center[1]+28,"font-size":13,"font-weight":750,fill:"var(--lds-ink)"}, "x₀"));
 line(root,x0,y0+h,x0+w,y0+h,"var(--lds-ink)",2);arrow(root,x0+w,y0+h,x0+w+10,y0+h);
 line(root,x0,y0+h,x0,y0-10,"var(--lds-ink)",2);arrow(root,x0,y0-10,x0,y0-20);
 text(root,s.xLabel||"",x0+w/2,y0+h+44,220,{size:13,weight:700});
 root.append(el("text",{x:35,y:y0+h/2,transform:"rotate(-90 35 "+(y0+h/2)+")","font-size":13,"font-weight":700,fill:"var(--lds-ink)","text-anchor":"middle"},s.yLabel||""));
 const legendY=568;
 root.append(el("circle",{cx:130,cy:legendY-4,r:6,fill:"var(--lds-good)"}));text(root,s.observedLabel||"",144,legendY,170,{size:12});
 root.append(el("circle",{cx:370,cy:legendY-4,r:6,fill:"var(--lds-muted)"}));text(root,s.syntheticLabel||"",384,legendY,210,{size:12});
 return figure(root,s);
}
function renderTable(spec){
 const columns=spec.columns||[],rows=spec.rows||[];
 const count=Math.max(1,columns.length),left=PAD,width=(W-PAD*2)/count,headerY=78,headH=48,rowH=48;
 const height=headerY+headH+rows.length*rowH+34,root=base(spec,height),isPerturbed=spec.type==="lime-913-perturbations";
 text(root,spec.title||"",PAD,38,W-PAD*2,{size:19,weight:750});
 columns.forEach((value,i)=>{
  const x=left+i*width;rect(root,x,headerY,width-4,headH,"var(--lds-accent)","var(--lds-accent)",7);
  text(root,value,x+8,headerY+29,width-20,{size:14,weight:700,color:"var(--lds-accent-ink)"});
 });
 rows.forEach((row,ri)=>{
  const y=headerY+headH+ri*rowH;
  row.forEach((value,ci)=>{
   const x=left+ci*width,attrs={x,y,width:width-4,height:rowH-3,rx:5,fill:ri%2?"var(--lds-surface-secondary)":"var(--lds-surface)",stroke:"var(--lds-line)","stroke-width":1.2};
   if(isPerturbed&&ci===0)attrs["data-role"]="perturbed-sample";
   root.append(el("rect",attrs));
   text(root,value,x+8,y+Math.min(27,rowH/2+5),width-20,{size:14,weight:ci===0?650:450,line:18});
  });
 });
 if(isPerturbed)root.append(el("rect",{"data-role":"perturbation-region",x:left-1,y:headerY-2,width:W-PAD*2+2,height:headH+rows.length*rowH+1,rx:8,fill:"none",stroke:"var(--lds-accent)","stroke-dasharray":"4 5","stroke-width":1.2}));
 return figure(root,spec);
}
function renderBars(spec){
 const bars=spec.bars||[],root=base(spec,100+bars.length*78+36),center=360,max=Math.max(.01,...bars.map(b=>Math.abs(Number(b.value)||0)));
 text(root,spec.title||"",PAD,38,W-PAD*2,{size:19,weight:750});
 bars.forEach((bar,i)=>{
  const y=82+i*78,width=Math.abs(Number(bar.value)||0)/max*230,x=Number(bar.value)>=0?center:center-width;
  text(root,bar.label,24,y+18,260,{size:14,weight:650});
  line(root,center,y-2,center,y+35,"var(--lds-ink)",1.5);
  rect(root,x,y,width,28,Number(bar.value)>=0?"var(--lds-good)":"var(--lds-bad)","var(--lds-line)",5);
  text(root,(Number(bar.value)>0?"+":"")+String(bar.value),Math.min(Math.max(x+width+8,center+8),650),y+19,65,{size:13,weight:750});
 });
 return figure(root,spec);
}
function plot(s){
 const root=base(s,560),x0=80,y0=72,w=590,h=390,pts=s.points||[];
 rect(root,x0,y0,w,h,"var(--lds-surface)","var(--lds-line)",8);
 line(root,x0,y0+h,x0+w,y0+h,"var(--lds-ink)",2);arrow(root,x0+w,y0+h,x0+w+10,y0+h);
 line(root,x0,y0+h,x0,y0-10,"var(--lds-ink)",2);arrow(root,x0,y0-10,x0,y0-20);
 const point=p=>[x0+p[0]*w,y0+(1-p[1])*h];
 if(pts.length>1){const d=pts.map((p,i)=>{const q=point(p);return (i?"L ":"M ")+q[0]+" "+q[1];}).join(" ");root.append(el("path",{d,fill:"none",stroke:"var(--lds-accent)","stroke-width":2.5,"stroke-linecap":"round","stroke-linejoin":"round"}));}
 pts.forEach(p=>{const q=point(p);root.append(el("circle",{cx:q[0],cy:q[1],r:5,fill:"var(--lds-good)",stroke:"var(--lds-surface)","stroke-width":1.5}));});
 (s.annotations||[]).forEach(a=>{const q=point([a.x,a.y]);const x=Math.min(Math.max(q[0]-72,x0+4),x0+w-148),y=Math.min(Math.max(q[1]-32,y0+4),y0+h-58);rect(root,x,y,144,48,"var(--lds-math-bg)","var(--lds-math-border)",7);text(root,a.text,x+8,y+27,128,{size:12,weight:650,color:"var(--lds-math-ink)"});});
 text(root,s.xLabel||"",x0+w/2,y0+h+42,220,{size:13,weight:700});
 root.append(el("text",{x:28,y:y0+h/2,transform:"rotate(-90 28 "+(y0+h/2)+")","font-size":13,"font-weight":700,fill:"var(--lds-ink)","text-anchor":"middle"},s.yLabel||""));
 if(s.sparseLabel)text(root,s.sparseLabel,x0+12,y0+24,w-24,{size:12,weight:650,color:"var(--lds-muted)"});
 return figure(root,s);
}

function tableFigure(s,kind){
 const d=s.diagramData,cols=d.columns,rows=d.rows;const widths=kind==="shapley-coalition-table"?[190,250,210]:kind==="shapley-marginal-table"?[132,78,150,112,90]:kind==="shapley-permutations"?[190,100,100,100,100]:[112,170,90,190,128];
 const x=[24];for(let i=1;i<widths.length;i++)x.push(x[i-1]+widths[i-1]);const headerY=82,headH=48,rowH=kind==="shapley-coalition-table"?42:kind==="shapley-permutations"?48:58;
 const noteLines=wrap(d.note,650,"15px system-ui, sans-serif"),height=headerY+headH+rows.length*rowH+34+noteLines.length*23+30,root=base(s,height);
 text(root,d.tableTitle||d.title,24,38,670,{size:19,weight:750});
 cols.forEach((v,i)=>{rect(root,x[i],headerY,widths[i]-4,headH,"var(--lds-accent)","var(--lds-accent)",7);text(root,v,x[i]+9,headerY+29,widths[i]-22,{size:14,weight:700,color:"var(--lds-accent-ink)",line:17});});
 rows.forEach((row,ri)=>{const y=headerY+headH+ri*rowH;row.forEach((v,ci)=>{const fill=kind==="shapley-coalition-table"&&ri===7?"var(--lds-math-bg)":kind==="shapley-coalition-table"&&ri===0?"var(--lds-surface-secondary)":kind==="shapley-permutations"&&ci>0&&ci<4?"var(--lds-surface-secondary)":"var(--lds-surface)";rect(root,x[ci],y,widths[ci]-4,rowH-3,fill,"var(--lds-line)",5);text(root,v,x[ci]+8,y+Math.min(27,rowH/2+5),widths[ci]-20,{size:ci===0?14:15,weight:ci===0||ci===widths.length-1?650:450,line:18});});});
 let yy=headerY+headH+rows.length*rowH+24;rect(root,24,yy,672,noteLines.length*23+24,"var(--lds-math-bg)","var(--lds-math-border)",9);text(root,d.note,40,yy+29,640,{size:15,weight:650,color:"var(--lds-math-ink)",line:22});
 return figure(root,s);
}
function shapleyMappingFigure(s){
 const d=s.diagramData,cards=d.cards||[],root=base(s,430),xs=[24,253,482],w=214,y=92,h=278;
 text(root,d.title,24,38,672,{size:19,weight:750});
 cards.forEach((card,i)=>{
  const x=xs[i];rect(root,x,y,w,h,"var(--lds-surface)","var(--lds-line)",12);
  rect(root,x,y,w,52,"var(--lds-accent)","var(--lds-accent)",10);
  text(root,card[0],x+12,y+31,w-24,{size:15,weight:750,color:"var(--lds-accent-ink)"});
  text(root,card[1],x+14,y+82,w-28,{size:14,line:21,color:"var(--lds-ink)"});
  if(i<cards.length-1)arrow(root,x+w+3,y+h/2,xs[i+1]-8,y+h/2);
 });
 rect(root,24,390,672,28,"var(--lds-math-bg)","var(--lds-math-border)",7);
 text(root,d.caption,36,410,648,{size:12,weight:650,color:"var(--lds-math-ink)"});
 return figure(root,s);
}
function shapleyDistinctionFigure(s){
 const d=s.diagramData,root=base(s,560),x=[24,248,472],widths=[200,200,224],top=92,headerH=52,rowH=106;
 text(root,d.title,24,38,672,{size:19,weight:750});
 const headers=[d.aspectLabel||"Aspect",...(d.columns||[])];
 headers.forEach((name,i)=>{
  rect(root,x[i],top,widths[i],headerH,"var(--lds-accent)","var(--lds-accent)",9);
  text(root,name,x[i]+10,top+32,widths[i]-20,{size:15,weight:750,color:"var(--lds-accent-ink)"});
 });
 (d.rows||[]).forEach((row,i)=>{
  const y=top+headerH+12+i*(rowH+10);
  row.forEach((value,j)=>{
   rect(root,x[j],y,widths[j],rowH,"var(--lds-surface)","var(--lds-line)",8);
   text(root,value,x[j]+10,y+24,widths[j]-20,{size:12,line:18,color:"var(--lds-ink)"});
  });
 });
 const noteY=top+headerH+12+(d.rows||[]).length*(rowH+10);
 rect(root,24,noteY,672,34,"var(--lds-math-bg)","var(--lds-math-border)",7);
 text(root,d.caption,36,noteY+22,648,{size:12,weight:650,color:"var(--lds-math-ink)"});
 return figure(root,s);
}
function axiomsFigure(s){
 const d=s.diagramData,root=base(s,650);text(root,d.title,24,38,670,{size:19,weight:750});
 const x=[24,368],y=[76,330],w=328,h=236;
 d.cards.forEach((c,i)=>{const xx=x[i%2],yy=y[Math.floor(i/2)];rect(root,xx,yy,w,h,"var(--lds-surface)","var(--lds-line)",12);rect(root,xx,yy,w,42,"var(--lds-accent)","var(--lds-accent)",10);text(root,c[0],xx+14,yy+27,w-28,{size:16,weight:750,color:"var(--lds-accent-ink)"});text(root,c[1],xx+14,yy+72,w-28,{size:14,line:19});rect(root,xx+12,yy+112,w-24,42,"var(--lds-math-bg)","var(--lds-math-border)",7);text(root,c[2],xx+22,yy+139,w-44,{size:15,weight:750,color:"var(--lds-math-ink)"});text(root,c[3],xx+14,yy+184,w-28,{size:13,line:17,color:"var(--lds-muted)"});});
 return figure(root,s);
}
// Preserve the previously accepted measured PFI renderer and its geometry contract.
const renderPFI = (function(){
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
function render(spec){
 if(!spec||!["flow","grid"].includes(spec.layout)||!Array.isArray(spec.nodes)||!spec.nodes.length)throw new TypeError("Invalid typed SVG diagram specification");
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
  positions.push({x:MARGIN+col*(nodeWidth+colGap),y:rowY,node:n});
 });
 const width=MARGIN*2+nodeWidth*2+colGap;
 const height=MARGIN*2+rowHeights.reduce((a,b)=>a+b,0)+Math.max(0,rowHeights.length-1)*rowGap;
 return compose(spec,nodes,positions,width,height,ctx);
}
function compose(spec,nodes,positions,width,height){
 const root=svgEl("svg",{viewBox:`0 0 ${Math.ceil(width)} ${Math.ceil(height)}`,role:"img","aria-labelledby":spec.id+"-title "+spec.id+"-desc",width:String(Math.ceil(width))+"px",height:Math.ceil(height)+"px","data-diagram-type":spec.type,"data-diagram-renderer":"shared-v1"});
 root.append(svgEl("title",{id:spec.id+"-title"},spec.title),svgEl("desc",{id:spec.id+"-desc"},spec.description));
 const colors={surface:"var(--lds-surface)",line:"var(--lds-line)",ink:"var(--lds-ink)",muted:"var(--lds-muted)",accent:"var(--lds-accent)",good:"var(--lds-good)",bad:"var(--lds-bad)"};
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
return render;
})();


/* SHAP 10.1.2 typed, measured diagrams. The existing renderer dispatch remains unchanged for earlier lessons. */
function shapMeasuredLines(value,width,size,weight){
 const ctx=document.createElement("canvas").getContext("2d");
 ctx.font=weight+" "+size+"px system-ui, sans-serif";
 const lines=[];let current="";
 for(const word of String(value).split(/\s+/)){
   if(ctx.measureText(word).width>width){
     if(current){lines.push(current);current="";}
     for(const ch of Array.from(word)){if(current&&ctx.measureText(current+ch).width>width){lines.push(current);current=ch;}else current+=ch;}
   }else{const next=current?current+" "+word:word;if(current&&ctx.measureText(next).width>width){lines.push(current);current=word;}else current=next;}
 }
 if(current)lines.push(current);return lines.length?lines:[""];
}
function shapCell(root,id,x,y,w,h,title,detail,accent=false){
 const group=el("g",{"data-node-id":id,"data-tone":accent?"accent":"surface"});
 group.append(el("rect",{x,y,width:w,height:h,rx:9,fill:accent?"var(--lds-accent)":"var(--lds-surface)",stroke:"var(--lds-line)","stroke-width":1.5,"data-text-box":id,"data-node-bounds":[x,y,w,h].join(",")}));
 const font=15,step=22,pad=12;
 let cursor=y+pad+font;
 const draw=(value,weight)=>{const lines=shapMeasuredLines(value,w-2*pad-4,font,weight);for(const line of lines){group.append(el("text",{x:x+pad,y:cursor,"font-size":font,"font-weight":weight,"data-text-for":id,"data-role":"node-text",style:"font-family:system-ui,sans-serif!important;font-size:15px!important;font-weight:"+weight+"!important;fill:"+(accent?"var(--lds-accent-ink)":"var(--lds-ink)")+"!important"},line));cursor+=step;}};
 draw(title,700);if(detail){cursor+=4;draw(detail,400);}root.append(group);
}
function shapCellHeight(w,title,detail){
 return 28+22*shapMeasuredLines(title,w-28,15,700).length+(detail?4+22*shapMeasuredLines(detail,w-28,15,400).length:0);
}
function shapDown(root,x,from,to){root.append(el("path",{d:"M "+x+" "+from+" V "+to+" m -5 -7 l 5 7 5 -7",fill:"none",stroke:"var(--lds-accent)","stroke-width":2,"data-role":"workflow-arrow"}));}
function shapCompute(s){
 let root;
 if(s.layout==="shap-compute-table"){
  const col=s.columns.length,widths=s.type==="shap-1012-growth"?[96,220,W-48-316]:Array(col).fill((W-48)/col),rows=[s.columns,...s.rows],heights=rows.map(r=>Math.max(...r.map((v,ci)=>shapCellHeight(widths[ci]-6,v,""))));
  root=base(s,48+heights.reduce((a,b)=>a+b+6,0));let y=24;
  rows.forEach((r,ri)=>{let x=24;r.forEach((v,ci)=>{shapCell(root,"row-"+ri+"-col-"+ci,x,y,widths[ci]-6,heights[ri],v,"",ri===0);x+=widths[ci];});y+=heights[ri]+6;});
 }else if(s.layout==="shap-compute-pipeline"){
  const w=560,x=(W-w)/2,hs=s.nodes.map(n=>shapCellHeight(w,n.title,n.detail)),gap=30;
  root=base(s,48+hs.reduce((a,b)=>a+b,0)+gap*(hs.length-1));
  let y=24;s.nodes.forEach((n,i)=>{shapCell(root,n.id,x,y,w,hs[i],n.title,n.detail,i===0||i===s.nodes.length-1);if(i<hs.length-1)shapDown(root,W/2,y+hs[i]+3,y+hs[i]+gap-3);y+=hs[i]+gap;});
 }else if(s.layout==="shap-compute-choice"){
  const w=310,topW=560,topX=80,leftX=24,rightX=386,n=s.nodes,topH=shapCellHeight(topW,n[0].title,n[0].detail),midY=24+topH+50,midH=Math.max(shapCellHeight(w,n[1].title,n[1].detail),shapCellHeight(w,n[2].title,n[2].detail)),bottomY=midY+midH+50,bottomH=shapCellHeight(topW,n[3].title,n[3].detail);
  root=base(s,bottomY+bottomH+24);
  const branchY=24+topH+25,joinY=midY+midH+25,l=leftX+w/2,r=rightX+w/2;
  root.append(el("path",{d:`M 360 ${24+topH} V ${branchY} H ${l} M 360 ${branchY} H ${r}`,fill:"none",stroke:"var(--lds-accent)","stroke-width":2}));
  shapDown(root,l,branchY,midY-3);shapDown(root,r,branchY,midY-3);
  root.append(el("path",{d:`M ${l} ${midY+midH} V ${joinY} H ${r} V ${midY+midH}`,fill:"none",stroke:"var(--lds-accent)","stroke-width":2}));shapDown(root,360,joinY,bottomY-3);
  shapCell(root,n[0].id,topX,24,topW,topH,n[0].title,n[0].detail,true);
  shapCell(root,n[1].id,leftX,midY,w,midH,n[1].title,n[1].detail);
  shapCell(root,n[2].id,rightX,midY,w,midH,n[2].title,n[2].detail);
  shapCell(root,n[3].id,topX,bottomY,topW,bottomH,n[3].title,n[3].detail,true);
 }else throw new TypeError("Unknown SHAP computation layout");
 const result=figure(root,s);result.classList.add("shap-compute-figure");return result;
}

/* Local SHAP plots: numeric coordinates are derived from the typed teaching values.
 * The diagnostic layout reuses the measured, accessible SHAP pipeline.
 */
function localSHAP(s){
 const d=s.labels||{},ink="var(--lds-ink)",surface="var(--lds-surface)",positive="var(--lds-good)",negative="var(--lds-bad)",accent="var(--lds-accent)";
 let root;
 function label(str,x,y,align="start",weight=500,size=15){
   root.append(el("text",{x,y,"text-anchor":align,"data-role":"plot-label",style:"font-family:system-ui,sans-serif!important;font-size:"+size+"px!important;font-weight:"+weight+"!important;fill:"+ink+"!important"},str));
 }
 function plottedLine(x1,y1,x2,y2,color=ink,width=1.5,extra={}){root.append(el("path",{d:"M "+x1+" "+y1+" L "+x2+" "+y2,stroke:color,"stroke-width":width,fill:"none",...extra}));}
 function signed(v){return (v<0?"−":"+")+Math.abs(v).toFixed(1);}
 function segment(a,b,y,map,kind,i){
   const x1=map(a),x2=map(b),sign=b>=a?positive:negative;
   plottedLine(x1,y,x2,y,sign,9,{"stroke-linecap":"round","data-segment":kind,"data-index":i,"data-start":a,"data-end":b});
   const direction=x2>=x1?1:-1;
   root.append(el("path",{d:"M "+(x2-direction*8)+" "+(y-7)+" L "+x2+" "+y+" L "+(x2-direction*8)+" "+(y+7),stroke:sign,"stroke-width":2.5,fill:"none"}));
 }
 function axis(xmin,xmax,y,map,ticks,unit){plottedLine(map(xmin),y,map(xmax),y);ticks.forEach(v=>{plottedLine(map(v),y,map(v),y+6);label(Number.isInteger(v)?String(v):v.toFixed(1),map(v),y+25,"middle");});label(unit,map(xmax),y+50,"end",600);}
 if(s.layout==="shap-local-diagnostic"){
   const result=shapCompute({...s,layout:"shap-compute-pipeline"});result.classList.remove("shap-compute-figure");result.classList.add("shap-local-figure");return result;
 }
 if(s.layout==="shap-local-decomposition"){
   root=base(s,320);const map=v=>72+(v-5.5)*166;
   const p=s.features.reduce((a,f)=>a+Math.max(f.value,0),0),n=s.features.reduce((a,f)=>a+Math.min(f.value,0),0);
   const peak=s.baseline+p,final=s.baseline+p+n;
   label(d.baseline+" "+s.baseline.toFixed(1),map(s.baseline),34,"middle",700);
   label(d.prediction+" "+final.toFixed(1),map(final),34,"middle",700);
   plottedLine(map(s.baseline),44,map(s.baseline),244,ink,1,{"stroke-dasharray":"5 5"});
   plottedLine(map(final),44,map(final),244,ink,1,{"stroke-dasharray":"5 5"});
   segment(s.baseline,peak,90,map,"positive",0);
   label(d.positive,(map(s.baseline)+map(peak))/2,72,"middle",650);
   segment(peak,final,150,map,"negative",0);
   label(d.negative,Math.min(map(peak),670),132,"end",650);
   plottedLine(map(s.baseline),210,map(final),210,accent,5,{"data-net":(p+n).toFixed(1)});
   label(d.net,(map(s.baseline)+map(final))/2,194,"middle",700);
   axis(5.5,9,244,map,[6,7,8,9],d.unit);
 }else if(s.layout==="shap-local-waterfall"){
   root=base(s,455);const map=v=>238+(v-5.5)*126;
   label(d.baseline+" "+s.baseline.toFixed(1),map(s.baseline),31,"middle",700);
   let last=s.baseline;
   s.features.forEach((feature,i)=>{
     const next=Math.round((last+feature.value)*10)/10,y=78+i*72;
     const lines=shapMeasuredLines(feature.label,204,15,600);
     lines.forEach((v,j)=>label(v,24,y-7+j*18,"start",600));
     label(signed(feature.value),24,y+lines.length*18+2,"start",700);
     segment(last,next,y,map,"waterfall",i);
     label(last.toFixed(1),map(last),y-15,"middle");
     label(next.toFixed(1),map(next),y+27,"middle");
     if(i<s.features.length-1)plottedLine(map(next),y+33,map(next),y+56,ink,1.3,{"stroke-dasharray":"4 4"});
     last=next;
   });
   label(d.prediction+" "+last.toFixed(1),map(last),386,"middle",700);
   axis(5.5,9,394,map,[6,7,8,9],d.unit);
 }else if(s.layout==="shap-local-force"){
   root=base(s,340);const p=s.features.reduce((a,f)=>a+Math.max(f.value,0),0),n=s.features.reduce((a,f)=>a+Math.min(f.value,0),0),net=p+n,map=v=>252+v*147;
   label(d.positive,24,35,"start",700);label(d.negative,24,105,"start",700);
   segment(0,p,65,map,"force-positive",0);segment(0,n,135,map,"force-negative",0);
   plottedLine(map(0),45,map(0),170,ink,1.3,{"stroke-dasharray":"5 4"});
   axis(-1,3,170,map,[-1,0,1,2,3],d.unit);
   const mapOutput=v=>80+(v-5.5)*160;
   segment(s.baseline,s.baseline+net,258,mapOutput,"force-net",0);
   label(d.baseline+" "+s.baseline.toFixed(1),mapOutput(s.baseline),240,"middle",700);
   label(d.prediction+" "+(s.baseline+net).toFixed(1),mapOutput(s.baseline+net),240,"middle",700);
   label(d.net,(mapOutput(s.baseline)+mapOutput(s.baseline+net))/2,292,"middle",700);
 }else if(s.layout==="shap-local-sigmoid"){
   root=base(s,392);const sig=z=>1/(1+Math.exp(-z)),mx=z=>72+(z+4)*75,my=p=>282-p*240;
   label(d.probability,72,22,"start",700);
   for(const p of [0,.25,.5,.75,1]){plottedLine(72,my(p),672,my(p),"var(--lds-line)",1);label(p.toFixed(2),62,my(p)+5,"end");}
   plottedLine(72,42,72,282);plottedLine(72,282,672,282);
   for(const z of [-4,-2,0,2,4]){plottedLine(mx(z),282,mx(z),288);label(String(z),mx(z),306,"middle");}
   label("logit z",672,329,"end",600);
   const points=Array.from({length:161},(_,i)=>-4+i*.05);
   root.append(el("path",{d:points.map((z,i)=>(i?"L ":"M ")+mx(z).toFixed(2)+" "+my(sig(z)).toFixed(2)).join(" "),stroke:accent,"stroke-width":3,fill:"none","data-role":"sigmoid-curve"}));
   [[-.4,110,190,"start"],[.3,630,105,"end"]].forEach(([z,tx,ty,align])=>{
     const p=sig(z),cx=mx(z),cy=my(p);plottedLine(cx,cy,cx,282,ink,1,{"stroke-dasharray":"3 4"});
     plottedLine(cx,cy,align==="start"?tx+140:tx-145,ty-4,ink,1);
     root.append(el("circle",{cx,cy,r:5,fill:accent,stroke:ink,"stroke-width":1,"data-z":z,"data-p":p}));
     label("σ("+z.toFixed(1)+") = "+p.toFixed(6),tx,ty,align,700);
   });
   label("−0.4 + 1.0 − 0.3 = 0.3",360,361,"middle",700);
 }else throw new TypeError("Unknown local SHAP layout: "+s.layout);
 const fig=figure(root,s);fig.classList.add("shap-local-figure");return fig;
}

function render(spec){if(spec && ['shap-local-decomposition','shap-local-waterfall','shap-local-force','shap-local-sigmoid','shap-local-diagnostic'].includes(spec.layout))return localSHAP(spec);if(spec && ['shap-compute-pipeline','shap-compute-table','shap-compute-choice'].includes(spec.layout))return shapCompute(spec);if(spec && ["pfi-workflow","pfi-correlation"].includes(spec.type))return renderPFI(spec);if(!spec||!spec.layout)throw new TypeError("Missing diagram layout");if(spec.layout==="matrix")return matrix(spec);if(spec.layout==="causal-flow")return causal(spec);if(spec.layout==="comparison-table")return comparison(spec);if(spec.layout==="experiment-flow")return experiment(spec);if(spec.layout==="flow")return flow(spec);if(spec.layout==="grid"&&spec.connectSequence===true)return grid(spec);if(spec.layout==="grid")return grid(spec);if(spec.layout==="table")return renderTable(spec);if(spec.layout==="bars")return renderBars(spec);if(spec.layout==="scatter")return renderWeightedScatter(spec);if(spec.layout==="plot")return plot(spec);if(spec.layout==="shapley-coalition-table"||spec.layout==="shapley-marginal-table"||spec.layout==="shapley-permutations"||spec.layout==="shapley-weights")return tableFigure(spec,spec.layout);if(spec.layout==="shapley-mapping")return shapleyMappingFigure(spec);if(spec.layout==="shapley-distinction")return shapleyDistinctionFigure(spec);if(spec.layout==="shapley-axioms")return axiomsFigure(spec);throw new TypeError("Unsupported SVG layout: "+spec.layout);}
global.DCHLessonSVG={version:"2.5.0",render};})(window);
