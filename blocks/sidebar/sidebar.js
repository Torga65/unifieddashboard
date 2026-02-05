/**
 * Right-side sidebar navigation (llmo-spacecat-dashboard style).
 * Renders nav links in a fixed right sidebar; highlights current page.
 */

const NAV_ITEMS = [
  { label: 'Home', href: '/index.html', icon: 'home' },
  { label: 'Dashboard', href: '/dashboard.html', icon: 'dashboard' },
  { label: 'Customer Table', href: '/customer-table.html', icon: 'table' },
  { label: 'Full Table', href: '/customer-full-table.html', icon: 'grid' },
  { label: 'Customer History', href: '/customer-history.html', icon: 'history' },
  { label: 'Engagement Live', href: '/engagement-live.html', icon: 'live' },
  { label: 'Engagement Weekly', href: '/engagement-weekly.html', icon: 'weekly' },
];

function getCurrentPath() {
  const path = (window.location.pathname || '').replace(/\/$/, '') || '/';
  return path === '/' ? '/index.html' : path;
}

export default async function decorate(block) {
  const currentPath = getCurrentPath();
  block.textContent = '';
  block.setAttribute('role', 'navigation');
  block.setAttribute('aria-label', 'Main navigation');

  const nav = document.createElement('nav');
  nav.className = 'sidebar-nav';

  NAV_ITEMS.forEach((item) => {
    const a = document.createElement('a');
    a.href = item.href;
    a.className = 'sidebar-nav-item';
    a.textContent = item.label;
    if (new URL(a.href, window.location.origin).pathname === currentPath) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });

  block.appendChild(nav);
}
