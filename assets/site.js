"use strict";
(() => {
  const search = document.getElementById("public-search");
  const items = [...document.querySelectorAll(".searchable")];
  const sections = [...document.querySelectorAll(".collection")];
  const clear = document.getElementById("clear-search");
  document.getElementById("search-bar").hidden = false;
  function filter() {
    const query = search.value.trim().normalize("NFC").toLocaleLowerCase();
    let count = 0;
    items.forEach(item => {
      const match = `${item.dataset.search || ""} ${item.textContent}`.normalize("NFC").toLocaleLowerCase().includes(query);
      item.hidden = !match;
      count += Number(match);
    });
    sections.forEach(section => { section.hidden = ![...section.querySelectorAll(".searchable")].some(item => !item.hidden); });
    clear.hidden = !query;
    document.getElementById("no-results").hidden = count > 0;
    document.getElementById("search-count").textContent = query ? `검색 결과 ${count}개` : `전체 ${count}개`;
  }
  function reset() { search.value = ""; filter(); search.focus(); }
  search.addEventListener("input", filter);
  clear.addEventListener("click", reset);
  document.getElementById("reset-search").addEventListener("click", reset);
  document.querySelectorAll('.site-header nav a,.hero-counts a').forEach(a => a.addEventListener('click', () => {
    if (search.value) { search.value = ""; filter(); }
  }));
})();
