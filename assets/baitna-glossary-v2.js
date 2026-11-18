/* BAITNA UI V2 — Glossary only; neither changes original text nor routes/business state. */
(function () {
  "use strict";
  var entries = [
    ["#lifecycle-v2 .v2-modules a[href='demo/orb.html']",
      "ملف متطلبات المالك (ORB): إدخال احتياجات المشروع مرة واحدة.",
      "Owner Requirements Brief (ORB): capture project needs once."],
    ["#lifecycle-v2 .v2-modules a[href='demo/lifecycle.html?view=sourcing']",
      "طلب معلومات (RFI) لاستطلاع السوق؛ طلب تقديم عروض (RFP) للمقترحات الفنية؛ طلب عروض أسعار (RFQ) للتسعير.",
      "Request for Information (RFI) surveys the market; Request for Proposal (RFP) seeks proposals; Request for Quotation (RFQ) requests prices."],
    ["#lifecycle-v2 .v2-modules a[href='demo/lifecycle.html?view=scope']",
      "بيان الأعمال (SOW) يحدد النطاق، وجدول الكميات (BOQ) يحدد بنود المواد والأعمال وكمياتها.",
      "Statement of Work (SOW) defines scope; Bill of Quantities (BOQ) lists measurable work and quantities."],
    ["#lifecycle-v2 .v2-modules a[href='demo/lifecycle.html?view=schedule']",
      "الجدول الزمني الرئيسي المتكامل (IMS): ربط الأنشطة والمواعيد والاعتماديات.",
      "Integrated Master Schedule (IMS): connected tasks, dependencies and dates."]
  ];
  function updateHints() {
    var english = document.documentElement.lang === "en";
    entries.forEach(function (entry) {
      var link = document.querySelector(entry[0]);
      if (!link) return;
      var explanation = english ? entry[2] : entry[1];
      /* Do not change href, children, data-ui-* translation attributes, or text content. */
      link.setAttribute("title", explanation);
      link.setAttribute("data-baitna-tip", explanation);
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateHints, { once: true });
  } else updateHints();
  new MutationObserver(updateHints).observe(document.documentElement, {
    attributes: true, attributeFilter: ["lang"]
  });
})();
