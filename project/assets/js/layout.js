document.addEventListener('DOMContentLoaded', async () => {
  const load = async (url) => {
    const res = await fetch(url);
    return res.text();
  };

  const headerHtml = await load('partials/header.html');
  const sidebarHtml = await load('partials/sidebar.html');

  const main = document.getElementById('mainContent') || document.body;
  const headerContainer = document.createElement('div');
  headerContainer.innerHTML = headerHtml;
  const existingNav = document.querySelector('nav');
  if (existingNav) existingNav.remove();
  main.insertBefore(headerContainer.firstElementChild, main.firstChild);

  const sidebarContainer = document.createElement('div');
  sidebarContainer.innerHTML = sidebarHtml;
  const existingOverlay = document.querySelector('.sidebar-overlay');
  const existingSidebar = document.getElementById('sidebar');
  if (existingOverlay) existingOverlay.remove();
  if (existingSidebar) existingSidebar.remove();
  document.body.insertBefore(sidebarContainer.firstElementChild, document.body.firstChild);
  document.body.insertBefore(sidebarContainer.lastElementChild, document.body.firstChild.nextSibling);

  const title = document.body.dataset.pageTitle || document.title || '';
  const titleEl = document.getElementById('header-title');
  if (titleEl) titleEl.textContent = title;

  const applyTheme = (mode) => {
    if (mode === 'dark') { document.body.classList.add('dark'); }
    else { document.body.classList.remove('dark'); }
    localStorage.setItem('darkMode', mode === 'dark' ? 'enabled' : 'disabled');
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
      const icon = themeBtn.querySelector('i');
      if (icon) { icon.classList.remove('fa-moon', 'fa-sun'); icon.classList.add(mode === 'dark' ? 'fa-sun' : 'fa-moon'); }
    }
    const darkToggle = document.getElementById('darkModeToggle');
    if (darkToggle) { darkToggle.checked = mode === 'dark'; }
  };

  const saved = localStorage.getItem('darkMode');
  applyTheme(saved === 'enabled' ? 'dark' : 'light');

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark');
    applyTheme(isDark ? 'light' : 'dark');
  });

  const darkToggle = document.getElementById('darkModeToggle');
  if (darkToggle) darkToggle.addEventListener('change', () => {
    applyTheme(darkToggle.checked ? 'dark' : 'light');
  });

  const sidebar = document.getElementById('sidebar');
  const sidebarToggle = document.getElementById('sidebarToggle');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const updateSidebarState = () => {
    if (!sidebar || !main) return;
    if (window.innerWidth >= 1025) {
      sidebar.classList.remove('mobile-open');
      sidebar.classList.remove('collapsed');
      sidebar.style.display = 'block';
      main.style.marginLeft = 'var(--sidebar-width)';
      main.style.width = 'calc(100% - var(--sidebar-width))';
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    } else {
      sidebar.classList.remove('mobile-open');
      sidebar.style.display = 'none';
      main.style.marginLeft = '0';
      main.style.width = '100%';
      if (sidebarOverlay) sidebarOverlay.classList.remove('active');
    }
  };
  updateSidebarState();
  window.addEventListener('resize', updateSidebarState);
  if (sidebarToggle) sidebarToggle.addEventListener('click', () => {
    if (window.innerWidth >= 1025) {
      sidebar.classList.toggle('collapsed');
      const isCollapsed = sidebar.classList.contains('collapsed');
      main.style.marginLeft = isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)';
      main.style.width = isCollapsed ? 'calc(100% - var(--sidebar-collapsed-width))' : 'calc(100% - var(--sidebar-width))';
      sidebar.style.transition = 'width 0.3s ease-in-out';
      main.style.transition = 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out';
      setTimeout(() => { sidebar.style.transition = ''; main.style.transition = ''; }, 300);
    }
  });
  if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', () => {
    if (window.innerWidth < 1025) {
      sidebar.classList.toggle('mobile-open');
      sidebar.style.display = sidebar.classList.contains('mobile-open') ? 'block' : 'none';
      if (sidebarOverlay) sidebarOverlay.classList.toggle('active');
    }
  });
  if (sidebarOverlay) sidebarOverlay.addEventListener('click', () => {
    if (window.innerWidth < 1025) {
      sidebar.classList.remove('mobile-open');
      sidebar.style.display = 'none';
      sidebarOverlay.classList.remove('active');
    }
  });
});
