export const CATEGORIES = [
  { id: 'mains', name: 'Mains', icon: '🍽️' },
  { id: 'sides', name: 'Appetizers', icon: '🍟' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' }
];

export const MODIFIERS = {
  temp: {
    id: 'temp',
    name: 'Cooking Temp',
    required: true,
    minSelected: 1,
    maxSelected: 1,
    options: [
      { name: 'Rare', price: 0 },
      { name: 'Medium Rare', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Medium Well', price: 0 },
      { name: 'Well Done', price: 0 }
    ]
  },
  cheese: {
    id: 'cheese',
    name: 'Add Cheese',
    required: false,
    minSelected: 0,
    maxSelected: 3,
    options: [
      { name: 'Cheddar', price: 1.00 },
      { name: 'Swiss', price: 1.25 },
      { name: 'Blue Cheese', price: 1.50 }
    ]
  },
  addons: {
    id: 'addons',
    name: 'Add-ons',
    required: false,
    minSelected: 0,
    maxSelected: 5,
    options: [
      { name: 'Avocado', price: 2.00 },
      { name: 'Bacon', price: 1.75 },
      { name: 'Fried Egg', price: 1.50 },
      { name: 'Caramelized Onions', price: 0.75 }
    ]
  },
  milk: {
    id: 'milk',
    name: 'Milk Choice',
    required: true,
    minSelected: 1,
    maxSelected: 1,
    options: [
      { name: 'Whole Milk', price: 0 },
      { name: 'Oat Milk', price: 0.75 },
      { name: 'Almond Milk', price: 0.75 },
      { name: 'Soy Milk', price: 0.50 }
    ]
  },
  sweetness: {
    id: 'sweetness',
    name: 'Sweetness Level',
    required: true,
    minSelected: 1,
    maxSelected: 1,
    options: [
      { name: 'Regular Sweet', price: 0 },
      { name: 'Less Sweet (75%)', price: 0 },
      { name: 'Half Sweet (50%)', price: 0 },
      { name: 'Unsweetened', price: 0 }
    ]
  }
};

export const MENU_ITEMS = [
  // Mains
  {
    id: 'm1',
    name: 'Truffle Smash Burger',
    category: 'mains',
    price: 16.50,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60',
    description: 'Double beef patty, truffle aioli, caramelized onions, brioche bun.',
    modifiers: ['temp', 'cheese', 'addons']
  },
  {
    id: 'm2',
    name: 'Crispy Hot Chicken Sandwich',
    category: 'mains',
    price: 14.75,
    image: 'https://images.unsplash.com/photo-1627662236973-4f825912447a?w=500&auto=format&fit=crop&q=60',
    description: 'Buttermilk fried chicken, spicy glaze, slaw, pickles, brioche bun.',
    modifiers: ['cheese', 'addons']
  },
  {
    id: 'm3',
    name: 'Wood-fired Pepperoni Pizza',
    category: 'mains',
    price: 18.00,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=60',
    description: 'Artisan pepperoni, fresh mozzarella, tomato sauce, hot honey drizzle.',
    modifiers: ['addons']
  },
  {
    id: 'm4',
    name: 'Quinoa Buddha Bowl',
    category: 'mains',
    price: 13.50,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60',
    description: 'Roasted sweet potato, avocado, kale, chickpeas, tahini dressing.',
    modifiers: ['addons']
  },

  // Sides / Appetizers
  {
    id: 's1',
    name: 'Parmesan Truffle Fries',
    category: 'sides',
    price: 8.50,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60',
    description: 'Crispy cut fries, white truffle oil, grated parmesan, fresh parsley.',
    modifiers: []
  },
  {
    id: 's2',
    name: 'Sweet Chili Cauliflower Wings',
    category: 'sides',
    price: 9.75,
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=500&auto=format&fit=crop&q=60',
    description: 'Tempura battered cauliflower, sweet chili sesame glaze.',
    modifiers: []
  },
  {
    id: 's3',
    name: 'Smoked Gouda Mac & Cheese',
    category: 'sides',
    price: 10.50,
    image: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?w=500&auto=format&fit=crop&q=60',
    description: 'Macaroni baked with smoked gouda, cheddar, and toasted breadcrumbs.',
    modifiers: ['addons']
  },

  // Drinks
  {
    id: 'd1',
    name: 'Cold Brew Coffee',
    category: 'drinks',
    price: 5.25,
    image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60',
    description: '24-hour slow steeped craft single origin coffee.',
    modifiers: ['milk', 'sweetness']
  },
  {
    id: 'd2',
    name: 'Artisan Matcha Latte',
    category: 'drinks',
    price: 6.00,
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60',
    description: 'Ceremonial grade matcha whisked with choice of milk.',
    modifiers: ['milk', 'sweetness']
  },
  {
    id: 'd3',
    name: 'Sparkling Hibiscus Lemonade',
    category: 'drinks',
    price: 4.75,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500&auto=format&fit=crop&q=60',
    description: 'Fresh squeezed lemonade layered with organic hibiscus herbal tea.',
    modifiers: ['sweetness']
  },

  // Desserts
  {
    id: 'de1',
    name: 'Molten Chocolate Lava Cake',
    category: 'desserts',
    price: 9.50,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60',
    description: 'Warm chocolate cake with liquid fudge center, vanilla bean ice cream.',
    modifiers: []
  },
  {
    id: 'de2',
    name: 'Classic New York Cheesecake',
    category: 'desserts',
    price: 8.75,
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=60',
    description: 'Creamy cheesecake on graham cracker crust, fresh strawberry compote.',
    modifiers: []
  }
];

export const TABLES = [
  { id: 'T1', number: '1', seats: 2, status: 'ready', zone: 'main' },
  { id: 'T2', number: '2', seats: 4, status: 'occupied', zone: 'main', amount: 48.50 },
  { id: 'T3', number: '3', seats: 4, status: 'dirty', zone: 'main' },
  { id: 'T4', number: '4', seats: 6, status: 'ready', zone: 'main' },
  { id: 'T5', number: '5', seats: 2, status: 'ready', zone: 'main' },
  { id: 'T6', number: '6', seats: 8, status: 'occupied', zone: 'main', amount: 112.75 },
  
  { id: 'P1', number: 'P1', seats: 4, status: 'ready', zone: 'patio' },
  { id: 'P2', number: 'P2', seats: 4, status: 'ready', zone: 'patio' },
  { id: 'P3', number: 'P3', seats: 2, status: 'occupied', zone: 'patio', amount: 24.25 },
  { id: 'P4', number: 'P4', seats: 6, status: 'ready', zone: 'patio' },

  { id: 'B1', number: 'B1', seats: 1, status: 'ready', zone: 'bar' },
  { id: 'B2', number: 'B2', seats: 1, status: 'occupied', zone: 'bar', amount: 12.00 },
  { id: 'B3', number: 'B3', seats: 1, status: 'occupied', zone: 'bar', amount: 18.50 },
  { id: 'B4', number: 'B4', seats: 1, status: 'ready', zone: 'bar' }
];

export const ZONES = [
  { id: 'main', name: 'Dining Room' },
  { id: 'patio', name: 'Patio' },
  { id: 'bar', name: 'Bar Area' }
];
