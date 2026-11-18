/* BAITNA UI V2: presentation-only social metadata language parity.
   Does not change content, routing, business state, or existing descriptions. */
(function(){
 "use strict";
 function sync(){
   var isEnglish=document.documentElement.lang==="en";
   document.querySelectorAll("meta[data-ui-meta-en][data-ui-meta-ar]").forEach(function(node){
     var text=isEnglish?node.getAttribute("data-ui-meta-en"):node.getAttribute("data-ui-meta-ar");
     if(text!==null)node.setAttribute("content",text);
   });
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",sync,{once:true});
 else sync();
 new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["lang"]});
})();
