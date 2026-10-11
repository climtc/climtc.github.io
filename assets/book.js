"use strict";
(() => {
  const input = document.getElementById("guide-search");
  if (!input) return;
  const chapters = [...document.querySelectorAll(".reading-chapter")];
  const sections = [...document.querySelectorAll(".reading-section")];
  const parts = [...document.querySelectorAll(".reading-part")];
  const count = document.getElementById("guide-count");
  const clear = document.getElementById("guide-clear");
  const empty = document.getElementById("guide-empty");
  const normalize = value => value.normalize("NFKC").toLocaleLowerCase().replace(/\s+/g, "");
  const sectionText = new Map(sections.map(section => [section, normalize(section.textContent)]));
  const chapterText = new Map(chapters.map(chapter => [chapter, normalize(chapter.querySelector(".chapter-heading").textContent + chapter.querySelector(".chapter-overview").textContent)]));
  let beforeSearch = null;
  function filter() {
    const query = normalize(input.value.trim());
    if (query && !beforeSearch) beforeSearch = new Map(sections.map(section => [section, section.open]));
    let matches = 0;
    chapters.forEach(chapter => {
      const chapterMatches = Boolean(query) && chapterText.get(chapter).includes(query);
      let sectionMatches = 0;
      chapter.querySelectorAll(".reading-section").forEach(section => {
        const match = !query || chapterMatches || sectionText.get(section).includes(query);
        section.hidden = !match;
        if (query && match) {
          section.open = true;
          sectionMatches += 1;
        }
        if (!query && beforeSearch) section.open = beforeSearch.get(section);
      });
      chapter.hidden = Boolean(query) && !chapterMatches && !sectionMatches;
      matches += sectionMatches + Number(chapterMatches);
    });
    parts.forEach(part => {
      let node = part.nextElementSibling;
      let visible = false;
      while (node && !node.classList.contains("reading-part")) {
        if (node.classList.contains("reading-chapter") && !node.hidden) visible = true;
        node = node.nextElementSibling;
      }
      part.hidden = !visible;
    });
    clear.hidden = !query;
    empty.hidden = !query || matches > 0;
    count.textContent = query ? `관련 목차 ${matches}개` : `세부 목차 ${sections.length}개`;
    if (!query) beforeSearch = null;
  }
  function reset() {
    input.value = "";
    filter();
  }
  input.addEventListener("input", filter);
  clear.addEventListener("click", () => { reset(); input.focus(); });
  document.getElementById("guide-reset").addEventListener("click", () => { reset(); input.focus(); });
  document.getElementById("expand-all").addEventListener("click", () => {
    sections.forEach(section => { if (!section.hidden && !section.closest(".reading-chapter").hidden) section.open = true; });
  });
  document.getElementById("collapse-all").addEventListener("click", () => {
    sections.forEach(section => { section.open = false; });
  });
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", () => {
      const target = document.getElementById(anchor.hash.slice(1));
      if (!target) return;
      if (target.closest(".reading-column") && beforeSearch) reset();
      const detail = target.closest(".reading-section");
      if (detail) detail.open = true;
    });
  });
  function revealHash() {
    const target = document.getElementById(location.hash.slice(1));
    if (target && target.matches(".reading-section")) target.open = true;
  }
  window.addEventListener("hashchange", revealHash);
  revealHash();
  // Printing includes collapsed sections, then restores the reader's choices.
  let beforePrint;
  window.addEventListener("beforeprint", () => {
    beforePrint = new Map([...chapters, ...sections, ...parts].map(node => [node, {hidden: node.hidden, open: node.open}]));
    [...chapters, ...sections, ...parts].forEach(node => { node.hidden = false; if (node.matches("details")) node.open = true; });
  });
  window.addEventListener("afterprint", () => {
    if (!beforePrint) return;
    beforePrint.forEach((state, node) => { node.hidden = state.hidden; if (node.matches("details")) node.open = state.open; });
    beforePrint = null;
  });
  document.getElementById("reading-tools").hidden = false;
})();
