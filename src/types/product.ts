export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discounted_price?: number;
  images: string[];
  colors: ProductColor[];
  sizes: ProductSize[];
  category: string;
  gender: string;
  rating: number;
  reviews_count: number;
  in_stock: boolean;
  free_shipping: boolean;
}

export interface ProductColor {
  name: string;
  hex: string;
  available: boolean;
}

export interface ProductSize {
  value: string;
  label: string;
  available: boolean;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
}
