import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CheckoutState, ShippingAddress } from '@/types/cart';

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      shipping_address: null,
      payment_method: null,
      promo_code: null,
      discount_amount: 0,
      shipping_cost: 0,

      // Set shipping address
      setShippingAddress: (address) => {
        set({ shipping_address: address });
        console.log('Shipping address set:', address);
      },

      // Set payment method
      setPaymentMethod: (method) => {
        set({ payment_method: method });
        console.log('Payment method set:', method);
      },

      // Apply promo code
      applyPromoCode: async (code) => {
        try {
          // TODO: Call your API to validate promo code
          // const response = await fetch('/api/validate-promo', {
          //   method: 'POST',
          //   body: JSON.stringify({ code }),
          // });
          // const data = await response.json();

          // Mock implementation
          const mockPromoCodes: { [key: string]: number } = {
            SAVE10: 10,
            SAVE20: 20,
            FREESHIP: 0, // Free shipping
          };

          const discount = mockPromoCodes[code.toUpperCase()] || 0;

          if (discount > 0 || code.toUpperCase() === 'FREESHIP') {
            set({
              promo_code: code.toUpperCase(),
              discount_amount: discount,
              shipping_cost: code.toUpperCase() === 'FREESHIP' ? 0 : get().shipping_cost,
            });
            console.log('Promo code applied:', code);
          } else {
            throw new Error('Invalid promo code');
          }
        } catch (error) {
          console.error('Failed to apply promo code:', error);
          throw error;
        }
      },

      // Remove promo code
      removePromoCode: () => {
        set({
          promo_code: null,
          discount_amount: 0,
        });
        console.log('Promo code removed');
      },

      // Reset checkout state (after order completion)
      reset: () => {
        set({
          shipping_address: null,
          payment_method: null,
          promo_code: null,
          discount_amount: 0,
          shipping_cost: 0,
        });
        console.log('Checkout state reset');
      },
    }),
    {
      name: 'checkout-data',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
