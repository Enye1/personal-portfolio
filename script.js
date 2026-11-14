(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const menuToggle = $("#menuToggle");
  const nav = $("#mainNav");
  const header = $(".site-header");
  const backToTop = $("#backToTop");
  const progress = $("#scrollProgress");
  const toast = $("#toast");

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2800);
  }
  menuToggle?.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    nav.classList.toggle("open", !expanded);
  });
  $$(".nav-link, .header-cta").forEach(link => link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }
  });
  function onScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    header.classList.toggle("scrolled", window.scrollY > 30);
    backToTop.classList.toggle("visible", window.scrollY > 550);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add("visible"));
  }
  const sections = $$("main section[id]");
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          $$(".nav-link").forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => sectionObserver.observe(section));
  }
  const typedRole = $("#typedRole");
  const roles = ["Aspiring Developer", "IT Student", "Creative Problem Solver", "Lifelong Learner"];
  let roleIndex = 0, charIndex = 0, deleting = false;
  function typeRole() {
    if (!typedRole || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const current = roles[roleIndex];
    typedRole.textContent = current.slice(0, charIndex);
    if (!deleting && charIndex < current.length) {
      charIndex++;
      window.setTimeout(typeRole, 85);
    } else if (deleting && charIndex > 0) {
      charIndex--;
      window.setTimeout(typeRole, 38);
    } else {
      deleting = !deleting;
      if (!deleting) roleIndex = (roleIndex + 1) % roles.length;
      window.setTimeout(typeRole, deleting ? 1400 : 350);
    }
  }
  if (typedRole) typeRole();
  const skillStatus = $("#skillStatus");
  $$("[data-skill-filter]").forEach(button => button.addEventListener("click", () => {
    $$("[data-skill-filter]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("selected", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const filter = button.dataset.skillFilter;
    let visible = 0;
    $$(".skill-card").forEach(card => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    if (skillStatus) skillStatus.textContent = `Showing ${filter === "all" ? "all " : ""}${visible} skill${visible === 1 ? "" : "s"}.`;
  }));
  const projectCards = $$(".project-card");
  const projectCount = $("#projectCount");
  $$("[data-filter]").forEach(button => button.addEventListener("click", () => {
    $$("[data-filter]").forEach(item => {
      const selected = item === button;
      item.classList.toggle("active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });
    const filter = button.dataset.filter;
    let visible = 0;
    projectCards.forEach(card => {
      const show = filter === "all" || card.dataset.projectCategory === filter;
      card.classList.toggle("hidden", !show);
      if (show) visible++;
    });
    projectCount.textContent = `${String(visible).padStart(2, "0")} PROJECT${visible === 1 ? "" : "S"}`;
  }));
  const modal = $("#imageModal");
  const modalImage = $("#modalImage");
  let lastFocusedElement;
  const closeModal = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImage.src = "";
    lastFocusedElement?.focus();
  };
  $$(".preview-trigger").forEach(button => button.addEventListener("click", () => {
    lastFocusedElement = button;
    modalImage.src = button.dataset.preview;
    modalImage.alt = `${button.getAttribute("aria-label") || "Project"} preview`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    $("#modalClose").focus();
  }));
  $("#modalClose").addEventListener("click", closeModal);
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("open")) closeModal(); });
  $$(".achievement-row").forEach(row => row.addEventListener("click", () => showToast(row.dataset.achievement)));
  const contactForm = $("#contactForm");
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const status = $("#formStatus");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (name.length < 2 || !emailPattern.test(email) || subject.length < 2 || message.length < 10) {
      status.textContent = "Please complete every field and enter a valid email address. Your message must be at least 10 characters.";
      showToast("Please check the form fields.");
      return;
    }

    const recipient = $("#contactEmail")?.dataset.recipient || "";
    if (recipient.includes("YOUR_EMAIL")) {
      status.textContent = "Form validated. Add your email address to the contact link before enabling email preparation.";
      showToast("Validation passed â€” add your email address first.");
      return;
    }

    const mailSubject = encodeURIComponent(subject);
    const mailBody = encodeURIComponent(`Name: ${name}\nReply email: ${email}\n\n${message}`);
    status.textContent = "Your email application should open with the message prepared. Send it there to complete delivery.";
    window.location.href = `mailto:${recipient}?subject=${mailSubject}&body=${mailBody}`;
  });

  $("#year").textContent = new Date().getFullYear();
})();

