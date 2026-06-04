
  // ─────────────────────────────────────────
  // YOUR JS GOES HERE
  // ─────────────────────────────────────────
  //
  // PART 1 — FILTER
  //
  // What to select:
  //   .filters           → event delegation target for filter buttons
  //   .filter-btn        → all buttons (for removing .active)
  //   .card              → all cards (select once, reuse)
  //
  // What to toggle on cards:
  //   add    .hidden     → hides the card (opacity 0 + scale)
  //   remove .hidden     → shows the card
  //
  // What to toggle on buttons:
  //   add    .active     → on the clicked button
  //   remove .active     → from all other buttons
  //
  // Special case: if data-filter === 'all', show every card
  //
  // ─────────────────────────────────────────
  //
  // PART 2 — INTERSECTION OBSERVER
  //
  // Setup:
  //   1. Add .io-init to all cards on load (invisible + offset)
  //   2. Create observer — fires when card is 10% visible
  //   3. In callback: if entry.isIntersecting
  //                     → remove .io-init
  //                     → add    .io-visible
  //                     → observer.unobserve(entry.target)
  //   4. observer.observe() every card
  //
  // Note: .hidden and .io-init can coexist — both set opacity to 0.
  // When a filtered-out card scrolls into view, the observer will
  // add .io-visible, but .hidden still wins because it's added later.
  // This is fine for now. One way to avoid: check !entry.target.classList
  // .contains('hidden') before adding .io-visible.
  //
  // ─────────────────────────────────────────


 // ─────────────────────────────────────────
// PART 1 — FILTER
// ─────────────────────────────────────────

const buttons   = document.querySelectorAll(".filter-btn");
const card_grid = document.querySelectorAll(".card");

buttons.forEach(button => button.addEventListener("click", filterFunction));

function filterFunction(e) {
  if (e.target.tagName !== "BUTTON") return;

  const button_data_filter = e.target.getAttribute("data-filter");

  // Update active button
  buttons.forEach(button => button.classList.remove("active"));
  e.target.classList.add("active");

  // Show / hide cards
  card_grid.forEach(card => {
    if (button_data_filter === "all") {
      card.classList.remove("hidden");
    } else if (card.getAttribute("data-category") === button_data_filter) {
      card.classList.remove("hidden");
    } else {
      card.classList.add("hidden");
    }
  });
}

// ─────────────────────────────────────────
// PART 2 — INTERSECTION OBSERVER
// ─────────────────────────────────────────

// 1. Start all cards invisible + offset
card_grid.forEach(card => card.classList.add("io-init"));

// 2. Options
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

// 3. Callback
const callback = (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove("io-init");
      entry.target.classList.add("io-visible");
      observer.unobserve(entry.target);
    }
  });
};

// 4. Initialize and observe
const observer = new IntersectionObserver(callback, options);
card_grid.forEach(card => observer.observe(card));