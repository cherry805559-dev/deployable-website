(function () {
  function textOf(element) {
    return (element && element.textContent ? element.textContent : "").replace(/\s+/g, " ").trim();
  }

  function findWorksSection() {
    const heading = Array.from(document.querySelectorAll("h1, h2, h3")).find(
      (node) => textOf(node) === "實拍作品牆"
    );
    return heading ? heading.closest("section") || heading.parentElement : null;
  }

  function findCategoryCards(section) {
    const markers = Array.from(section.querySelectorAll("*")).filter(
      (node) => node.children.length === 0 && textOf(node) === "點開查看作品"
    );

    const cards = markers.map((marker) => {
      let candidate = marker;
      while (candidate.parentElement && candidate.parentElement !== section) {
        const parent = candidate.parentElement;
        const markerCount = markers.filter((item) => parent.contains(item)).length;
        if (markerCount > 1) break;
        candidate = parent;
      }
      return candidate;
    });

    return Array.from(new Set(cards));
  }

  function titleFor(image) {
    const container = image.closest("figure, article, li, [class*='item'], [class*='work'], [class*='gallery']");
    const label = container && container.querySelector("figcaption, h3, h4, .caption, .title, [class*='name']");
    const title = textOf(label) || image.alt || image.title;
    return title && title !== "作品照片" ? title.trim() : "金紙藝品作品";
  }

  function descriptionFor(image, title) {
    const container = image.closest("figure, article, li, [class*='item'], [class*='work'], [class*='gallery']");
    const explicit = image.dataset.description || (container && container.dataset.description);
    const paragraph = container && container.querySelector(".description, [class*='description'], p");
    return explicit || textOf(paragraph) || `${title}實拍作品。尺寸、配色與敬獻用途可透過 LINE 詢問。`;
  }

  function isWorkImage(image, section) {
    if (!section.contains(image)) return false;
    const source = image.getAttribute("src") || "";
    if (!source || /logo|icon/i.test(source)) return false;
    if (image.closest("header, nav, footer")) return false;
    return /gallery-|LINE_ALBUM|Photoroom|IMG_|S__|作品|assets\//i.test(source);
  }

  function buildModal() {
    const dialog = document.createElement("dialog");
    dialog.className = "works-modal";
    dialog.setAttribute("aria-label", "作品詳細資訊");
    dialog.innerHTML = `
      <button class="works-modal-close" type="button" aria-label="關閉">&times;</button>
      <div class="works-modal-body">
        <div class="works-modal-image"><img alt=""></div>
        <div class="works-modal-copy"><h3></h3><p></p></div>
      </div>`;
    document.body.appendChild(dialog);

    dialog.querySelector(".works-modal-close").addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
    return dialog;
  }

  function init() {
    document.querySelectorAll(".works-modern-gallery, .works-modal").forEach((node) => node.remove());
    document.querySelectorAll(".works-gallery-legacy").forEach((node) => node.classList.remove("works-gallery-legacy"));

    const section = findWorksSection();
    if (!section) return;

    const categoryCards = findCategoryCards(section);
    const images = Array.from(section.querySelectorAll("img")).filter((image) => isWorkImage(image, section));
    const works = [];
    const seen = new Set();

    images.forEach((image) => {
      const source = image.currentSrc || image.getAttribute("src");
      if (!source || seen.has(source)) return;
      seen.add(source);
      const title = titleFor(image);
      works.push({ source, title, description: descriptionFor(image, title) });
    });

    if (!works.length) return;

    categoryCards.forEach((card) => card.classList.add("works-gallery-legacy"));

    const gallery = document.createElement("div");
    gallery.className = "works-modern-gallery";
    gallery.setAttribute("aria-label", "實拍作品列表");
    const modal = buildModal();
    const modalImage = modal.querySelector("img");
    const modalTitle = modal.querySelector("h3");
    const modalDescription = modal.querySelector("p");

    works.forEach((work) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "works-card";
      card.innerHTML = `
        <span class="works-card-media">
          <img src="${work.source}" alt="${work.title}" loading="lazy">
          <span class="works-card-overlay">查看作品</span>
        </span>
        <span class="works-card-title">${work.title}</span>`;
      card.addEventListener("click", () => {
        modalImage.src = work.source;
        modalImage.alt = work.title;
        modalTitle.textContent = work.title;
        modalDescription.textContent = work.description;
        modal.showModal();
      });
      gallery.appendChild(card);
    });

    const firstCard = categoryCards[0];
    if (firstCard && firstCard.parentElement) {
      firstCard.parentElement.insertBefore(gallery, firstCard);
    } else {
      section.appendChild(gallery);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
