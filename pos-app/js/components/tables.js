import { ZONES } from '../data.js';
import { store } from '../store.js';

export function renderTablesView(container, state) {
  const { tables, activeZoneId } = state;
  
  // Filter tables by active zone
  const zoneTables = tables.filter(t => t.zone === activeZoneId);

  // Generate Floor Plan HTML
  container.innerHTML = `
    <!-- Floor tabs -->
    <div class="floor-tabs">
      ${ZONES.map(z => `
        <div class="floor-tab ${z.id === activeZoneId ? 'active' : ''}" data-zone="${z.id}">
          ${z.name}
        </div>
      `).join('')}
    </div>

    <!-- Layout Canvas -->
    <div class="grid-layout">
      <div class="grid-canvas">
        ${zoneTables.map(t => {
          let statusText = t.status;
          let extraClass = '';
          
          if (t.status === 'occupied') {
            statusText = 'Occupied';
            extraClass = 'occupied';
          } else if (t.status === 'dirty') {
            statusText = 'Needs Clean';
            extraClass = 'dirty pulse';
          } else if (t.status === 'ready') {
            statusText = 'Vacant';
            extraClass = 'ready';
          }

          return `
            <div class="table-element ${extraClass}" data-table-id="${t.id}">
              <span class="table-status">${statusText}</span>
              <div class="table-number">${t.number}</div>
              <div class="table-seats">${t.seats} Seats</div>
              ${t.amount ? `<div class="table-amount">$${t.amount.toFixed(2)}</div>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    </div>

    <!-- Floor Legend Indicators -->
    <div class="floor-legend">
      <div class="legend-item">
        <span class="legend-dot vacant"></span>
        <span>Vacant</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot occupied"></span>
        <span>Occupied</span>
      </div>
      <div class="legend-item">
        <span class="legend-dot dirty"></span>
        <span>Dirty</span>
      </div>
    </div>
  `;

  // Attach Event Listeners
  // 1. Zone switches
  container.querySelectorAll('.floor-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const zoneId = tab.dataset.zone;
      store.selectZone(zoneId);
    });
  });

  // 2. Table selection
  container.querySelectorAll('.table-element').forEach(el => {
    el.addEventListener('click', () => {
      const tableId = el.dataset.tableId;
      const table = tables.find(t => t.id === tableId);
      
      // If table is dirty, prompt cashier to clean it
      if (table.status === 'dirty') {
        if (confirm(`Table ${table.number} is marked as Dirty. Clean and set to Vacant?`)) {
          store.updateTableStatus(tableId, 'ready');
        }
      } else {
        // Normal select (occupied or ready)
        store.selectTable(tableId);
      }
    });
  });
}
