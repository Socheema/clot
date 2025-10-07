import React from "react";
import CategoryCard from "@/components/category/CategoryCard";

type Category = {
  image: string;
  text: string;
};

const categories: Category[] = [
  { image: "/category/hoodies.png", text: "Hoodies" },
  { image: "/category/shorts.png", text: "Shorts" },
  { image: "/category/shoes.png", text: "Shoes" },
  { image: "/category/bags.png", text: "Bags" },
  { image: "/category/accessories.png", text: "Accessories" },
];

const CategoryList: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <p className="font-bold">Categories</p>
        <p className="text-sm cursor-pointer hover:underline">
          See All
        </p>
      </div>

      {/* Scrollable List */}
      <div className="flex items-center gap-3 w-full overflow-x-auto no-scrollbar px-2 snap-x snap-mandatory">
        {categories.map((cat) => (
          <CategoryCard key={cat.text} image={cat.image} text={cat.text} />
        ))}
      </div>
    </div>
  );
};

export default CategoryList;
