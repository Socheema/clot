import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, CartState } from '@/types/cart';

// Helper function to generate unique cart item ID
const generateCartItemId = (
  productId: string | number,
  color?: string,
  size?: string
): string => {
  return `${productId}-${color || 'default'}-${size || 'default'}`;
};

// Helper to calculate effective price
const getEffectivePrice = (item: CartItem): number => {
  return item.discounted_price || item.price;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Add item to cart
      addItem: (newItem) => {
        const itemId = generateCartItemId(
          newItem.product_id,
          newItem.color,
          newItem.size
        );

        set((state) => {
          const existingItem = state.items.find((item) => item.id === itemId);

          if (existingItem) {
            // Update quantity if item already exists
            return {
              items: state.items.map((item) =>
                item.id === itemId
                  ? { ...item, quantity: item.quantity + (newItem.quantity || 1) }
                  : item
              ),
            };
          } else {
            // Add new item
            return {
              items: [
                ...state.items,
                {
                  ...newItem,
                  id: itemId,
                  quantity: newItem.quantity || 1,
                },
              ],
            };
          }
        });

        console.log('Item added to cart:', newItem);
      },

      // Remove item from cart
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }));
        console.log('Item removed from cart:', itemId);
      },

      // Update item quantity
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        }));
      },

      // Clear entire cart
      clearCart: () => {
        set({ items: [] });
        console.log('Cart cleared');
      },

      // Toggle cart drawer/modal
      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      // Get item by ID
      getItemById: (itemId) => {
        return get().items.find((item) => item.id === itemId);
      },

      // Check if item exists in cart
      hasItem: (productId, color, size) => {
        const itemId = generateCartItemId(productId, color, size);
        return get().items.some((item) => item.id === itemId);
      },

      // Computed values - NOT AS GETTERS
      totalItems: 0,
      subtotal: 0,
      total: 0,
    }),
    {
      name: 'shopping-cart',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
