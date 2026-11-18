"use strict";
const assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const approved=fs.readFileSync(path.resolve(__dirname,"fixtures/baitna-approved-share-head.html"),"utf8");
const start='<meta property="og:title" ';
const end='<script src="assets/baitna-glossary-v2.js?v=2" defer></script>';
function restoreShareHead(page,current,baseline){
 if(page!=="index.html")return current;
 const s=current.indexOf(start),e=current.indexOf(end),bs=baseline.indexOf(start),be=baseline.indexOf(end);
 assert.ok(s>=0&&e>s&&bs>=0&&be>bs,"share metadata boundary changed");
 assert.equal(current.slice(s,e),approved,"only the exactly approved static social metadata may differ");
 assert.ok(!approved.includes("<script"),"social metadata must be passive");
 return current.slice(0,s)+baseline.slice(bs,be)+current.slice(e);
}
module.exports={restoreShareHead};
