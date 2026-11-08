const assert=require("node:assert/strict");
const fs=require("node:fs");
const compat=require("../scripts/catalog-compat.js");
const catalog=JSON.parse(fs.readFileSync("data/catalog/catalog-v3.json","utf8"));
const normalized=compat.normalizeV3(catalog);
assert.equal(normalized.schema_version,3);
assert.equal(normalized.source_schema_version,3);
assert.equal(normalized.themes.filter(x=>x.track_uid==="trk-a").length,5);
assert.equal(normalized.modules.length,27);
assert.throws(()=>compat.normalizeV3({...catalog,lessons:[{...catalog.lessons[0],module_uid:"missing"}]}),/Unknown lesson parent UID/);
(async()=>{
 let requested="";
 const loaded=await compat.load({baseUrl:"/data/catalog",schemaVersion:3,fetchImpl:async url=>{
   requested=url;return {ok:true,json:async()=>catalog};
 }});
 assert.equal(requested,"/data/catalog/catalog-v3.json");
 assert.equal(loaded.lessons.length,catalog.lessons.length);
 console.log("Browser catalog v3 adapter tests passed.");
})().catch(error=>{console.error(error);process.exitCode=1;});
