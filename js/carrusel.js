class InfiniteCarousel {
  constructor({
  track,
  prevBtn,
  nextBtn,
  cardsSelector,
  visible = 3
}) {

  // Safety check
  if (!track) {
    return;
  }

  this.track = track;
  this.prevBtn = prevBtn;
  this.nextBtn = nextBtn;
  this.cardsSelector = cardsSelector;
  this.visible = visible;
  this.index = 0;

  this.cards = Array.from(
    track.querySelectorAll(cardsSelector)
  );

  // Another safety check
  if (this.cards.length === 0) {
    return;
  }

  this.init();
}

  init() {
    this.setupClones();
    this.bindEvents();
    this.update(false);
    this.handleResize();
  }

  setupClones() {
    const cards = this.cards;

    // remove old clones if any
    this.track.querySelectorAll(".clone").forEach(c => c.remove());

    const firstClones = cards.slice(0, this.visible)
      .map(c => this.clone(c));

    const lastClones = cards.slice(-this.visible)
      .map(c => this.clone(c));

    lastClones.forEach(c => this.track.prepend(c));
    firstClones.forEach(c => this.track.appendChild(c));

    this.allCards = Array.from(this.track.children);
    this.index = this.visible;
  }

  clone(node) {
    const c = node.cloneNode(true);
    c.classList.add("clone");
    return c;
  }

  getStep() {
    const card = this.track.querySelector(this.cardsSelector);
    const gap = parseInt(getComputedStyle(this.track).gap) || 0;
    return card.offsetWidth + gap;
  }

  update(animated = true) {
    const step = this.getStep();

    this.track.style.transition = animated
      ? "transform 0.5s ease"
      : "none";

    this.track.style.transform =
      `translateX(-${this.index * step}px)`;
  }

  next() {
    this.index++;
    this.update(true);
  }

  prev() {
    this.index--;
    this.update(true);
  }

  bindEvents() {
    this.nextBtn?.addEventListener("click", () => this.next());
    this.prevBtn?.addEventListener("click", () => this.prev());

    this.track.addEventListener("transitionend", () => {
      const realCount = this.cards.length;

      if (this.index >= realCount + this.visible) {
        this.index = this.visible;
        this.update(false);
      }

      if (this.index < this.visible) {
        this.index = realCount + this.index;
        this.update(false);
      }
    });
  }

  handleResize() {
    window.addEventListener("resize", () => {
      requestAnimationFrame(() => {
        this.update(false);
      });
    });
  }
}

class PageCarousel {
  constructor({
    track,
    prevBtn,
    nextBtn,
    pageSelector = ".identity-page"
  }) {

    this.track = track;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.pageSelector = pageSelector;

    this.pages = [];
    this.index = 0;

    this.init();
  }

  init() {
    this.pages = Array.from(
      this.track.querySelectorAll(this.pageSelector)
    );

    this.setupClones();
    this.bind();
    this.update(false);
  }

  setupClones() {
    this.track.querySelectorAll(".clone").forEach(c => c.remove());

    const first = this.pages[0].cloneNode(true);
    const last = this.pages[this.pages.length - 1].cloneNode(true);

    first.classList.add("clone");
    last.classList.add("clone");

    this.track.appendChild(first);
    this.track.prepend(last);

    this.index = 1;
  }

  update(animated = true) {
    this.track.style.transition = animated
      ? "transform 0.5s ease"
      : "none";

    this.track.style.transform =
      `translateX(-${this.index * 100}%)`;
  }

  next() {
    this.index++;
    this.update(true);
  }

  prev() {
    this.index--;
    this.update(true);
  }

  bind() {
    this.nextBtn?.addEventListener("click", () => this.next());
    this.prevBtn?.addEventListener("click", () => this.prev());

    this.track.addEventListener("transitionend", () => {
      const realCount = this.pages.length;

      if (this.index >= realCount + 1) {
        this.index = 1;
        this.update(false);
      }

      if (this.index <= 0) {
        this.index = realCount;
        this.update(false);
      }
    });
  }
}




document.addEventListener("DOMContentLoaded", () => {

  // =========================
  //  VIDEOGAME CAROUSEL
  // =========================

  new InfiniteCarousel({
    track: document.getElementById("gamesTrack"),
    prevBtn: document.getElementById("gamesPrev"),
    nextBtn: document.getElementById("gamesNext"),
    cardsSelector: ".project-card",
    visible: 3
  });

});









document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // VISUAL IDENTITY CAROUSEL
  // =========================

  const identityTrack =
    document.getElementById("identityTrack");

  const identityPrev =
    document.getElementById("identityPrev");

  const identityNext =
    document.getElementById("identityNext");

  // IMPORTANT SAFETY CHECK
  if (!identityTrack || !identityPrev || !identityNext) {
    return;
  }

  const identityCards = Array.from(
    identityTrack.querySelectorAll(".identity-card")
  );

  let identityCardsPerPage =
    window.innerWidth <= 768 ? 1 : 4;

  let identityPages = [];
  let identityIndex = 1;

  // =========================
  // CREATE PAGES
  // =========================

  function buildIdentityPages() {

    identityTrack.innerHTML = "";

    identityPages = [];

    identityCardsPerPage =
      window.innerWidth <= 768 ? 1 : 4;

    // CREATE GROUPS
    for (
      let i = 0;
      i < identityCards.length;
      i += identityCardsPerPage
    ) {

      const page = document.createElement("div");

      page.classList.add("identity-page");

      const slice = identityCards.slice(
        i,
        i + identityCardsPerPage
      );

      slice.forEach(card => {
        page.appendChild(card.cloneNode(true));
      });

      // FILL EMPTY SPACES
      while (
        page.children.length <
        identityCardsPerPage
      ) {

        const empty =
          document.createElement("div");

        empty.classList.add("identity-empty");

        page.appendChild(empty);
      }

      identityPages.push(page);
    }

    // =========================
    // CLONES
    // =========================

    const firstClone =
      identityPages[0].cloneNode(true);

    const lastClone =
      identityPages[
        identityPages.length - 1
      ].cloneNode(true);

    firstClone.classList.add("identity-clone");
    lastClone.classList.add("identity-clone");

    identityTrack.appendChild(lastClone);

    identityPages.forEach(page => {
      identityTrack.appendChild(page);
    });

    identityTrack.appendChild(firstClone);

    identityIndex = 1;

    updateIdentityCarousel(false);
  }

  // =========================
  // UPDATE
  // =========================

  function updateIdentityCarousel(
    animated = true
  ) {

    identityTrack.style.transition =
      animated
        ? "transform 0.5s ease"
        : "none";

    identityTrack.style.transform =
      `translateX(-${identityIndex * 100}%)`;
  }

  // =========================
  // NEXT
  // =========================

  identityNext.addEventListener(
    "click",
    () => {

      identityIndex++;

      updateIdentityCarousel(true);
    }
  );

  // =========================
  // PREV
  // =========================

  identityPrev.addEventListener(
    "click",
    () => {

      identityIndex--;

      updateIdentityCarousel(true);
    }
  );

  // =========================
  // LOOP
  // =========================

  identityTrack.addEventListener(
    "transitionend",
    () => {

      if (
        identityIndex >=
        identityPages.length + 1
      ) {

        identityIndex = 1;

        updateIdentityCarousel(false);
      }

      if (identityIndex <= 0) {

        identityIndex =
          identityPages.length;

        updateIdentityCarousel(false);
      }
    }
  );

  // =========================
  // RESIZE
  // =========================

  window.addEventListener(
    "resize",
    () => {

      buildIdentityPages();
    }
  );

  // =========================
  // INIT
  // =========================

  buildIdentityPages();

});































document.addEventListener("DOMContentLoaded", () => {

  // =========================
// ILLUSTRATION CAROUSEL
// =========================

new InfiniteCarousel({
  track: document.getElementById("illustrationTrack"),
  prevBtn: document.getElementById("illustrationPrev"),
  nextBtn: document.getElementById("illustrationNext"),
  cardsSelector: ".illustration-card",
  visible: 3
});

});











document.addEventListener("DOMContentLoaded", () => {

  // =========================
// BOOK COVERS CAROUSEL
// =========================

new InfiniteCarousel({
  track: document.getElementById("bookTrack"),
  prevBtn: document.getElementById("bookPrev"),
  nextBtn: document.getElementById("bookNext"),
  cardsSelector: ".book-card",
  visible: 4
});

});