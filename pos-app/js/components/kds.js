import { store } from '../store.js';

let timerInterval = null;

export function renderKdsView(container, state) {
  const { kdsTickets } = state;

  // Clear existing timer if any
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (kdsTickets.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; color: var(--text-muted); padding: 80px 24px; flex: 1;">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="width: 64px; height: 64px; opacity: 0.2; margin-bottom: 16px;">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
        <h3>Kitchen is clear</h3>
        <p>No active orders in preparation queue right now.</p>
      </div>
    `;
    return;
  }

  // Draw KDS grid
  container.innerHTML = `
    <div class="kds-grid">
      ${kdsTickets.map(t => {
        const elapsedMin = Math.floor((Date.now() - t.timestamp) / 60000);
        let rushClass = '';
        let timerColor = 'var(--text-muted)';
        
        if (elapsedMin >= 15) {
          rushClass = 'rush';
          timerColor = 'var(--danger)';
        } else if (elapsedMin >= 10) {
          timerColor = 'var(--warning)';
        }

        // Determine destination label (Table 2 vs Takeout)
        const label = t.tableId ? `Table ${t.tableId.slice(-2)}` : 'Takeout';

        return `
          <div class="kds-ticket ${rushClass}" data-ticket-id="${t.id}">
            <div class="kds-ticket-header">
              <div>
                <span style="font-size: 15px;">#${t.id.slice(-4)}</span>
                <span style="margin-left: 8px; opacity: 0.7;">${label}</span>
              </div>
              <div class="kds-ticket-time" style="color: ${timerColor};" data-timestamp="${t.timestamp}">
                ${elapsedMin}m ago
              </div>
            </div>
            
            <div class="kds-ticket-body">
              ${t.items.map(item => `
                <div class="kds-ticket-item">
                  <div class="kds-item-main">
                    <div>
                      <span class="kds-item-qty">${item.qty}x</span>
                      <span>${item.name}</span>
                    </div>
                  </div>
                  ${item.modifiers.length > 0 ? `
                    <div class="kds-item-mods">
                      ${item.modifiers.map(m => `+ ${m}`).join('<br>')}
                    </div>
                  ` : ''}
                  ${item.notes ? `
                    <div class="kds-item-mods" style="color: var(--warning); font-weight: 600;">
                      * NOTE: "${item.notes}"
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
            
            <div class="kds-ticket-footer">
              <button class="btn btn-primary btn-complete-ticket" data-ticket-id="${t.id}">
                Complete & Serve
              </button>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Attach button event listeners
  container.querySelectorAll('.btn-complete-ticket').forEach(btn => {
    btn.addEventListener('click', () => {
      const ticketId = btn.dataset.ticketId;
      store.completeKdsTicket(ticketId);
    });
  });

  // Start tick interval to update order timestamps reactively without complete redraws
  timerInterval = setInterval(() => {
    container.querySelectorAll('.kds-ticket-time').forEach(el => {
      const timestamp = parseInt(el.dataset.timestamp);
      const elapsedMin = Math.floor((Date.now() - timestamp) / 60000);
      el.innerText = `${elapsedMin}m ago`;
      
      // Update timer colors and borders on tickets
      const ticket = el.closest('.kds-ticket');
      if (elapsedMin >= 15) {
        el.style.color = 'var(--danger)';
        ticket.classList.add('rush');
      } else if (elapsedMin >= 10) {
        el.style.color = 'var(--warning)';
      }
    });
  }, 15000);
}
