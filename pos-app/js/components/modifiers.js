import { MODIFIERS } from '../data.js';
import { store } from '../store.js';

let currentItem = null;
let selections = {}; // { [groupId]: [selectedOptions] }
let customNotes = '';

export function openModifiersModal(item) {
  currentItem = item;
  customNotes = '';
  
  // Initialize default selections
  selections = {};
  item.modifiers.forEach(modId => {
    const modGroup = MODIFIERS[modId];
    if (modGroup) {
      selections[modId] = [];
      // Auto-select first option if required and single-select
      if (modGroup.required && modGroup.maxSelected === 1) {
        selections[modId] = [modGroup.options[0]];
      }
    }
  });

  const modal = document.getElementById('modifiers-modal');
  const title = document.getElementById('mod-modal-title');
  const body = document.getElementById('mod-modal-body');
  
  title.innerText = `Customize ${item.name}`;
  
  // Generate HTML for modifier groups
  body.innerHTML = `
    <div style="font-size: 14px; color: var(--text-muted); margin-bottom: 20px;">
      ${item.description}
    </div>
    
    ${item.modifiers.map(modId => {
      const group = MODIFIERS[modId];
      if (!group) return '';
      
      return `
        <div class="modifier-group" data-group-id="${group.id}">
          <div class="modifier-group-title">
            <span>${group.name}</span>
            <span>
              ${group.required ? '<span class="required">Required</span>' : '<span style="font-size: 11px;">Optional</span>'}
              <span style="font-size: 11px; margin-left: 4px;">
                (${group.maxSelected === 1 ? 'Choose 1' : `Max ${group.maxSelected}`})
              </span>
            </span>
          </div>
          <div class="modifier-options">
            ${group.options.map(opt => {
              const isSelected = selections[group.id].some(s => s.name === opt.name);
              return `
                <div class="modifier-card ${isSelected ? 'active' : ''}" data-option-name="${opt.name}" data-option-price="${opt.price}">
                  <span class="modifier-card-name">${opt.name}</span>
                  <span class="modifier-card-price">${opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Free'}</span>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('')}

    <!-- Special Instructions Notes Field -->
    <div style="margin-top: 24px;">
      <label style="display: block; font-size: 12px; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px;">
        Special Instructions / Notes
      </label>
      <textarea id="mod-notes-input" placeholder="e.g. Allergy warning, extra sauce, dressing on the side..." 
        style="width: 100%; background: var(--bg-input); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 12px; color: var(--text-main); font-family: inherit; font-size: 14px; resize: vertical; min-height: 80px;"></textarea>
    </div>
  `;

  // Attach Event Listeners inside modal
  item.modifiers.forEach(modId => {
    const groupElement = body.querySelector(`.modifier-group[data-group-id="${modId}"]`);
    if (!groupElement) return;

    const group = MODIFIERS[modId];
    
    groupElement.querySelectorAll('.modifier-card').forEach(card => {
      card.addEventListener('click', () => {
        const optionName = card.dataset.optionName;
        const optionPrice = parseFloat(card.dataset.optionPrice);
        const option = { name: optionName, price: optionPrice };
        
        const currentSelections = selections[modId];
        const isAlreadySelected = currentSelections.some(s => s.name === optionName);

        if (group.maxSelected === 1) {
          // Single select (radio behaviour)
          selections[modId] = [option];
          groupElement.querySelectorAll('.modifier-card').forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        } else {
          // Multi select (checkbox behaviour)
          if (isAlreadySelected) {
            selections[modId] = currentSelections.filter(s => s.name !== optionName);
            card.classList.remove('active');
          } else {
            if (currentSelections.length < group.maxSelected) {
              selections[modId].push(option);
              card.classList.add('active');
            } else {
              alert(`Maximum ${group.maxSelected} selections allowed for ${group.name}.`);
            }
          }
        }
        validateForm();
      });
    });
  });

  // Track notes text change
  body.querySelector('#mod-notes-input').addEventListener('input', (e) => {
    customNotes = e.target.value;
  });

  // Open the modal Overlay
  modal.classList.add('open');
  validateForm();
}

function closeModifiersModal() {
  const modal = document.getElementById('modifiers-modal');
  modal.classList.remove('open');
  currentItem = null;
  selections = {};
}

function validateForm() {
  const addBtn = document.getElementById('mod-add-btn');
  let isValid = true;

  if (!currentItem) return;

  // Check all required groups have at least minSelected
  currentItem.modifiers.forEach(modId => {
    const group = MODIFIERS[modId];
    if (group && group.required) {
      const count = (selections[modId] || []).length;
      if (count < group.minSelected) {
        isValid = false;
      }
    }
  });

  addBtn.disabled = !isValid;
}

// Wire up actions once during load
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('modifiers-modal');
  const closeBtn = document.getElementById('mod-modal-close');
  const cancelBtn = document.getElementById('mod-cancel-btn');
  const addBtn = document.getElementById('mod-add-btn');

  const closeActions = [closeBtn, cancelBtn];
  closeActions.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', closeModifiersModal);
    }
  });

  if (addBtn) {
    addBtn.addEventListener('click', () => {
      if (!currentItem) return;
      
      // Flatten all selected options
      const allSelectedOptions = [];
      Object.keys(selections).forEach(groupId => {
        allSelectedOptions.push(...selections[groupId]);
      });

      // Add to store cart
      store.addToCart(currentItem, 1, allSelectedOptions, customNotes);
      
      closeModifiersModal();
    });
  }

  // Close on backdrop click
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModifiersModal();
      }
    });
  }
});
