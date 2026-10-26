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

if (
  certificateDialog instanceof HTMLDialogElement &&
  certificateDialogImage instanceof HTMLImageElement &&
  certificateDialogCaption instanceof HTMLElement &&
  certificateDialogClose instanceof HTMLButtonElement
) {
  document.querySelectorAll("[data-certificate-view], [data-image-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const preview = button.querySelector("img");
      const title =
        button.dataset.imageCaption ??
        button.closest(".certificate-card")?.querySelector("strong")?.textContent;

      if (!preview || !title) {
        throw new Error("Image preview is missing its image or caption.");
      }

      certificateDialogImage.src = preview.currentSrc || preview.src;
      certificateDialogImage.alt = preview.alt;
      certificateDialogCaption.textContent = title.textContent ?? "";
      certificateDialog.showModal();
    });
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
    }
  });
}

const yearElement = document.querySelector("[data-year]");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}
