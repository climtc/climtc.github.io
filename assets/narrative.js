"use strict";
// Narrative references point to the same searchable record, never a second card.
document.querySelectorAll('.narrative-links a[href^="#"]').forEach(link => {
  link.addEventListener("click", () => {
    const search = document.getElementById("public-search");
    if (search.value) {
      search.value = "";
      search.dispatchEvent(new Event("input", { bubbles: true }));
    }
    const destination = document.getElementById(link.getAttribute("href").slice(1));
    if (destination) {
      destination.setAttribute("tabindex", "-1");
      destination.focus({ preventScroll: true });
    }
  });
});
