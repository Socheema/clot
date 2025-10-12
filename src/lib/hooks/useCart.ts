import { useCartStore } from '@/lib/store/cartStore';
import { useCheckoutStore } from '@/lib/store/checkoutStore';
import {
  useTotalItems,
  useSubtotal,
  useTotal,
  useCartItems,
  useToggleCart,
} from '@/lib/store/cartSelector';
import { CartItem } from '@/types/cart';

export const useCart = () => {
  const {
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    hasItem,
    getItemById,
  } = useCartStore();

  const totalItems = useTotalItems();
  const subtotal = useSubtotal();
  const total = useTotal();
  const items = useCartItems();
  const isOpen = useCartStore((state) => state.isOpen);

  // Add item with validation
  const addToCart = (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => {
    if (!item.in_stock) {
      throw new Error('Product is out of stock');
    }
    addItem(item);
  };

  // Calculate final total with shipping and discount
  const getFinalTotal = () => {
    const checkout = useCheckoutStore.getState();
    const shipping = checkout.shipping_cost || 0;
    const discount = checkout.discount_amount || 0;
    return subtotal + shipping - discount;
  };

  // Get formatted prices
  const getFormattedPrices = () => {
    return {
      subtotal: `$${subtotal.toFixed(2)}`,
      total: `$${total.toFixed(2)}`,
      finalTotal: `$${getFinalTotal().toFixed(2)}`,
    };
  };

  return {
    items,
    totalItems,
    subtotal,
    total,
    isOpen,
    addToCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    hasItem,
    getItemById,
    getFinalTotal,
    getFormattedPrices,
  };
};

export const useCheckout = () => {
  const checkout = useCheckoutStore();
  const { items, subtotal } = useCartStore();

  const completeOrder = async () => {
    try {
      if (!checkout.shipping_address) {
        throw new Error('Shipping address is required');
      }
      if (!checkout.payment_method) {
        throw new Error('Payment method is required');
      }
      if (items.length === 0) {
        throw new Error('Cart is empty');
      }

      const orderData = {
        items,
        shipping_address: checkout.shipping_address,
        payment_method: checkout.payment_method,
        subtotal,
        shipping_cost: checkout.shipping_cost,
        discount_amount: checkout.discount_amount,
        promo_code: checkout.promo_code,
        total: subtotal + checkout.shipping_cost - checkout.discount_amount,
      };

      console.log('Creating order:', orderData);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const order = await response.json();

      // Clear cart and checkout after successful order
      useCartStore.getState().clearCart();
      checkout.reset();

      return order;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  };

  const getOrderSummary = () => {
    const shipping = checkout.shipping_cost || 0;
    const discount = checkout.discount_amount || 0;
    const tax = 0;
    const orderTotal = subtotal + shipping + tax - discount;

    return {
      subtotal,
      shipping,
      discount,
      tax,
      total: orderTotal,
      itemCount: items.length,
    };
  };

  return {
    ...checkout,
    completeOrder,
    getOrderSummary,
  };
};
