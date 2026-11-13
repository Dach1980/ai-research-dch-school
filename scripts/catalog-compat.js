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

function normalizeV3(input){
 if(!input||input.schema_version!==3)throw Error("Expected catalog schema_version 3");
 const o=clone(input),groups=["tracks","themes","modules","lessons","resources","planets"],maps={};
 groups.forEach(k=>{maps[k]=new Map();(o[k]||[]).forEach(x=>{if(!x||!x.uid||maps[k].has(x.uid))throw Error("Invalid/duplicate "+k+" UID");maps[k].set(x.uid,x);});});
 o.themes.forEach(x=>{if(!maps.tracks.has(x.track_uid))throw Error("Unknown track UID "+x.uid);});
 o.modules.forEach(x=>{if(!maps.themes.has(x.theme_uid))throw Error("Unknown theme UID "+x.uid);});
 o.lessons.forEach(x=>{const m=maps.modules.get(x.module_uid),t=maps.themes.get(x.theme_uid);if(!m||!t)throw Error("Unknown lesson parent UID "+x.uid);if(m.theme_uid!==t.uid||t.track_uid!==x.track_uid)throw Error("Lesson hierarchy mismatch "+x.uid);(x.prerequisite_uids||[]).forEach(p=>{if(!maps.lessons.has(p))throw Error("Unknown prerequisite UID "+p);});});
 o.planets.forEach(x=>{if(!maps.lessons.has(x.lesson_uid))throw Error("Unknown planet lesson UID "+x.uid);});
 o.source_schema_version=3;return o;
}

function projectV3ToLegacy(v3Input,legacyInput,manifest){
 const v3=normalizeV3(v3Input),legacy=normalizeV2(legacyInput),aliases=(manifest&&manifest.external_aliases)||[];
 const index=new Map();
 aliases.filter(a=>a.source_system==="catalog_v2"&&(a.alias_kind==="v2_id"||a.alias_kind==="legacy_id")).forEach(a=>{
  const old=index.get(a.alias_value)||{uids:[],states:[]};
  old.uids.push(...a.target_lesson_uids);old.states.push(a.mapping_state);index.set(a.alias_value,old);
 });
 const lessons=legacy.lessons.map(item=>{
  const hit=index.get(item.id)||(item.legacy_id&&index.get(item.legacy_id));
  const uids=[...new Set(hit?hit.uids:[])];
  const targets=uids.map(uid=>v3.lessons.find(x=>x.uid===uid)).filter(Boolean);
  return {...item,v3_target_uids:targets.map(x=>x.uid),v3_target_codes:targets.map(x=>x.code),v3_mapping_state:hit?[...new Set(hit.states)]:["unmapped"]};
 });
 return {...legacy,lessons,compatibility:{source_schema_version:2,target_schema_version:3,projection:"legacy_preserving",v3_lesson_count:v3.lessons.length}};
}
async function loadLegacyProjection(options){
 const x=options||{},base=(x.baseUrl||"").replace(/\/$/,""),f=x.fetchImpl||root.fetch.bind(root);
 async function get(p){const r=await f(base+"/"+p);if(!r.ok)throw Error("Catalog request failed "+r.status+" for "+p);return r.json();}
 const [legacy,v3,manifest]=await Promise.all([get("catalog-v2.json"),get("catalog-v3.json"),get("migration-manifest-v3.json")]);
 return projectV3ToLegacy(v3,legacy,manifest);
}

async function load(options){const x=options||{},base=(x.baseUrl||"").replace(/\/$/,""),f=x.fetchImpl||root.fetch.bind(root);async function get(p){const r=await f(base+"/"+p);if(!r.ok)throw Error("Catalog request failed "+r.status);return r.json();}if(x.schemaVersion===3)return normalizeV3(await get("catalog-v3.json"));if(x.schemaVersion===2)return normalizeV2(await get("catalog-v2.json"));const n=["tracks","modules","lessons","planets"],d=await Promise.all(n.map(k=>get(k+".json")));return normalizeV1({tracks:d[0],modules:d[1],lessons:d[2],planets:d[3]});}
const api={normalizeV1,normalizeV2,normalizeV3,projectV3ToLegacy,loadLegacyProjection,load};root.DCHCatalogCompat=api;if(typeof module!=="undefined"&&module.exports)module.exports=api;
})(typeof window!=="undefined"?window:globalThis);
