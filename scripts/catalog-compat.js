(function(root){"use strict";
function clone(x){return JSON.parse(JSON.stringify(x));}
function idx(a,n){const m=new Map();(a||[]).forEach(x=>{if(!x||!x.id||m.has(x.id))throw Error("Invalid/duplicate "+n+" id");m.set(x.id,x);});return m;}
function hid(s){const m=/^A\.(\d+)$/.exec(s);return m?"A.1.1."+m[1]:s;}
function normalizeV1(input){
 const tracks=clone(input.tracks.tracks||[]),themes=[],modules=[],legacy=new Map();
 (input.modules.modules||[]).forEach(o=>{const t=tracks.find(x=>x.id===o.track_id);if(!t)throw Error("Unknown track "+o.id);const th=o.id==="module-11"&&o.track_id==="track-a"?"A.1":t.code+".1",mid=th==="A.1"?"A.1.1":th+".1";if(!themes.some(x=>x.id===th))themes.push({id:th,track_id:o.track_id,code:th,title:th==="A.1"?"Основы AI и машинного обучения":t.title,status:"in_progress"});const m={id:mid,legacy_id:o.id,theme_id:th,title:o.title,status:o.status,track_id:o.track_id};modules.push(m);legacy.set(o.id,m);});
 const map=new Map((input.lessons.lessons||[]).map(x=>[x.id,hid(x.id)]));
 const lessons=(input.lessons.lessons||[]).map(o=>{const m=legacy.get(o.module_id);if(!m||m.track_id!==o.track_id)throw Error("Invalid legacy module/track relation "+o.id);const x=clone(o);x.legacy_id=o.id;x.id=map.get(o.id);x.module_id=m.id;x.prerequisites=(x.prerequisites||[]).map(p=>map.get(p)||p);return x;});
 const planets=clone(input.planets.planets||[]).map(p=>({...p,lesson_id:map.get(p.lesson_id)||p.lesson_id}));
 return {schema_version:2,source_schema_version:1,tracks,themes,modules,lessons,planets};
}
function normalizeV2(input){if(!input||input.schema_version!==2)throw Error("Expected catalog schema_version 2");const o=clone(input),tracks=idx(o.tracks,"track"),themes=idx(o.themes,"theme"),modules=idx(o.modules,"module");idx(o.lessons,"lesson");idx(o.planets,"planet");o.themes.forEach(t=>{if(!tracks.has(t.track_id))throw Error("Unknown track "+t.id);});o.modules.forEach(m=>{const t=themes.get(m.theme_id);if(!t)throw Error("Unknown theme "+m.id);m.track_id=t.track_id;});o.lessons.forEach(l=>{const m=modules.get(l.module_id);if(!m)throw Error("Unknown module "+l.id);l.track_id=m.track_id;});o.source_schema_version=2;return o;}
async function load(options){const x=options||{},base=(x.baseUrl||"").replace(/\/$/,""),f=x.fetchImpl||root.fetch.bind(root);async function get(p){const r=await f(base+"/"+p);if(!r.ok)throw Error("Catalog request failed "+r.status);return r.json();}if(x.schemaVersion===2)return normalizeV2(await get("catalog-v2.json"));const n=["tracks","modules","lessons","planets"],d=await Promise.all(n.map(k=>get(k+".json")));return normalizeV1({tracks:d[0],modules:d[1],lessons:d[2],planets:d[3]});}
const api={normalizeV1,normalizeV2,load};root.DCHCatalogCompat=api;if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
