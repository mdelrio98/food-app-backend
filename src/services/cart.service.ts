// DUMMY IMPLEMENTATION for testing without a database.

const DUMMY_MEALS = [
  { id: 'm1', name: 'Sushi', description: 'Finest fish and veggies', price: 22.99 },
  { id: 'm2', name: 'Schnitzel', description: 'A german specialty!', price: 16.50 },
  { id: 'm3', name: 'Barbecue Burger', description: 'American, raw, meaty', price: 12.99 },
  { id: 'm4', name: 'Green Bowl', description: 'Healthy...and green...', price: 18.99 },
];

// In-memory cart for dummy implementation
let dummyCart: any = {
  user: 'MOCK_USER_ID', // Mock user ID
  items: [],
  totalAmount: 0,
};

const recalculateTotal = () => {
  dummyCart.totalAmount = dummyCart.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
};

export const getOrCreateCart = async (userId: string): Promise<any> => {
  console.log('DUMMY_SERVICE: Returning in-memory cart.');
  return dummyCart;
};

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
): Promise<any> => {
  console.log(`DUMMY_SERVICE: Adding item ${productId} to cart.`);
  const product = DUMMY_MEALS.find((p) => p.id === productId);
  if (!product) {
    throw new Error('Product not found in dummy data');
  }

  const existingItem = dummyCart.items.find((item: any) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    dummyCart.items.push({ ...product, quantity });
  }

  recalculateTotal();
  return dummyCart;
};

export const removeItemFromCart = async (
  userId: string,
  productId: string
): Promise<any> => {
  console.log(`DUMMY_SERVICE: Removing item ${productId} from cart.`);
  const existingItemIndex = dummyCart.items.findIndex((item: any) => item.id === productId);

  if (existingItemIndex === -1) {
    throw new Error('Item not found in dummy cart');
  }

  const item = dummyCart.items[existingItemIndex];
  if (item.quantity > 1) {
    item.quantity -= 1;
  } else {
    dummyCart.items.splice(existingItemIndex, 1);
  }

  recalculateTotal();
  return dummyCart;
};

export const clearCart = async (userId: string): Promise<any> => {
  console.log('DUMMY_SERVICE: Clearing cart.');
  dummyCart.items = [];
  dummyCart.totalAmount = 0;
  return dummyCart;
};
