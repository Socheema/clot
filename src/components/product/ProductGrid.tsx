import React from "react";
import ProductCard from "@/components/product/ProductCard";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  discounted_price?: number;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          name={p.name}
          price={p.price}
          image={p.image}
          discounted_price={p.discounted_price}
        />
      ))}
    </div>
  );
}
