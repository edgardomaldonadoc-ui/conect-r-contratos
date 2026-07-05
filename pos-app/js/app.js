import { store } from './store.js';
import { renderTablesView } from './components/tables.js';
import { renderMenuView } from './components/menu.js';
import { renderCart } from './components/cart.js';
import { renderKdsView } from './components/kds.js';

// DOM Elements
const viewBtns = document.querySelectorAll('.dock-btn[data-view]');
const floorPlanView = document.getElementById('floor-plan-view');
const menuView = document.getElementById('menu-view');
const kdsView = document.getElementById('kds-view');
const cartPanel = document.getElementById('cart-panel-element');

const paneTitleArea = document.getElementById('pane-title-area');
const menuSearchWrapper = document.getElementById('menu-search-wrapper');
const searchBar = document.getElementById('search-bar');
const takeoutBtn = document.getElementById('btn-takeout');
const themeToggleBtn = document.getElementById('theme-toggle');
const clockBtn = document.getElementById('btn-clock-in');

// Initialize App
function init() {
  // 1. Subscribe components to store state changes
  store.subscribe(render);

  // 2. Setup View Buttons Click handlers
  viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      store.changeView(view);
    });
  });

  // 3. Setup Takeout Button
  if (takeoutBtn) {
    takeoutBtn.addEventListener('click', () => {
      store.startTakeoutOrder();
    });
  }

  // 4. Setup Theme Toggle Button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const newTheme = store.state.theme === 'dark' ? 'light' : 'dark';
      store.setTheme(newTheme);
    });
  }

  // 5. Setup Search Bar Filter
  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      store.setSearchQuery(e.target.value);
    });
  }

  // 6. Setup Clock In Button
  if (clockBtn) {
    clockBtn.addEventListener('click', () => {
      const name = prompt("Enter Employee Name / ID to clock in:", "Edgardo");
      if (name) {
        alert(`Employee ${name} clocked in successfully at ${new Date().toLocaleTimeString()}!`);
      }
    });
  }

  // Trigger initial draw
  store.notify();
}

// Render UI based on current State
function render(state) {
  const { activeView, activeTableId, tables, theme } = state;

  // --- Theme Toggle Icon Rendering ---
  if (themeToggleBtn) {
    if (theme === 'light') {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      `;
    } else {
      themeToggleBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m0 13.5V21m9.75-9h-2.25m-13.5 0H3m16.035-7.035-1.59 1.59M5.25 18.75l1.59-1.59m0-9.18 1.59 1.59m9.18 9.18 1.59-1.59M12 10.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
        </svg>
      `;
    }
  }

  // --- Dock Buttons Visual Sync ---
  viewBtns.forEach(btn => {
    if (btn.dataset.view === activeView) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // --- View Panels Toggling & Renders ---
  // Hide all views first
  floorPlanView.classList.add('hidden');
  menuView.classList.add('hidden');
  kdsView.classList.add('hidden');
  
  // Hide search bar by default
  menuSearchWrapper.classList.add('hidden');

  if (activeView === 'tables') {
    floorPlanView.classList.remove('hidden');
    renderTablesView(floorPlanView, state);
    
    // Set Header
    paneTitleArea.innerHTML = `
      <h1>Floor Map</h1>
      <p>Main dining hall table layouts</p>
    `;
  } 
  else if (activeView === 'menu') {
    menuView.classList.remove('hidden');
    menuSearchWrapper.classList.remove('hidden');
    renderMenuView(menuView, state);

    // Set Header based on selected target ticket
    if (activeTableId) {
      if (activeTableId.startsWith('TK-')) {
        paneTitleArea.innerHTML = `
          <h1>Order Browser</h1>
          <p>Adding items to Takeout Check #${activeTableId.slice(-4)}</p>
        `;
      } else {
        const table = tables.find(t => t.id === activeTableId);
        paneTitleArea.innerHTML = `
          <h1>Table ${table ? table.number : activeTableId} Menu</h1>
          <p>Adding items to Dine-In Ticket</p>
        `;
      }
    } else {
      paneTitleArea.innerHTML = `
        <h1>Order Menu</h1>
        <p>Browse categories and items</p>
      `;
    }
  } 
  else if (activeView === 'kds') {
    kdsView.classList.remove('hidden');
    renderKdsView(kdsView, state);

    paneTitleArea.innerHTML = `
      <h1>Kitchen Display System</h1>
      <p>Active preparation tickets queue</p>
    `;
  }

  // --- Render Cart panel ---
  renderCart(cartPanel, state);
}

// Start application
init();
