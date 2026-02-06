/**
 * Right-side sidebar navigation (llmo-spacecat-dashboard style).
 * Renders nav links in a fixed right sidebar; highlights current page.
 */

const NAV_ITEMS = [
  { label: 'Home', href: '/index.html', icon: '🏠' },
  { label: 'Dashboard', href: '/dashboard.html', icon: '📊' },
  { label: 'Customer Table', href: '/customer-table.html', icon: '📋' },
  { label: 'Full Table', href: '/customer-full-table.html', icon: '📑' },
  { label: 'Customer History', href: '/customer-history.html', icon: '📈' },
  { label: 'Engagement Live', href: '/engagement-live.html', icon: '🔴' },
  { label: 'Engagement Weekly', href: '/engagement-weekly.html', icon: '📅' },
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
    const iconSpan = document.createElement('span');
    iconSpan.className = 'sidebar-nav-icon';
    iconSpan.setAttribute('aria-hidden', 'true');
    iconSpan.textContent = item.icon;
    a.appendChild(iconSpan);
    a.appendChild(document.createTextNode(item.label));
    if (new URL(a.href, window.location.origin).pathname === currentPath) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });

  block.appendChild(nav);
}
