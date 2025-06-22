import Cart from '../models/Cart';
import Meal from '../models/Meal';
import { Types } from 'mongoose';
import { ICart } from '../types/cart.types'; // Assuming you have this type
import { ApiError } from '../utils/ApiError';

/**
 * Initializes a user's cart. It retrieves an existing cart or creates a new one if it doesn't exist.
 * Populates product details for items in the cart.
 * @param userId - The ID of the user.
 * @returns The user's cart.
 */
export const initializeCart = async (userId: string): Promise<ICart | null> => {
  let cart = await Cart.findOne({ user: new Types.ObjectId(userId) }).populate(
    'items.meal',
    'name price description imageUrl' // Select fields to populate
  );

  if (!cart) {
    cart = await Cart.create({ user: new Types.ObjectId(userId), items: [], totalAmount: 0 });
    // No need to populate here as items array is empty
  }
  return cart;
};

/**
 * Adds an item to the user's cart or updates its quantity if it already exists.
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to add.
 * @param quantity - The quantity of the product to add.
 * @returns The updated user's cart.
 */
export const addItemToCart = async (
  userId: string,
  mealId: string,
  quantity: number
): Promise<ICart | null> => {
  const product = await Meal.findById(mealId);
  if (!product) {
    throw new ApiError('Product not found', 404);
  }

  let cart = await Cart.findOne({ user: new Types.ObjectId(userId) });

  if (!cart) {
    cart = new Cart({ user: new Types.ObjectId(userId), items: [], totalAmount: 0 });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.meal.toString() === mealId
  );

  if (itemIndex > -1) {
    // Item already exists in cart, update quantity
    cart.items[itemIndex].quantity += quantity;
  } else {
    // Item does not exist in cart, add new item
    cart.items.push({
      meal: new Types.ObjectId(mealId),
      quantity,
      price: product.price, // Store price at the time of adding
    });
  }

  await cart.save(); // Mongoose pre-save hook will calculate totalAmount
  return Cart.findById(cart._id).populate(
    'items.meal',
    'name price description imageUrl'
  );
};

/**
 * Removes one unit of an item from the cart, or the entire item if quantity becomes 0.
 * @param userId - The ID of the user.
 * @param productId - The ID of the product to remove.
 * @returns The updated user's cart.
 */
export const removeItemFromCart = async (
  userId: string,
  mealId: string
): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: new Types.ObjectId(userId) });

  if (!cart) {
    // This case should ideally not be hit if initializeCart is always called first,
    // but as a safeguard, we throw a 404.
    throw new ApiError('Cart not found', 404);
  }

    const itemIndex = cart.items.findIndex(
    (item) => item.meal.toString() === mealId
  );

  // Guard clause: If the item is not in the cart, throw a 404 error.
  if (itemIndex === -1) {
    throw new ApiError('Item not found in cart', 404);
  }

  // If the item exists, decrease its quantity or remove it from the cart.
  if (cart.items[itemIndex].quantity > 1) {
    cart.items[itemIndex].quantity -= 1;
  } else {
    cart.items.splice(itemIndex, 1);
  }

  await cart.save();

  // Return the updated cart with populated items.
  return Cart.findById(cart._id).populate(
    'items.meal',
    'name price description imageUrl'
  );
};

/**
 * Clears all items from the user's cart.
 * @param userId - The ID of the user.
 * @returns The emptied user's cart.
 */
export const clearCart = async (userId: string): Promise<ICart | null> => {
  const cart = await Cart.findOne({ user: new Types.ObjectId(userId) });

  if (!cart) {
    // If no cart, create an empty one or handle as an error
    // For this implementation, let's assume a cart should exist or be creatable
    return initializeCart(userId); // Or simply return null if cart must exist
  }

  cart.items = [];
  // cart.totalAmount will be updated by the pre-save hook
  await cart.save();
  return Cart.findById(cart._id).populate(
    'items.meal',
    'name price description imageUrl'
  ); // Return the cart, now empty but with populated product schema info
};

