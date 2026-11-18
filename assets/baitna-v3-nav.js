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