const assert=require("node:assert/strict"),c=require("../scripts/catalog-compat.js");
const t={id:"track-a",code:"A",title:"Understanding AI",status:"active",url:"tracks/understanding-ai.html"};
const l={id:"A.1",module_id:"module-11",title:"Lesson",status:"published",access:"open",level:"beginner",duration_min:1,duration_max:2,prerequisites:[],learning_outcomes:["Outcome"],url:"lessons/a-1-what-is-artificial-intelligence.html"};
const p={id:"planet-A-1",lesson_id:"A.1",accent_id:"blue"};
const old=c.normalizeV1({tracks:{tracks:[t]},modules:{modules:[{id:"module-11",track_id:"track-a",title:"Foundations",status:"in_progress"}]},lessons:{lessons:[{...l,track_id:"track-a"}]},planets:{planets:[p]}});
assert.equal(old.themes[0].id,"A.1");assert.equal(old.modules[0].id,"A.1.1");assert.equal(old.lessons[0].id,"A.1.1.1");
const v=c.normalizeV2({schema_version:2,tracks:[t],themes:[{id:"A.1",track_id:"track-a",code:"A.1",title:"Foundations",status:"in_progress"}],modules:[{id:"A.1.1",theme_id:"A.1",title:"Foundations",status:"in_progress"}],lessons:[{...l,id:"A.1.1.1",legacy_id:"A.1",module_id:"A.1.1"}],planets:[{...p,lesson_id:"A.1.1.1"}]});
assert.equal(v.lessons[0].track_id,"track-a");assert.throws(()=>c.normalizeV2({...v,modules:[{...v.modules[0],theme_id:"missing"}]}),/Unknown theme/);console.log("Browser catalog adapter tests passed.");
