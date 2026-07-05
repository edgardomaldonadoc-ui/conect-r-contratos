import { store } from '../store.js';

let activeOrder = null;
let paymentMethod = 'credit';
let tipPercent = 18;
let customTipAmount = 0;
let isSigned = false;

// Drawing canvas variables
let canvas = null;
let ctx = null;
let drawing = false;

export function openCheckoutModal(order) {
  activeOrder = order;
  paymentMethod = 'credit';
  tipPercent = 18;
  customTipAmount = 0;
  isSigned = false;

  const modal = document.getElementById('checkout-modal');
  const body = document.getElementById('checkout-modal-body');
  
  renderCheckoutBody(body);
  
  // Initialize canvas signature after DOM mounts
  initSignatureCanvas();

  modal.classList.add('open');
  validateCheckout();
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.remove('open');
  activeOrder = null;
  canvas = null;
  ctx = null;
}

function renderCheckoutBody(container) {
  const subtotal = activeOrder.subtotal;
  const tax = activeOrder.tax;
  const baseTotal = activeOrder.total;
  
  let tipAmount = 0;
  if (tipPercent === 'custom') {
    tipAmount = customTipAmount;
  } else {
    tipAmount = Math.round(subtotal * (tipPercent / 100) * 100) / 100;
  }
  
  const finalTotal = Math.round((baseTotal + tipAmount) * 100) / 100;

  container.innerHTML = `
    <div class="checkout-grid">
      <!-- Left side: Payment Methods -->
      <div class="payment-methods">
        <label style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 4px; display: block;">
          Select Payment Method
        </label>
        
        <div class="payment-method-btn ${paymentMethod === 'credit' ? 'active' : ''}" data-method="credit">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-19.5 5.25h19.5m-19.5 0h19.5M4.5 18h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>
          <div>
            <div style="font-size: 14px; font-weight: 600;">Credit/Debit Card</div>
            <div style="font-size: 11px; color: var(--text-muted);">Swipe or Insert Card</div>
          </div>
        </div>

        <div class="payment-method-btn ${paymentMethod === 'cash' ? 'active' : ''}" data-method="cash">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818.736-1.574A1.898 1.898 0 0 0 10.68 15h3a1.5 1.5 0 1 1 0 3h-3m-2.25-3H13.5m-3-6h3m-3-3H13.5m-3 6H13.5M3.75 12h16.5m-16.5 0a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
          </svg>
          <div>
            <div style="font-size: 14px; font-weight: 600;">Cash Payment</div>
            <div style="font-size: 11px; color: var(--text-muted);">Drawer opens automatically</div>
          </div>
        </div>

        <div class="payment-method-btn ${paymentMethod === 'gift' ? 'active' : ''}" data-method="gift">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h17.25c.621 0 1.125-.504 1.125-1.125V8.625c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <div>
            <div style="font-size: 14px; font-weight: 600;">Gift Card / Voucher</div>
            <div style="font-size: 11px; color: var(--text-muted);">Scan coupon or enter code</div>
          </div>
        </div>

        <!-- Tip Selector -->
        <div style="margin-top: 16px;">
          <label style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; display: block;">
            Select Gratuity / Tip
          </label>
          <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
            <button class="btn ${tipPercent === 15 ? 'btn-primary' : 'btn-secondary'}" data-tip="15" style="padding: 10px 0;">15%</button>
            <button class="btn ${tipPercent === 18 ? 'btn-primary' : 'btn-secondary'}" data-tip="18" style="padding: 10px 0;">18%</button>
            <button class="btn ${tipPercent === 20 ? 'btn-primary' : 'btn-secondary'}" data-tip="20" style="padding: 10px 0;">20%</button>
            <button class="btn ${tipPercent === 'custom' ? 'btn-primary' : 'btn-secondary'}" data-tip="custom" style="padding: 10px 0;">Custom</button>
          </div>
          
          ${tipPercent === 'custom' ? `
            <div style="margin-top: 8px; display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 14px; font-weight: 600;">$</span>
              <input type="number" id="custom-tip-input" value="${customTipAmount}" min="0" step="0.5" 
                style="flex: 1; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-sm); padding: 8px; color: var(--text-main); font-size: 14px;">
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Right side: Signature Pad & Totals -->
      <div class="payment-details">
        <div class="checkout-summary">
          <div class="summary-row">
            <span>Bill Subtotal</span>
            <span>$${subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tax (8.25%)</span>
            <span>$${tax.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Tip Amount</span>
            <span>$${tipAmount.toFixed(2)}</span>
          </div>
          <div class="summary-row total" style="margin-top: 6px; padding-top: 8px;">
            <span>Amount Due</span>
            <span>$${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <!-- Signature Pad -->
        <div class="signature-pad-wrapper">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: var(--text-muted);">
              Cardholder Signature
            </label>
            <button id="clear-sig-btn" style="background: transparent; border: none; color: var(--danger); font-size: 11px; font-weight: 600; cursor: pointer;">
              Clear Signature
            </button>
          </div>
          
          <div class="signature-canvas ${isSigned ? 'signed' : ''}" id="signature-container">
            <canvas id="sig-canvas" style="width: 100%; height: 100%; display: block; border-radius: var(--radius-md);"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event listeners for payment method buttons
  container.querySelectorAll('.payment-method-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      paymentMethod = btn.dataset.method;
      renderCheckoutBody(container);
      initSignatureCanvas();
      validateCheckout();
    });
  });

  // Attach tip buttons
  container.querySelectorAll('[data-tip]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tipVal = btn.dataset.tip;
      tipPercent = tipVal === 'custom' ? 'custom' : parseInt(tipVal);
      renderCheckoutBody(container);
      initSignatureCanvas();
      validateCheckout();
    });
  });

  // Tip input listener
  const customTipInput = container.querySelector('#custom-tip-input');
  if (customTipInput) {
    customTipInput.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      customTipAmount = isNaN(val) || val < 0 ? 0 : val;
      // Re-render subtotal summary box dynamically without reloading canvas entirely
      updateCheckoutTotalsSummary();
    });
  }

  // Clear signature button
  const clearBtn = container.querySelector('#clear-sig-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        isSigned = false;
        document.getElementById('signature-container').classList.remove('signed');
        validateCheckout();
      }
    });
  }
}

// Draw changes in checkout boxes dynamically
function updateCheckoutTotalsSummary() {
  const subtotal = activeOrder.subtotal;
  const tax = activeOrder.tax;
  const baseTotal = activeOrder.total;
  
  let tipAmount = 0;
  if (tipPercent === 'custom') {
    tipAmount = customTipAmount;
  } else {
    tipAmount = Math.round(subtotal * (tipPercent / 100) * 100) / 100;
  }
  
  const finalTotal = Math.round((baseTotal + tipAmount) * 100) / 100;

  // Update DOM values
  const summaryBox = document.querySelector('.checkout-summary');
  if (summaryBox) {
    summaryBox.innerHTML = `
      <div class="summary-row">
        <span>Bill Subtotal</span>
        <span>$${subtotal.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (8.25%)</span>
        <span>$${tax.toFixed(2)}</span>
      </div>
      <div class="summary-row">
        <span>Tip Amount</span>
        <span>$${tipAmount.toFixed(2)}</span>
      </div>
      <div class="summary-row total" style="margin-top: 6px; padding-top: 8px;">
        <span>Amount Due</span>
        <span>$${finalTotal.toFixed(2)}</span>
      </div>
    `;
  }
}

function initSignatureCanvas() {
  canvas = document.getElementById('sig-canvas');
  if (!canvas) return;

  ctx = canvas.getContext('2d');
  
  // Set physical drawing scale to match CSS sizing bounds
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;

  ctx.strokeStyle = '#FFFFFF';
  if (document.documentElement.getAttribute('data-theme') === 'light') {
    ctx.strokeStyle = '#1e293b';
  }
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const getPos = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const canvasRect = canvas.getBoundingClientRect();
    return {
      x: clientX - canvasRect.left,
      y: clientY - canvasRect.top
    };
  };

  const startDraw = (e) => {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    
    if (!isSigned) {
      isSigned = true;
      document.getElementById('signature-container').classList.add('signed');
      validateCheckout();
    }
  };

  const draw = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    drawing = false;
  };

  // Mouse events
  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseleave', endDraw);

  // Touch events
  canvas.addEventListener('touchstart', startDraw, { passive: false });
  canvas.addEventListener('touchmove', draw, { passive: false });
  canvas.addEventListener('touchend', endDraw);
}

function validateCheckout() {
  const payCompleteBtn = document.getElementById('checkout-complete-btn');
  if (!payCompleteBtn) return;

  // Let's require signature for Card payments, allow instant checkout for cash/gift voucher
  if (paymentMethod === 'credit' && !isSigned) {
    payCompleteBtn.disabled = true;
  } else {
    payCompleteBtn.disabled = false;
  }
}

// Beautiful Receipt print out layout
function printReceipt(order, finalTip, finalTotal) {
  const dateStr = new Date().toLocaleString();
  let itemsRows = order.items.map(item => {
    const itemTotal = (item.price * item.qty).toFixed(2);
    let line = `${item.qty}x ${item.name.padEnd(20).slice(0, 20)} $${itemTotal.padStart(7)}`;
    
    if (item.modifiers.length > 0) {
      item.modifiers.forEach(m => {
        line += `\n   + ${m.name.padEnd(18).slice(0, 18)}`;
      });
    }
    if (item.notes) {
      line += `\n   * Note: ${item.notes.slice(0, 20)}`;
    }
    return line;
  }).join('\n');

  const receiptHTML = `
    <div style="font-family: 'Courier New', Courier, monospace; background: #fff; color: #000; padding: 24px; border: 1px dashed #ccc; border-radius: var(--radius-sm); max-width: 380px; margin: 0 auto; box-shadow: var(--shadow-md);">
      <div style="text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 16px;">
        <h2 style="margin: 0; font-family: inherit; font-size: 22px;">AEROPOS BISTRO</h2>
        <div style="font-size: 12px; margin-top: 4px;">100 Broadway, New York, NY</div>
        <div style="font-size: 12px;">Tel: (212) 555-0199</div>
      </div>
      
      <div style="font-size: 13px; margin-bottom: 12px;">
        <div><strong>Ticket ID:</strong> ${order.id}</div>
        <div><strong>Date:</strong> ${dateStr}</div>
        <div><strong>Service Type:</strong> ${order.type.toUpperCase()}</div>
        ${order.tableId ? `<div><strong>Table Number:</strong> ${order.tableId}</div>` : ''}
      </div>

      <div style="border-bottom: 1px dashed #000; padding-bottom: 8px; margin-bottom: 8px; font-size: 13px; white-space: pre-wrap;">
${itemsRows}
      </div>

      <div style="font-size: 13px; text-align: right; margin-bottom: 16px; line-height: 1.5;">
        <div>Subtotal: $${order.subtotal.toFixed(2)}</div>
        <div>Tax (8.25%): $${order.tax.toFixed(2)}</div>
        <div>Gratuity/Tip: $${finalTip.toFixed(2)}</div>
        <div style="font-size: 16px; font-weight: bold; border-top: 1px dashed #000; padding-top: 4px; margin-top: 4px;">
          TOTAL PAID: $${finalTotal.toFixed(2)}
        </div>
      </div>

      <div style="text-align: center; border-top: 2px dashed #000; padding-top: 16px; font-size: 12px;">
        <div>Thank you for dining with us!</div>
        <div style="margin-top: 4px;">Receipt copies sent to kitchen</div>
        <div style="margin-top: 12px; font-size: 10px; opacity: 0.5;">Powered by AeroPOS system</div>
      </div>
    </div>
  `;

  // Display receipt modal or print
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>Receipt - Ticket ${order.id}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f1f5f9;
          }
        </style>
      </head>
      <body>
        ${receiptHTML}
        <script>
          window.onload = function() {
            window.print();
            // Optional: window.close();
          }
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Register DOM Actions once
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('checkout-modal');
  const closeBtn = document.getElementById('checkout-modal-close');
  const cancelBtn = document.getElementById('checkout-cancel-btn');
  const completeBtn = document.getElementById('checkout-complete-btn');

  const closeActions = [closeBtn, cancelBtn];
  closeActions.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', closeCheckoutModal);
    }
  });

  if (completeBtn) {
    completeBtn.addEventListener('click', () => {
      if (!activeOrder) return;
      
      const subtotal = activeOrder.subtotal;
      const baseTotal = activeOrder.total;
      
      let tipAmount = 0;
      if (tipPercent === 'custom') {
        tipAmount = customTipAmount;
      } else {
        tipAmount = Math.round(subtotal * (tipPercent / 100) * 100) / 100;
      }
      
      const finalTotal = Math.round((baseTotal + tipAmount) * 100) / 100;

      // Print Receipt
      printReceipt(activeOrder, tipAmount, finalTotal);

      // Execute storage transaction
      store.payOrder(paymentMethod);
      
      closeCheckoutModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeCheckoutModal();
      }
    });
  }
});
