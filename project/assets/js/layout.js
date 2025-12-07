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
});
