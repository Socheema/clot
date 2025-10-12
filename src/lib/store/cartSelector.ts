import { useCartStore } from './cartStore';

const getEffectivePrice = (price: number, discountedPrice?: number): number => {
  return discountedPrice || price;
};

export const useTotalItems = () => {
  return useCartStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );
};

export const useSubtotal = () => {
  return useCartStore((state) =>
    state.items.reduce(
      (total, item) => total + getEffectivePrice(item.price, item.discounted_price) * item.quantity,
      0
    )
  );
};

export const useTotal = () => {
  return useSubtotal(); // Add shipping/tax logic here later
};

export const useCartItems = () => {
  return useCartStore((state) => state.items);
};

export const useIsCartOpen = () => {
  return useCartStore((state) => state.isOpen);
};

export const useToggleCart = () => {
  return useCartStore((state) => state.toggleCart);
};
