"use strict";
const {test}=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
test("Static social metadata has both approved slogans and an image",()=>{
 const title="بيتنا | ويبقى للبيت أثر.";
 assert.ok(html.includes('<meta property="og:title" content="'+title+'">'));
 assert.ok(html.includes('<meta name="twitter:title" content="'+title+'">'));
 assert.ok(!/[A-Za-z]/.test(title),"No mixed RTL/LTR in share headline");
 assert.ok(!html.includes('<meta property="og:title" content="بيتنا | ويبقى للبيت أثر. | BAITNA'));
 for(const key of ["og:description","og:image","og:image:secure_url","og:image:type","og:image:width","og:image:height","og:image:alt"]){
  assert.ok(html.includes('property="'+key+'"'),key);
 }
 for(const key of ["twitter:title","twitter:description","twitter:image","twitter:image:alt"]){
  assert.ok(html.includes('name="'+key+'"'),key);
 }
 assert.ok(html.includes('name="twitter:card" content="summary_large_image"'));
 const english='BAITNA — A Home That Endures.';
 assert.ok(html.includes('<meta property="og:description" content="'+english));
 assert.ok(html.includes('<meta name="twitter:description" content="'+english));
 assert.ok(!/<meta property="og:description"[^>]*[؀-ۿ]/.test(html));
 assert.ok(html.includes('property="og:image:width" content="1200"'));
 assert.ok(html.includes('property="og:image:height" content="630"'));
 assert.ok(!/<meta property="og:title"[^>]*data-ui-meta-/i.test(html),"social title must be static for crawlers");
 assert.ok(html.includes("https://ahmedyyya.github.io/Baitna/assets/baitna-share-cover-v2.jpg"));
});
test("The social image is a genuine nonempty JPEG",()=>{
 const jpg=fs.readFileSync(path.join(root,"assets/baitna-share-cover-v2.jpg"));
 assert.deepEqual([...jpg.subarray(0,3)],[255,216,255]);
 assert.ok(jpg.length>5000&&jpg.length<900000,"unexpected file size");

 let dims=null;
 for(let i=2;i<jpg.length-9;){
  if(jpg[i]!==255){i++;continue}
  let marker=jpg[i+1],len=jpg.readUInt16BE(i+2);
  if([192,193,194,195,198,199,201,202,203].includes(marker)){
   dims=[jpg.readUInt16BE(i+7),jpg.readUInt16BE(i+5)];break;
  }
  if(!len||len<2)break;
  i+=2+len;
 }
 assert.deepEqual(dims,[1200,630],"share cover must be precisely 1200×630");

});
