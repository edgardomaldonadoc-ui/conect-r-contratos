import { store } from '../store.js';
import { openCheckoutModal } from './checkout.js';

export function renderCart(container, state) {
  const activeOrder = store.getActiveOrder();
  const { tables } = state;

  if (!activeOrder) {
    container.innerHTML = `
      <div class="cart-header">
        <div class="cart-title">
          <h2>New Ticket</h2>
          <span>No active order selected</span>
        </div>
      </div>
      <div class="cart-items">
        <div class="cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <p>Select a table or press <strong>Takeout</strong><br>to start ordering.</p>
        </div>
      </div>
      <div class="cart-summary" style="opacity: 0.5; pointer-events: none;">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div class="summary-row">
          <span>Tax (8.25%)</span>
          <span>$0.00</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>$0.00</span>
        </div>
        <div class="cart-checkout-actions">
          <button class="btn btn-secondary" disabled>Hold / Cancel</button>
          <button class="btn btn-secondary" disabled>Kitchen</button>
          <button class="btn btn-primary btn-pay" disabled>Pay Check</button>
        </div>
      </div>
    `;
    return;
  }

  // Determine Title Name (e.g. Table 2 vs Takeout TK-41)
  let orderTitle = 'Takeout Order';
  let orderSubtitle = `ID: ${activeOrder.id}`;
  
  if (activeOrder.tableId) {
    const table = tables.find(t => t.id === activeOrder.tableId);
    orderTitle = `Table ${table ? table.number : activeOrder.tableId}`;
    orderSubtitle = `Dine-In Ticket`;
  }

  container.innerHTML = `
    <!-- Cart Header -->
    <div class="cart-header">
      <div class="cart-title">
        <h2>${orderTitle}</h2>
        <span>${orderSubtitle}</span>
      </div>
      
      <!-- Order type toggle -->
      <div class="cart-type-selector">
        <div class="type-tab ${activeOrder.type === 'dine-in' ? 'active' : ''}" data-type="dine-in">Dine-In</div>
        <div class="type-tab ${activeOrder.type === 'takeout' ? 'active' : ''}" data-type="takeout">Takeout</div>
        <div class="type-tab ${activeOrder.type === 'delivery' ? 'active' : ''}" data-type="delivery">Deliv</div>
      </div>
    </div>

    <!-- Cart items list -->
    <div class="cart-items">
      ${activeOrder.items.length === 0 ? `
        <div class="cart-empty">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
          <p>Cart is empty.<br>Tap menu items to add them here.</p>
        </div>
      ` : activeOrder.items.map(item => `
        <div class="cart-item">
          <div class="cart-item-header">
            <div class="cart-item-info">
              <div class="cart-item-name">${item.name}</div>
              ${item.modifiers.length > 0 ? `
                <div class="cart-item-modifiers">
                  ${item.modifiers.map(m => `• ${m.name} (${m.price > 0 ? `+$${m.price.toFixed(2)}` : 'Free'})`).join('<br>')}
                </div>
              ` : ''}
              ${item.notes ? `
                <div class="cart-item-modifiers" style="color: var(--warning); font-style: italic;">
                  Note: "${item.notes}"
                </div>
              ` : ''}
            </div>
            <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
          </div>
          
          <div class="cart-item-actions">
            <!-- Qty selectors -->
            <div class="qty-controller">
              <button class="qty-btn btn-minus" data-item-id="${item.id}">−</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn btn-plus" data-item-id="${item.id}">+</button>
            </div>
            
            <!-- Remove item -->
            <button class="item-delete-btn" data-item-id="${item.id}" title="Remove Item">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 18px; height: 18px;">
                <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
            </button>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Cart billing summary -->
    <div class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>$${activeOrder.subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (8.25%)</span>
        <span>$${activeOrder.tax.toFixed(2)}</span>
      </div>
      <div class="summary-row total">
        <span>Total</span>
        <span>$${activeOrder.total.toFixed(2)}</span>
      </div>

      <!-- Action items -->
      <div class="cart-checkout-actions">
        <button class="btn btn-secondary" id="cart-hold-btn">Hold / Cancel</button>
        <button class="btn btn-secondary ${activeOrder.status === 'sent' ? 'text-success' : ''}" 
                id="cart-kitchen-btn" ${activeOrder.items.length === 0 ? 'disabled' : ''}>
          ${activeOrder.status === 'sent' ? 'Sent ✓' : 'Send to Kitchen'}
        </button>
        <button class="btn btn-primary btn-pay" id="cart-pay-btn" ${activeOrder.items.length === 0 ? 'disabled' : ''}>
          Pay Check
        </button>
      </div>
    </div>
  `;

  // Attach Event Listeners
  // 1. Order Type Switch
  container.querySelectorAll('.type-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const type = tab.dataset.type;
      activeOrder.type = type;
      store.saveToStorage('pos_orders', store.state.orders);
      store.notify();
    });
  });

  // 2. Qty Increment / Decrement
  container.querySelectorAll('.btn-minus').forEach(btn => {
    btn.addEventListener('click', () => {
      store.updateCartItemQty(btn.dataset.itemId, -1);
    });
  });

  container.querySelectorAll('.btn-plus').forEach(btn => {
    btn.addEventListener('click', () => {
      store.updateCartItemQty(btn.dataset.itemId, 1);
    });
  });

  // 3. Delete item
  container.querySelectorAll('.item-delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      store.removeCartItem(btn.dataset.itemId);
    });
  });

  // 4. Hold / Cancel Order
  const holdBtn = container.querySelector('#cart-hold-btn');
  if (holdBtn) {
    holdBtn.addEventListener('click', () => {
      if (confirm('Cancel this entire check and free the table? This cannot be undone.')) {
        store.clearActiveOrder();
      }
    });
  }

  // 5. Send to Kitchen (KDS)
  const kitchenBtn = container.querySelector('#cart-kitchen-btn');
  if (kitchenBtn) {
    kitchenBtn.addEventListener('click', () => {
      if (activeOrder.status === 'sent') {
        alert('Order has already been sent to the kitchen. Any new items must be added to a new card.');
        return;
      }
      const ticket = store.sendToKitchen();
      if (ticket) {
        alert(`Order sent to kitchen! Ticket: ${ticket.id}`);
      }
    });
  }

  // 6. Pay Check / Checkout
  const payBtn = container.querySelector('#cart-pay-btn');
  if (payBtn) {
    payBtn.addEventListener('click', () => {
      openCheckoutModal(activeOrder);
    });
  }
}
