import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

test("shared content persists and logs changes with version conflict protection",async(t)=>{
  const dir=await mkdtemp(join(tmpdir(),"sr-content-test-"));
  t.after(()=>rm(dir,{recursive:true,force:true}));
  process.env.PORTAL_CONTENT_FILE=join(dir,"content.json");
  const {getContent,getHistory,updateContent}=await import("./contentStore.mjs");
  const actor={username:"editor1",name:"Editor One",role:"editor"};
  assert.deepEqual(await getContent(),{version:0,sections:{}});
  const first=await updateContent("catalog",[{id:"c1",title:"Original"}],0,actor);
  assert.equal(first.version,1);
  const conflict=await updateContent("catalog",[{id:"c1",title:"Wrong"}],0,actor);
  assert.equal(conflict.status,409);
  const second=await updateContent("catalog",[{id:"c1",title:"Updated"}],1,actor);
  assert.equal(second.version,2);
  assert.equal((await getContent()).sections.catalog[0].title,"Updated");
  const audit=await getHistory();
  assert.equal(audit.length,2);
  assert.equal(audit[0].actor.username,"editor1");
  assert.equal(audit[0].changes[0].path,"/c1/title");
  assert.equal(audit[0].changes[0].before,"Original");
  assert.equal(audit[0].changes[0].after,"Updated");
});
