// Load HTML component into the given container by ID
async function loadComponent(id, url) {
  const container = document.getElementById(id);

  if (container) {
    // Pre-apply collapsed class if this is the sidebar
    if (id === "sidebar-container") {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved === "true") {
        container.classList.add("pre-collapsed");
      }
    }

    const response = await fetch(url);
    const html = await response.text();
    container.innerHTML = html;

    // Move collapsed class into actual sidebar after it's loaded
    if (id === "sidebar-container") {
      const sidebar = document.querySelector("#sidebar");
      if (container.classList.contains("pre-collapsed")) {
        sidebar.classList.add("collapsed");
      }
      container.classList.remove("pre-collapsed");
    }
  }
}

// Toggle sidebar and remember state in localStorage
function initSidebarToggle() {
  const sidebar = document.getElementById("sidebar");
  const icon = document.getElementById("hamburgerIcon");

  if (!sidebar || !icon) return;

  // Toggle collapse when hamburger is clicked
  icon.parentElement.addEventListener("click", () => {
    const isCollapsed = sidebar.classList.toggle("collapsed");
    icon.classList.toggle("rotated", isCollapsed);

    localStorage.setItem("sidebar-collapsed", isCollapsed ? "true" : "false");
  });

  // Apply saved collapse state or auto-collapse on small screen
  function handleResize() {
    const saved = localStorage.getItem("sidebar-collapsed");
    const shouldCollapse = saved === "true";

    if (window.innerWidth <= 768) {
      sidebar.classList.add("collapsed");
      icon.classList.add("rotated");
    } else {
      sidebar.classList.toggle("collapsed", shouldCollapse);
      icon.classList.toggle("rotated", shouldCollapse);
    }
  }

  window.addEventListener("resize", handleResize);
  handleResize(); // run once on load
}

// Highlight the active link in sidebar based on ?page= param
function highlightActiveNavLink() {
  const links = document.querySelectorAll(".nav-link");
  const params = new URLSearchParams(window.location.search);
  const currentPage = params.get("page") || "dashboard";

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href || !href.includes("?page=")) return;

    const linkPage = new URL(href, window.location.origin).searchParams.get(
      "page"
    );

    if (linkPage === currentPage) {
      link.classList.add("active");

      // If inside submenu, expand it and rotate the arrow only if not already open
      const submenu = link.closest(".submenu");
      if (submenu && !submenu.classList.contains("open")) {
        if (!submenu.classList.contains("open")) {
          submenu.classList.add("no-animation"); // Add a flag to suppress animation
          submenu.classList.add("open");

          // Force style recalculation
          void submenu.offsetHeight;

          submenu.classList.remove("no-animation"); // Remove after style is applied
        }

        const parentLink = submenu.previousElementSibling;
        if (parentLink) {
          const arrow = parentLink.querySelector(".arrow-icon");
          if (arrow && !arrow.classList.contains("rotate")) {
            arrow.classList.add("no-animation");
            arrow.classList.add("rotate");
            void arrow.offsetHeight; // force reflow
            arrow.classList.remove("no-animation");
          }
        }
      }
    } else {
      link.classList.remove("active");
    }
  });
}

function toggleSubmenu(event, submenuId) {
  event.preventDefault();

  // Ignore clicks from sub-links
  if (event.currentTarget.classList.contains("sub-link")) {
    return;
  }

  const submenu = document.getElementById(submenuId);
  const arrow = event.currentTarget.querySelector(".arrow-icon");

  const isOpen = submenu.classList.contains("open");

  if (isOpen) {
    // Remove both arrow and submenu classes at the same time
    submenu.classList.remove("open");
    if (arrow) arrow.classList.remove("rotate");
  } else {
    submenu.classList.add("open");
    if (arrow) arrow.classList.add("rotate");
  }
}

// On page load, load layout + content + init behaviors
window.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("sidebar-container", "../../components/sidebar.html");
  await loadComponent("header-container", "../../components/header.html");
  await loadComponent("footer-container", "../../components/footer.html");

  const page =
    new URLSearchParams(window.location.search).get("page") || "dashboard";
  await loadComponent("main-content", `${page}.html`);

  initSidebarToggle();
  highlightActiveNavLink();
});

function logout() {
  localStorage.clear();
  window.location.href = "../../index.html"; // Adjust path based on your folder structure
}
