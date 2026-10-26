const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

function closeMenu() {
  if (!menuToggle || !siteNavigation) return;

  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  siteNavigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isExpanded));
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? "Open navigation menu" : "Close navigation menu",
    );
    siteNavigation.classList.toggle("is-open", !isExpanded);
    document.body.classList.toggle("menu-open", !isExpanded);
  });

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  window.matchMedia("(min-width: 901px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });
}

const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelector("[data-print]")?.addEventListener("click", () => {
  window.print();
});

const certificateDialog = document.querySelector(".certificate-dialog");
const certificateDialogImage = document.querySelector(".certificate-dialog-image");
const certificateDialogCaption = document.querySelector(".certificate-dialog-caption");
const certificateDialogClose = document.querySelector(".certificate-dialog-close");
const imageDialogPrevious = document.querySelector(".image-dialog-prev");
const imageDialogNext = document.querySelector(".image-dialog-next");

if (
  certificateDialog instanceof HTMLDialogElement &&
  certificateDialogImage instanceof HTMLImageElement &&
  certificateDialogCaption instanceof HTMLElement &&
  certificateDialogClose instanceof HTMLButtonElement &&
  imageDialogPrevious instanceof HTMLButtonElement &&
  imageDialogNext instanceof HTMLButtonElement
) {
  let activeGallery = [];
  let activeGalleryCaption = "";
  let activeGalleryIndex = 0;

  function showGalleryImage(index) {
    activeGalleryIndex = (index + activeGallery.length) % activeGallery.length;
    const imagePath = activeGallery[activeGalleryIndex];

    if (!imagePath) {
      throw new Error("Life Pulse gallery image is missing.");
    }

    certificateDialogImage.src = imagePath;
    certificateDialogImage.alt = `${activeGalleryCaption} screenshot ${activeGalleryIndex + 1}`;
    certificateDialogCaption.textContent = `${activeGalleryCaption} · ${activeGalleryIndex + 1} of ${activeGallery.length}`;
  }

  document.querySelectorAll("[data-certificate-view], [data-image-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const preview = button.querySelector("img");
      const caption =
        button.dataset.imageCaption ??
        button.closest(".certificate-card")?.querySelector("strong")?.textContent;
      activeGallery = button.dataset.imageGallery?.split("|").filter(Boolean) ?? [];

      if (!preview || !caption) {
        throw new Error("Image preview is missing its image or caption.");
      }

      if (activeGallery.length > 0) {
        activeGalleryCaption = caption;
        showGalleryImage(0);
        imageDialogPrevious.hidden = false;
        imageDialogNext.hidden = false;
      } else {
        certificateDialogImage.src = preview.currentSrc || preview.src;
        certificateDialogImage.alt = preview.alt;
        certificateDialogCaption.textContent = caption;
        imageDialogPrevious.hidden = true;
        imageDialogNext.hidden = true;
      }

      certificateDialog.showModal();
    });
  });

  imageDialogPrevious.addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex - 1);
  });

  imageDialogNext.addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex + 1);
  });

  certificateDialogClose.addEventListener("click", () => {
    certificateDialog.close();
  });

  certificateDialog.addEventListener("click", (event) => {
    if (event.target === certificateDialog) {
      certificateDialog.close();
    }
  });

  certificateDialog.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      certificateDialog.close();
    } else if (event.key === "ArrowLeft" && activeGallery.length > 0) {
      showGalleryImage(activeGalleryIndex - 1);
    } else if (event.key === "ArrowRight" && activeGallery.length > 0) {
      showGalleryImage(activeGalleryIndex + 1);
    }
  });

  certificateDialog.addEventListener("close", () => {
    activeGallery = [];
    imageDialogPrevious.hidden = true;
    imageDialogNext.hidden = true;
  });
}

const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
