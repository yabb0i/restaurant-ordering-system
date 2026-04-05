import { MenuItem, Reservation, Order, Table, User } from '../types';

// Mock data
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce',
    price: 12.99,
    category: 'Main Course',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing',
    price: 9.99,
    category: 'Starters',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Traditional pizza with tomato sauce, mozzarella, and fresh basil',
    price: 14.99,
    category: 'Main Course',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400',
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with herbs and lemon butter sauce',
    price: 22.99,
    category: 'Main Course',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
  },
  {
    id: '5',
    name: 'Chicken Wings',
    description: 'Crispy wings with your choice of sauce: Buffalo, BBQ, or Honey Garlic',
    price: 11.99,
    category: 'Starters',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1608039829572-9b3a4e1ce3da?w=400',
  },
  {
    id: '6',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 8.99,
    category: 'Desserts',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400',
  },
  {
    id: '7',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone',
    price: 7.99,
    category: 'Desserts',
    available: true,
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98c038cde?w=400',
  },
  {
    id: '8',
    name: 'Soft Drinks',
    description: 'Coca-Cola, Sprite, or Fanta',
    price: 2.99,
    category: 'Beverages',
    available: true,
  },
  {
    id: '9',
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with fresh lemons and mint',
    price: 4.99,
    category: 'Beverages',
    available: true,
  },
  {
    id: '10',
    name: 'Mushroom Soup',
    description: 'Creamy mushroom soup with truffle oil',
    price: 6.99,
    category: 'Starters',
    available: false,
  },
];

let mockReservations: Reservation[] = [
  {
    id: '1',
    userId: 'customer1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '555-0101',
    date: '2024-12-20',
    time: '19:00',
    partySize: 4,
    tableId: '1',
    status: 'confirmed',
  },
  {
    id: '2',
    userId: 'customer2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '555-0102',
    date: '2024-12-20',
    time: '20:00',
    partySize: 2,
    status: 'pending',
  },
];

let mockOrders: Order[] = [
  {
    id: '1',
    userId: 'customer1',
    customerName: 'John Doe',
    items: [
      { menuItem: mockMenuItems[0], quantity: 2 },
      { menuItem: mockMenuItems[1], quantity: 1 },
    ],
    total: 35.97,
    status: 'preparing',
    createdAt: new Date().toISOString(),
    tableNumber: 5,
  },
  {
    id: '2',
    userId: 'customer2',
    customerName: 'Jane Smith',
    items: [
      { menuItem: mockMenuItems[2], quantity: 1 },
      { menuItem: mockMenuItems[7], quantity: 2 },
    ],
    total: 20.97,
    status: 'pending',
    createdAt: new Date().toISOString(),
    tableNumber: 3,
  },
];

const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, status: 'available' },
  { id: '2', number: 2, capacity: 2, status: 'occupied' },
  { id: '3', number: 3, capacity: 4, status: 'available' },
  { id: '4', number: 4, capacity: 4, status: 'reserved' },
  { id: '5', number: 5, capacity: 6, status: 'occupied' },
  { id: '6', number: 6, capacity: 6, status: 'available' },
  { id: '7', number: 7, capacity: 8, status: 'available' },
  { id: '8', number: 8, capacity: 8, status: 'reserved' },
];

const mockUsers: User[] = [
  { id: 'staff1', email: 'staff@restaurant.com', name: 'Staff Member', role: 'staff' },
  { id: 'manager1', email: 'manager@restaurant.com', name: 'Manager', role: 'manager' },
  { id: 'customer1', email: 'john@example.com', name: 'John Doe', role: 'customer' },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Menu API
const API_BASE = "http://localhost:3000";
export const menuApi = {
  getAll: async (): Promise<MenuItem[]> => {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error("Failed to fetch menu");

    const data = await res.json();

    return data.map((item: any) => ({
      ...item,
      id: String(item.id),
    }));
  },

  getByCategory: async (category: string): Promise<MenuItem[]> => {
    const items = await menuApi.getAll();
    return items.filter((item: MenuItem) => item.category === category);
  },

  getCategories: async (): Promise<string[]> => {
    const items = await menuApi.getAll();
    return [...new Set(items.map((item: MenuItem) => item.category))] as string[];
  },

  create: async (item: Omit<MenuItem, "id">): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE}/menu`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!res.ok) throw new Error("Failed to create item");

    const data = await res.json();
    return { ...data, id: String(data.id) };
  },

  update: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update item");

    const data = await res.json();
    return { ...data, id: String(data.id) };
  },

  delete: async (id: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/menu/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error("Failed to delete item");
  },
};
/* ==================commented out mock implementation for reference==================
  getByCategory: async (category: string): Promise<MenuItem[]> => {
    await delay(300);
    return mockMenuItems.filter(item => item.category === category);
  },

  getCategories: async (): Promise<string[]> => {
    await delay(200);
    return [...new Set(mockMenuItems.map(item => item.category))];
  },

  create: async (item: Omit<MenuItem, 'id'>): Promise<MenuItem> => {
    await delay(300);
    const newItem = { ...item, id: String(mockMenuItems.length + 1) };
    mockMenuItems.push(newItem);
    return newItem;
  },

  update: async (id: string, updates: Partial<MenuItem>): Promise<MenuItem> => {
    await delay(300);
    const index = mockMenuItems.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Item not found');
    mockMenuItems[index] = { ...mockMenuItems[index], ...updates };
    return mockMenuItems[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(300);
    const index = mockMenuItems.findIndex(item => item.id === id);
    if (index !== -1) mockMenuItems.splice(index, 1);
  },
};
*/

// Reservation API
export const reservationApi = {
  getAll: async (): Promise<Reservation[]> => {
    const res = await fetch(`${API_BASE}/reservations`);
    if (!res.ok) throw new Error("Failed to fetch reservations");

    const data = await res.json();

    return data.map((reservation: any) => ({
      ...reservation,
      id: String(reservation.id),
    }));
  },

  getById: async (id: string): Promise<Reservation | undefined> => {
    const reservations = await reservationApi.getAll();
    return reservations.find(r => r.id === id);
  },

  create: async (reservation: {
    customerName: string;
    customerPhone: string;
    partySize: number;
    reservationTime: string;
    status: string;
  }): Promise<Reservation> => {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reservation),
    });

    if (!res.ok) throw new Error("Failed to create reservation");

    const data = await res.json();
    return { ...data, id: String(data.id) };
  },

  update: async (id: string, updates: Partial<Reservation>): Promise<Reservation> => {
    const res = await fetch(`${API_BASE}/reservations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) throw new Error("Failed to update reservation");

    const data = await res.json();
    return { ...data, id: String(data.id) };
  },

  cancel: async (id: string): Promise<Reservation> => {
    return reservationApi.update(id, { status: "cancelled" });
  },

  confirm: async (id: string): Promise<Reservation> => {
    return reservationApi.update(id, { status: "confirmed" });
  },
};

// Order API
export const orderApi = {
  getAll: async (): Promise<Order[]> => {
    const res = await fetch(`${API_BASE}/orders`);
    if (!res.ok) throw new Error("Failed to fetch orders");

    const data = await res.json();

    return data.map((order: any) => ({
      id: String(order.id),
      userId: "guest",
      customerName: `Order ${order.id}`,
      items: (order.orderItems || []).map((item: any) => ({
        menuItem: {
          ...item.menuItem,
          id: String(item.menuItem.id),
        },
        quantity: item.quantity,
      })),
      total: (order.orderItems || []).reduce(
        (sum: number, item: any) => sum + item.menuItem.price * item.quantity,
        0
      ),
      status: order.status.toLowerCase(),
      createdAt: order.createdAt,
      tableNumber: order.table?.number ?? undefined,
    }));
  },

  getById: async (id: string): Promise<Order | undefined> => {
    const orders = await orderApi.getAll();
    return orders.find(o => o.id === id);
  },

  create: async (order: {
    status: string;
    orderType: string;
    tableId: number | null;
    items: { menuItemId: number; quantity: number }[];
  }): Promise<Order> => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    });

    if (!res.ok) throw new Error("Failed to create order");

    const data = await res.json();

    return {
      id: String(data.id),
      userId: "guest",
      customerName: `Order ${data.id}`,
      items: (data.orderItems || []).map((item: any) => ({
        menuItem: {
          ...item.menuItem,
          id: String(item.menuItem.id),
        },
        quantity: item.quantity,
      })),
      total: (data.orderItems || []).reduce(
        (sum: number, item: any) => sum + item.menuItem.price * item.quantity,
        0
      ),
      status: data.status.toLowerCase(),
      createdAt: data.createdAt,
      tableNumber: data.table?.number ?? undefined,
    };
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update order status");

    const data = await res.json();

    const existing = await orderApi.getById(id);

    return {
      id: String(data.id),
      userId: existing?.userId ?? "guest",
      customerName: existing?.customerName ?? `Order ${data.id}`,
      items: existing?.items ?? [],
      total: existing?.total ?? 0,
      status: data.status.toLowerCase(),
      createdAt: data.createdAt,
      tableNumber: existing?.tableNumber,
    };
  },
};

// Table API
export const tableApi = {
  getAll: async (): Promise<Table[]> => {
    await delay(300);
    return [...mockTables];
  },

  getAvailable: async (capacity: number): Promise<Table[]> => {
    await delay(300);
    return mockTables.filter(t => t.status === 'available' && t.capacity >= capacity);
  },

  updateStatus: async (id: string, status: Table['status']): Promise<Table> => {
    await delay(300);
    const index = mockTables.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Table not found');
    mockTables[index] = { ...mockTables[index], status };
    return mockTables[index];
  },

  assignToReservation: async (tableId: string, reservationId: string): Promise<void> => {
    await delay(300);
    const tableIndex = mockTables.findIndex(t => t.id === tableId);
    const resIndex = mockReservations.findIndex(r => r.id === reservationId);
    if (tableIndex === -1) throw new Error('Table not found');
    if (resIndex === -1) throw new Error('Reservation not found');
    mockTables[tableIndex].status = 'reserved';
    mockReservations[resIndex].tableId = tableId;
    mockReservations[resIndex].status = 'confirmed';
  },
};

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<User> => {
    await delay(500);
    // Mock login - in real app, would verify credentials
    const user = mockUsers.find(u => u.email === email);
    if (!user) throw new Error('Invalid credentials');
    if (password.length < 4) throw new Error('Invalid credentials');
    return user;
  },

  register: async (name: string, email: string, password: string): Promise<User> => {
    await delay(500);
    if (mockUsers.find(u => u.email === email)) {
      throw new Error('Email already exists');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    const newUser: User = {
      id: `customer${mockUsers.length + 1}`,
      email,
      name,
      role: 'customer',
    };
    mockUsers.push(newUser);
    return newUser;
  },

  getCurrentUser: async (): Promise<User | null> => {
    await delay(200);
    const userId = localStorage.getItem('userId');
    if (!userId) return null;
    return mockUsers.find(u => u.id === userId) || null;
  },
};
