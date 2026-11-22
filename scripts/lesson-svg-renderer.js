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
function render(spec){if(!spec||!spec.layout)throw new TypeError("Missing diagram layout");if(spec.layout==="matrix")return matrix(spec);if(spec.layout==="causal-flow")return causal(spec);if(spec.layout==="comparison-table")return comparison(spec);if(spec.layout==="experiment-flow")return experiment(spec);throw new TypeError("Unsupported SVG layout: "+spec.layout);}
global.DCHLessonSVG={version:"2.0.0",render};})(window);
