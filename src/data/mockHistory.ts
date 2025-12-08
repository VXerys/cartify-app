import { HistoryItemType } from '@/src/components/history/HistoryCard';

export const MOCK_HISTORY: HistoryItemType[] = [
  {
    id: '1',
    date: new Date().toISOString(), // Today
    totalPrice: 156000,
    totalItems: 4,
    items: [
        { name: 'Fresh Milk', qty: 2, price: 56000, category: 'Drink' },
        { name: 'Whole Wheat Bread', qty: 1, price: 25000, category: 'Food' },
        { name: 'Bananas', qty: 6, price: 30000, category: 'Fruit' },
        { name: 'Apples', qty: 3, price: 45000, category: 'Fruit' }
    ]
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    totalPrice: 425000,
    totalItems: 3,
     items: [
        { name: 'Chicken Breast', qty: 2, price: 120000, category: 'Food' },
        { name: 'Rice 5kg', qty: 1, price: 85000, category: 'Food' },
        { name: 'Cooking Oil', qty: 1, price: 220000, category: 'Household' }
    ]
  },
   {
    id: '3',
    date: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    totalPrice: 75000,
    totalItems: 2,
     items: [
        { name: 'Coffee Beans', qty: 1, price: 60000, category: 'Drink' },
        { name: 'Sugar', qty: 1, price: 15000, category: 'Household' }
    ]
  },
  {
    id: '4',
    date: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
    totalPrice: 1200000,
    totalItems: 15,
     items: [
        { name: 'Weekly Groceries', qty: 1, price: 500000, category: 'Food' },
        { name: 'Detergent', qty: 1, price: 50000, category: 'Household' },
        { name: 'Snacks', qty: 5, price: 150000, category: 'Snacks' },
        { name: 'Vegetables', qty: 4, price: 200000, category: 'Food' },
        { name: 'Fruits', qty: 3, price: 300000, category: 'Fruit' }
    ]
  },
];
