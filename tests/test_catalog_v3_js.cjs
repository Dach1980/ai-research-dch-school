const assert=require("node:assert/strict");
const fs=require("node:fs");
const compat=require("../scripts/catalog-compat.js");
const catalog=JSON.parse(fs.readFileSync("data/catalog/catalog-v3.json","utf8"));
const legacy=JSON.parse(fs.readFileSync("data/catalog/catalog-v2.json","utf8"));
const manifest=JSON.parse(fs.readFileSync("data/catalog/migration-manifest-v3.json","utf8"));
for(const path of ["scripts/lesson-catalog.js","scripts/home-knowledge-map.js","scripts/planet-map-catalog.js"]){
 const source=fs.readFileSync(path,"utf8");
 assert.ok(source.includes("catalog-v3.json"));
 if(path==="scripts/planet-map-catalog.js"){assert.ok(source.includes('x.status==="review"&&x.content_state==="localized"'));assert.ok(source.includes('x.status==="published"&&x.content_state==="published"'));assert.ok(source.includes("reviewNote"));}
 assert.doesNotMatch(source,/loadLegacyProjection/);
}
const normalized=compat.normalizeV3(catalog);
assert.equal(normalized.schema_version,3);
assert.equal(normalized.source_schema_version,3);
assert.equal(normalized.themes.filter(x=>x.track_uid==="trk-a").length,5);
assert.equal(normalized.modules.length,27);
assert.throws(()=>compat.normalizeV3({...catalog,lessons:[{...catalog.lessons[0],module_uid:"missing"}]}),/Unknown lesson parent UID/);
const projected=compat.projectV3ToLegacy(catalog,legacy,manifest);
assert.deepEqual(projected.lessons.map(x=>x.id),legacy.lessons.map(x=>x.id));
assert.deepEqual(projected.lessons.map(x=>x.status),legacy.lessons.map(x=>x.status));
assert.deepEqual(projected.planets,legacy.planets);
const byLegacy=Object.fromEntries(projected.lessons.map(x=>[x.legacy_id,x]));
assert.ok(byLegacy["A.3"].v3_target_uids.length>1);
assert.equal(byLegacy["A.4"].v3_target_uids.length,4);
assert.equal(byLegacy["A.5"].v3_target_uids.length,10);
(async()=>{
 let requested="";
 const loaded=await compat.load({baseUrl:"/data/catalog",schemaVersion:3,fetchImpl:async url=>{
   requested=url;return {ok:true,json:async()=>catalog};
 }});
 assert.equal(requested,"/data/catalog/catalog-v3.json");
 assert.equal(loaded.lessons.length,catalog.lessons.length);
 const payloads={"catalog-v2.json":legacy,"catalog-v3.json":catalog,"migration-manifest-v3.json":manifest};
 const projection=await compat.loadLegacyProjection({baseUrl:"/data/catalog",fetchImpl:async url=>({ok:true,json:async()=>payloads[url.split("/").pop()]})});
 assert.equal(projection.compatibility.projection,"legacy_preserving");
 assert.equal(projection.lessons.length,legacy.lessons.length);
 console.log("Browser catalog v3 and legacy projection tests passed.");
})().catch(error=>{console.error(error);process.exitCode=1;});
