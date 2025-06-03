async function loadComponent(id, url) {
  const container = document.getElementById(id);
  if (container) {
    const response = await fetch(url);
    const html = await response.text();
    container.innerHTML = html;
  }
}

// Load all components and THEN initialize behaviors
window.addEventListener("DOMContentLoaded", async () => {
  await loadComponent("sidebar-container", "../../components/sidebar.html");
  await loadComponent("header-container", "../../components/header.html");
  await loadComponent("footer-container", "../../components/footer.html");

  initSidebarToggle(); // Call after header is loaded
});

function initSidebarToggle() {
  const icon = document.getElementById("hamburgerIcon");
  const sidebar = document.getElementById("sidebar");

  if (!icon || !sidebar) return;

  icon.parentElement.addEventListener("click", () => {
    const wasCollapsed = sidebar.classList.contains("collapsed");
    sidebar.classList.toggle("collapsed");

    icon.classList.toggle("rotated", !wasCollapsed);
  });

  // Auto-collapse on small screens
  function handleResize() {
    if (window.innerWidth <= 768) {
      sidebar.classList.add("collapsed");
      icon.classList.add("rotated");
    } else {
      sidebar.classList.remove("collapsed");
      icon.classList.remove("rotated");
    }
  }

  handleResize();
  window.addEventListener("resize", handleResize);
}
