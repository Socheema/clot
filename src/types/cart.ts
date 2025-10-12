export interface CartItem {
  id: string; // Unique identifier for cart item (product_id + color + size)
  product_id: string | number;
  name: string;
  price: number;
  discounted_price?: number;
  image: string;
  color?: string;
  color_hex?: string;
  size?: string;
  quantity: number;
  in_stock: boolean;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean; // For cart drawer/modal

  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;

  // Computed values
  totalItems: number;
  subtotal: number;
  total: number;

  // Helper methods
  getItemById: (itemId: string) => CartItem | undefined;
  hasItem: (productId: string | number, color?: string, size?: string) => boolean;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface CheckoutState {
  shipping_address: ShippingAddress | null;
  payment_method: 'card' | 'paypal' | 'bank_transfer' | null;
  promo_code: string | null;
  discount_amount: number;
  shipping_cost: number;

  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentMethod: (method: 'card' | 'paypal' | 'bank_transfer') => void;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
  reset: () => void;
}
