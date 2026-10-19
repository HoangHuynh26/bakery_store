import { create } from 'zustand';

const CART_STORAGE_KEY = 'maison_cart_items';

const getInitialCart = () => {
  try {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useCartStore = create((set, get) => ({
  items: getInitialCart(),
  isDrawerOpen: false,

  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

  addItem: (product, variant = null, quantity = 1, customization = null) => {
    const currentItems = get().items;
    const unitPrice = variant
      ? Number(product.basePrice) + Number(variant.priceAdjustment || 0)
      : Number(product.promotionalPrice || product.basePrice);

    const existingIndex = currentItems.findIndex(
      (item) =>
        item.productId === product.id &&
        item.variantId === (variant?.id || null) &&
        JSON.stringify(item.customization) === JSON.stringify(customization)
    );

    let updatedItems;
    if (existingIndex > -1) {
      updatedItems = [...currentItems];
      updatedItems[existingIndex].quantity += quantity;
    } else {
      const newItem = {
        id: `${product.id}-${variant?.id || 'base'}-${Date.now()}`,
        productId: product.id,
        productName: product.nameVi || product.nameEn,
        productNameEn: product.nameEn,
        slug: product.slug,
        image: product.thumbnailUrl || product.imageUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
        variantId: variant?.id || null,
        variantName: variant?.nameVi || variant?.nameEn || null,
        unitPrice,
        quantity,
        customization,
      };
      updatedItems = [...currentItems, newItem];
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    set({ items: updatedItems, isDrawerOpen: true });
  },

  updateQuantity: (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      get().removeItem(itemId);
      return;
    }

    const updatedItems = get().items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  removeItem: (itemId) => {
    const updatedItems = get().items.filter((item) => item.id !== itemId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    set({ items: updatedItems });
  },

  clearCart: () => {
    localStorage.removeItem(CART_STORAGE_KEY);
    set({ items: [] });
  },

  getTotalItemCount: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  },
}));
