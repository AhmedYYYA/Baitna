/* BAITNA UI V2 — accessibility-only DOM semantics repair.
   No route, data, permission, original text or business handler is changed. */
(function () {
 "use strict";
 function adjust() {
  /* The owner brief creates HTML input/select controls after initial load.
     Give each control its existing visible label as an accessible name. */
  var section = document.getElementById("section");
  if (section && document.body.dataset.baitnaSurface === "orb") {
   section.querySelectorAll(".field").forEach(function (field) {
    var label = field.querySelector(":scope > label");
    if (!label) return;
    var name = (label.textContent || "").replace(/\*/g, "").trim();
    if (!name) return;
    field.querySelectorAll("input,select,textarea").forEach(function (control) {
     if (control.hasAttribute("aria-label") || control.hasAttribute("aria-labelledby")) return;
     if (control.closest("label")) return;
     control.setAttribute("aria-label", name);
    });
   });
  }
  /* SVG diagram contains individually interactive nodes; the container is
     a group of controls, not one atomic image. Existing JS controls stay. */
  var graph = document.querySelector("#graphViewport svg[role='img']");
  if (graph) graph.setAttribute("role", "group");

  /* Regulator risk circle segments visually mirror adjacent accessible legend
     buttons. Hide duplicate SVG shapes from assistive technology, not from UI. */
  document.querySelectorAll("#bm-risk-segments circle").forEach(function (circle) {
   circle.removeAttribute("aria-label");
   circle.setAttribute("aria-hidden", "true");
  });
 }
 function init() {
  adjust();
  var orb = document.getElementById("section");
  if (orb) new MutationObserver(adjust).observe(orb, { childList: true, subtree: true });
  var chart = document.getElementById("bm-risk-segments");
  if (chart) new MutationObserver(adjust).observe(chart, { childList: true });
  /* Risk board may be injected after DOMContentLoaded. */
  if (!chart && document.body.dataset.baitnaSurface === "authority") {
   var main = document.querySelector("main");
   if (main) new MutationObserver(function (m,observer) {
    adjust();
    var next = document.getElementById("bm-risk-segments");
    if (next) {observer.disconnect();new MutationObserver(adjust).observe(next,{childList:true});}
   }).observe(main,{childList:true,subtree:false});
  }
 }
 if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
 else init();
})();
