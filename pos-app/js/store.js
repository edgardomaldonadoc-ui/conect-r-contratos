import { TABLES } from './data.js';

class Store {
  constructor() {
    this.listeners = new Set();
    
    // Default initial state
    this.state = {
      activeView: 'tables', // 'tables' | 'menu' | 'kds'
      activeTableId: null,
      activeZoneId: 'main',
      activeMenuCategory: 'mains',
      searchQuery: '',
      
      // Tables state (loaded from localStorage or default)
      tables: this.loadFromStorage('pos_tables', TABLES),
      
      // Orders state (loaded from localStorage)
      // Format: { [tableId_or_takeoutId]: Order }
      orders: this.loadFromStorage('pos_orders', {}),
      
      // Kitchen tickets
      kdsTickets: this.loadFromStorage('pos_kds_tickets', []),

      theme: this.loadFromStorage('pos_theme', 'dark')
    };

    // Initialize HTML body theme
    document.documentElement.setAttribute('data-theme', this.state.theme);
  }

  // Helper to load state from localStorage
  loadFromStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.error(`Error loading key ${key} from storage:`, e);
      return fallback;
    }
  }

  // Helper to save state to localStorage
  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error(`Error saving key ${key} to storage:`, e);
    }
  }

  // State subscription
  subscribe(listener) {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  // Trigger all subscribers
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }

  // --- ACTIONS ---

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.saveToStorage('pos_theme', theme);
    this.notify();
  }

  changeView(view) {
    this.state.activeView = view;
    // If switching to tables, deselect active table
    if (view === 'tables') {
      this.state.activeTableId = null;
    }
    this.notify();
  }

  selectTable(tableId) {
    this.state.activeTableId = tableId;
    this.state.activeView = 'menu'; // Direct selection takes user to menu for ordering
    
    // Initialize order for this table if none exists
    if (tableId && !this.state.orders[tableId]) {
      this.state.orders[tableId] = this.createNewOrder(tableId, 'dine-in');
      this.updateTableStatus(tableId, 'occupied');
      this.saveToStorage('pos_orders', this.state.orders);
    }
    this.notify();
  }

  selectZone(zoneId) {
    this.state.activeZoneId = zoneId;
    this.notify();
  }

  selectCategory(catId) {
    this.state.activeMenuCategory = catId;
    this.notify();
  }

  setSearchQuery(query) {
    this.state.searchQuery = query;
    this.notify();
  }

  createNewOrder(tableId = null, type = 'takeout') {
    const id = tableId || 'TK-' + Date.now().toString().slice(-4);
    return {
      id,
      tableId,
      type, // 'dine-in' | 'takeout' | 'delivery'
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'pending', // 'pending' | 'sent' | 'paid'
      timestamp: Date.now()
    };
  }

  // Start a quick takeout order without a table
  startTakeoutOrder() {
    const takeoutId = 'TK-' + Date.now().toString().slice(-4);
    this.state.orders[takeoutId] = this.createNewOrder(null, 'takeout');
    this.state.activeTableId = takeoutId;
    this.state.activeView = 'menu';
    this.saveToStorage('pos_orders', this.state.orders);
    this.notify();
  }

  getActiveOrder() {
    if (!this.state.activeTableId) return null;
    return this.state.orders[this.state.activeTableId] || null;
  }

  addToCart(menuItem, qty, selectedModifiers = [], notes = '') {
    const activeId = this.state.activeTableId;
    if (!activeId) return;

    let order = this.state.orders[activeId];
    if (!order) {
      order = this.createNewOrder(activeId === 'takeout' ? null : activeId, activeId.startsWith('TK-') ? 'takeout' : 'dine-in');
      this.state.orders[activeId] = order;
    }

    // Calculate modifier price details
    const modifierSummary = selectedModifiers.map(opt => ({
      name: opt.name,
      price: opt.price
    }));

    const modifierCost = selectedModifiers.reduce((acc, opt) => acc + opt.price, 0);
    const itemPrice = menuItem.price + modifierCost;

    // Check if identical item (same ID, same modifiers, same notes) already exists in cart to increment qty
    const existingItem = order.items.find(item => 
      item.menuItemId === menuItem.id && 
      JSON.stringify(item.modifiers) === JSON.stringify(modifierSummary) &&
      item.notes === notes
    );

    if (existingItem) {
      existingItem.qty += qty;
    } else {
      const orderItemId = menuItem.id + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 5);
      order.items.push({
        id: orderItemId,
        menuItemId: menuItem.id,
        name: menuItem.name,
        basePrice: menuItem.price,
        modifierCost: modifierCost,
        price: itemPrice,
        qty: qty,
        modifiers: modifierSummary,
        notes: notes
      });
    }

    this.recalculateOrder(order);
    
    // If it's a table, update table visual billing amount
    if (order.tableId) {
      const table = this.state.tables.find(t => t.id === order.tableId);
      if (table) {
        table.amount = order.total;
        table.status = 'occupied';
        this.saveToStorage('pos_tables', this.state.tables);
      }
    }

    this.saveToStorage('pos_orders', this.state.orders);
    this.notify();
  }

  updateCartItemQty(orderItemId, change) {
    const activeId = this.state.activeTableId;
    if (!activeId) return;

    const order = this.state.orders[activeId];
    if (!order) return;

    const item = order.items.find(i => i.id === orderItemId);
    if (!item) return;

    item.qty += change;
    
    if (item.qty <= 0) {
      order.items = order.items.filter(i => i.id !== orderItemId);
    }

    this.recalculateOrder(order);

    // Update table amount
    if (order.tableId) {
      const table = this.state.tables.find(t => t.id === order.tableId);
      if (table) {
        table.amount = order.items.length > 0 ? order.total : undefined;
        if (order.items.length === 0) {
          table.status = 'ready';
        }
        this.saveToStorage('pos_tables', this.state.tables);
      }
    }

    this.saveToStorage('pos_orders', this.state.orders);
    this.notify();
  }

  removeCartItem(orderItemId) {
    this.updateCartItemQty(orderItemId, -999);
  }

  clearActiveOrder() {
    const activeId = this.state.activeTableId;
    if (!activeId) return;

    const order = this.state.orders[activeId];
    if (order && order.tableId) {
      const table = this.state.tables.find(t => t.id === order.tableId);
      if (table) {
        table.status = 'ready';
        delete table.amount;
        this.saveToStorage('pos_tables', this.state.tables);
      }
    }

    delete this.state.orders[activeId];
    this.state.activeTableId = null;
    this.state.activeView = 'tables';
    this.saveToStorage('pos_orders', this.state.orders);
    this.notify();
  }

  recalculateOrder(order) {
    order.subtotal = order.items.reduce((acc, item) => acc + (item.price * item.qty), 0);
    order.tax = Math.round(order.subtotal * 0.0825 * 100) / 100; // 8.25% Tax
    order.total = Math.round((order.subtotal + order.tax) * 100) / 100;
  }

  updateTableStatus(tableId, status) {
    const table = this.state.tables.find(t => t.id === tableId);
    if (table) {
      table.status = status;
      if (status === 'ready' || status === 'dirty') {
        delete table.amount;
      }
      this.saveToStorage('pos_tables', this.state.tables);
      this.notify();
    }
  }

  // KDS: Send order to kitchen
  sendToKitchen() {
    const activeId = this.state.activeTableId;
    if (!activeId) return;

    const order = this.state.orders[activeId];
    if (!order || order.items.length === 0 || order.status === 'sent') return;

    order.status = 'sent';
    
    // Create KDS ticket
    const ticket = {
      id: 'KDS-' + Date.now().toString().slice(-4),
      orderId: order.id,
      tableId: order.tableId,
      type: order.type,
      items: order.items.map(item => ({
        name: item.name,
        qty: item.qty,
        modifiers: item.modifiers.map(m => m.name),
        notes: item.notes
      })),
      timestamp: Date.now(),
      status: 'pending' // 'pending' | 'completed'
    };

    this.state.kdsTickets.push(ticket);
    this.saveToStorage('pos_kds_tickets', this.state.kdsTickets);
    this.saveToStorage('pos_orders', this.state.orders);
    
    // Show toast or transition
    this.notify();
    return ticket;
  }

  // Checkout and complete payment
  payOrder(paymentMethod) {
    const activeId = this.state.activeTableId;
    if (!activeId) return;

    const order = this.state.orders[activeId];
    if (!order) return;

    order.status = 'paid';
    
    // If it was a dining table, set to "dirty" (requires cleaning)
    if (order.tableId) {
      this.updateTableStatus(order.tableId, 'dirty');
    }

    // Clean order from active list
    delete this.state.orders[activeId];
    this.state.activeTableId = null;
    this.state.activeView = 'tables';

    this.saveToStorage('pos_orders', this.state.orders);
    this.notify();
  }

  // Complete KDS Ticket
  completeKdsTicket(ticketId) {
    this.state.kdsTickets = this.state.kdsTickets.filter(t => t.id !== ticketId);
    this.saveToStorage('pos_kds_tickets', this.state.kdsTickets);
    this.notify();
  }
}

// Single instance of store shared across application
export const store = new Store();
