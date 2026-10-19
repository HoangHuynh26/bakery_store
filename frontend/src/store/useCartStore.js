import { create } from 'zustand';
import { cartService } from '../services/cartService';

export const useCartStore = create((set, get) => ({
  cart: {
    id: null,
    items: [],
    totalItemCount: 0,
    subtotal: 0,
    estimatedDeliveryFee: 0,
    estimatedTotal: 0,
    freeDeliveryThreshold: 500000,
    amountNeededForFreeDelivery: 500000,
  },
  items: [],
  isDrawerOpen: false,
  isLoading: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const cartData = await cartService.getCart();
      set({
        cart: cartData,
        items: cartData.items || [],
        isLoading: false,
      });
      return cartData;
    } catch (err) {
      set({ isLoading: false });
      return null;
    }
  },

  addItem: async (product, variant = null, quantity = 1, customizationNotes = null) => {
    try {
      set({ isLoading: true });
      const productId = product.id || product.productId;
      const variantId = variant?.id || null;

      const updatedCart = await cartService.addItem(
        productId,
        variantId,
        quantity,
        customizationNotes
      );

      set({
        cart: updatedCart,
        items: updatedCart.items || [],
        isDrawerOpen: true,
        isLoading: false,
      });
      return updatedCart;
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  updateQuantity: async (itemId, newQuantity, customizationNotes = null) => {
    try {
      let updatedCart;
      if (newQuantity <= 0) {
        updatedCart = await cartService.removeItem(itemId);
      } else {
        updatedCart = await cartService.updateItem(itemId, newQuantity, customizationNotes);
      }

      set({
        cart: updatedCart,
        items: updatedCart.items || [],
      });
      return updatedCart;
    } catch (err) {
      throw err;
    }
  },

  removeItem: async (itemId) => {
    try {
      const updatedCart = await cartService.removeItem(itemId);
      set({
        cart: updatedCart,
        items: updatedCart.items || [],
      });
      return updatedCart;
    } catch (err) {
      throw err;
    }
  },

  clearCart: async () => {
    try {
      const emptyCart = await cartService.clearCart();
      set({
        cart: emptyCart,
        items: [],
      });
    } catch (err) {
      throw err;
    }
  },

  getTotalItemCount: () => {
    const cart = get().cart;
    if (cart && typeof cart.totalItemCount === 'number') {
      return cart.totalItemCount;
    }
    return get().items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  },

  getSubtotal: () => {
    const cart = get().cart;
    if (cart && cart.subtotal != null) {
      return Number(cart.subtotal);
    }
    return get().items.reduce((sum, item) => sum + Number(item.unitPrice || 0) * (item.quantity || 0), 0);
  },
}));
