/**
 * BAITNA v3 — universal prototype view switcher.
 * Presentation/navigation only. No data writes, no external calls,
 * no change to the existing domain routes, authorization or business scripts.
 */
(function(){
 "use strict";
 if(document.getElementById("baitnaV3Switcher"))return;
 var root=document.documentElement;
 var prefix=document.body.dataset.baitnaSurface==="landing"?"":"../";
 var items=[
  {url:"",ar:"الصفحة الرئيسية",en:"Home",short:"01"},
  {url:"demo/lifecycle.html",ar:"مساحة العمل",en:"Workspace",short:"02"},
  {url:"demo/orb.html",ar:"متطلبات المالك (ORB)",en:"Owner brief (ORB)",short:"03"},
  {url:"demo/compliance.html",ar:"اشتراطات البناء",en:"Building references",short:"04"},
  {url:"demo/",ar:"تجربة البناء",en:"Construction demo",short:"05"},
  {url:"demo/authority.html",ar:"عرض الجهة الرقابية",en:"Regulator demo",short:"06"}
 ];
 var path=location.pathname.replace(/\/+$/,"/");
 var norm=function(p){return p.replace(/\/+$/,"/")};
 var base=location.pathname.includes("/demo/")?location.pathname.split("/demo/")[0]+"/":location.pathname.replace(/index\.html$/,"");
 var active=norm(path).replace(/index\.html$/,"");
 var container=document.createElement("div");
 container.id="baitnaV3Switcher";
 container.className="v3-switcher";
 container.dataset.baitnaSurface="navigation";
 var trigger=document.createElement("button");
 trigger.type="button";trigger.className="v3-switcher-trigger";
 trigger.setAttribute("aria-expanded","false");trigger.setAttribute("aria-haspopup","true");
 trigger.setAttribute("aria-controls","baitnaV3Menu");
 var mark=document.createElement("span");mark.className="v3-switcher-mark";mark.textContent="⌘";mark.setAttribute("aria-hidden","true");
 var text=document.createElement("span");text.className="v3-switcher-label";
 var chevron=document.createElement("span");chevron.className="v3-switcher-chevron";chevron.textContent="⌃";chevron.setAttribute("aria-hidden","true");
 trigger.append(mark,text,chevron);
 var panel=document.createElement("nav");
 panel.className="v3-switcher-panel";panel.id="baitnaV3Menu";
 panel.hidden=true;
 var heading=document.createElement("div");heading.className="v3-switcher-heading";
 var h=document.createElement("strong"),sub=document.createElement("small");
 heading.append(h,sub);panel.append(heading);
 var menu=document.createElement("div");menu.className="v3-switcher-links";
 var anchors=[];
 items.forEach(function(item){
  var a=document.createElement("a");
  a.href=prefix+item.url;
  a.className="v3-switcher-link";
  var numeric=document.createElement("span");numeric.className="v3-switcher-num";numeric.textContent=item.short;
  var name=document.createElement("span");name.className="v3-switcher-name";
  a.append(numeric,name);
  var dest=norm(base+item.url).replace(/index\.html$/,"");
  if(dest===active){a.setAttribute("aria-current","page");a.classList.add("is-current")}
  menu.append(a);anchors.push({a:a,name:name,item:item});
 });
 panel.append(menu);container.append(trigger,panel);document.body.append(container);
 function translate(){
  var en=root.lang==="en";
  text.textContent=en?"Explore BAITNA":"استكشف بيتنا";
  h.textContent=en?"Navigate the experience":"التنقل بين الواجهات";
  sub.textContent=en?"Illustrative prototype views":"واجهات العرض التجريبي";
  trigger.setAttribute("aria-label",en?"Navigate BAITNA prototype views":"التنقل بين واجهات بيتنا التجريبية");
  panel.setAttribute("aria-label",en?"BAITNA prototype pages":"واجهات بيتنا التجريبية");
  anchors.forEach(function(x){x.name.textContent=en?x.item.en:x.item.ar;});
 }
 function setOpen(open){
  trigger.setAttribute("aria-expanded",open?"true":"false");
  panel.hidden=!open;container.classList.toggle("is-open",open);
  if(open && anchors.length)anchors[0].a.focus();
 }
 trigger.addEventListener("click",function(){setOpen(panel.hidden)});
 document.addEventListener("keydown",function(e){
  if(e.key==="Escape"&&!panel.hidden){setOpen(false);trigger.focus()}
 });
 document.addEventListener("click",function(e){
  if(!container.contains(e.target)&&!panel.hidden)setOpen(false)
 });
 new MutationObserver(translate).observe(root,{attributes:true,attributeFilter:["lang"]});
 translate();
})();

/* BAITNA approved brand: DOM-only, bilingual, no application-state writes. */
(function(){
 "use strict";
 var html=document.documentElement, landing=document.body.dataset.baitnaSurface==="landing";
 function element(tag,cls){var x=document.createElement(tag);x.className=cls;return x}
 var name,latin,tagline,subline,headerSub,footer;
 if(landing){
  var hero=document.querySelector(".hero .wrap > div:first-child");
  if(hero&&!document.getElementById("baitnaBrandIntro")){
   var mast=element("div","baitna-hero-brand");mast.id="baitnaBrandIntro";
   var img=document.createElement("img");img.src="assets/baitna-mark.svg";img.alt="";img.width=94;img.height=94;
   name=element("span","baitna-hero-word");latin=element("span","baitna-hero-latin");
   mast.append(img,name,latin);tagline=element("p","baitna-hero-motto");
   subline=element("p","baitna-hero-motto-translation");
   var lockup=element("div","baitna-brand-lockup");lockup.append(mast,tagline,subline);hero.prepend(lockup);
  }
  var header=document.querySelector(".top .logo");
  if(header&&!header.querySelector(".baitna-header-caption")){headerSub=element("small","baitna-header-caption");header.append(headerSub)}
  var foot=document.querySelector("footer .wrap");
  if(foot){footer=element("p","baitna-footer-motto");foot.append(footer)}
 }
 document.querySelectorAll(".brand .mark").forEach(function(el){el.textContent="";el.setAttribute("aria-hidden","true")});
 function translateBrand(){
  var en=html.lang==="en";
  if(name)name.textContent=en?"BAITNA":"بيتنا";
  if(latin)latin.textContent=en?"بيتنا":"BAITNA";
  if(tagline)tagline.textContent=en?"A Home That Endures.":"ويبقى للبيت أثر.";
  if(subline)subline.textContent=en?"ويبقى للبيت أثر.":"A HOME THAT ENDURES.";
  if(headerSub)headerSub.textContent=en?"بيتنا":"BAITNA";
  if(footer)footer.textContent=en?"A Home That Endures.":"ويبقى للبيت أثر.";
  if(landing)document.title=en?"BAITNA | A Home That Endures.":"بيتنا | ويبقى للبيت أثر.";
  /* Isolate each bilingual fragment, not the entire RTL page. */
  [
   [name,en?"en":"ar"],[latin,en?"ar":"en"],
   [tagline,en?"en":"ar"],[subline,en?"ar":"en"],
   [headerSub,en?"ar":"en"],[footer,en?"en":"ar"]
  ].forEach(function(entry){
   var el=entry[0],language=entry[1];
   if(!el)return;
   el.setAttribute("lang",language);
   el.setAttribute("dir",language==="en"?"ltr":"rtl");
  });
  /* Latin technical labels embedded in Arabic UI remain left-to-right. */
  document.querySelectorAll("#lifecycle-v2 .v2-modules em, .brand em[lang='en'], .v3-switcher-num").forEach(function(el){
   el.setAttribute("lang","en");el.setAttribute("dir","ltr");
  });
 }
 new MutationObserver(translateBrand).observe(html,{attributes:true,attributeFilter:["lang"]});
 translateBrand();
})();
