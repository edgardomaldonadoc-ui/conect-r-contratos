import { CATEGORIES, MENU_ITEMS } from '../data.js';
import { store } from '../store.js';
import { openModifiersModal } from './modifiers.js';

export function renderMenuView(container, state) {
  const { activeMenuCategory, searchQuery } = state;

  // Filter items by category & search query
  let filteredItems = MENU_ITEMS;
  
  if (activeMenuCategory) {
    filteredItems = filteredItems.filter(item => item.category === activeMenuCategory);
  }

  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    filteredItems = MENU_ITEMS.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
  }

  container.innerHTML = `
    <div class="menu-layout">
      <!-- Categories sidebar -->
      <div class="category-list">
        ${CATEGORIES.map(cat => `
          <button class="category-item ${cat.id === activeMenuCategory && !searchQuery ? 'active' : ''}" data-category-id="${cat.id}">
            <span style="font-size: 18px; margin-right: 8px;">${cat.icon}</span>
            ${cat.name}
          </button>
        `).join('')}
      </div>

      <!-- Menu Items Grid -->
      <div class="items-grid">
        ${filteredItems.length === 0 ? `
          <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;">
            <h3>No items found</h3>
            <p>Try refining your search terms.</p>
          </div>
        ` : filteredItems.map(item => `
          <div class="item-card" data-item-id="${item.id}">
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'">
            <div class="item-info">
              <div class="item-name">${item.name}</div>
              <div class="item-footer">
                <span class="item-price">$${item.price.toFixed(2)}</span>
                ${item.modifiers.length > 0 ? `<span class="item-badge">Customizable</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  // Attach event listeners
  // 1. Click category
  container.querySelectorAll('.category-item').forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear search query on category switch to prevent confusion
      store.setSearchQuery('');
      const catId = btn.dataset.categoryId;
      store.selectCategory(catId);
      
      const searchBar = document.getElementById('search-bar');
      if (searchBar) searchBar.value = '';
    });
  });

  // 2. Click menu item
  container.querySelectorAll('.item-card').forEach(card => {
    card.addEventListener('click', () => {
      const itemId = card.dataset.itemId;
      const item = MENU_ITEMS.find(i => i.id === itemId);
      
      if (!store.state.activeTableId) {
        // If ordering without a table, automatically create a takeout checkout ticket
        store.startTakeoutOrder();
      }

      if (item.modifiers && item.modifiers.length > 0) {
        // Open modifiers modal
        openModifiersModal(item);
      } else {
        // Add to cart directly
        store.addToCart(item, 1);
      }
    });
  });
}
