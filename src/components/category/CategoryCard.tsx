import React from "react";
import Image from "next/image";

type CategoryCardProps = {
  image: string;
  text: string;
};

const CategoryCard: React.FC<CategoryCardProps> = ({ image, text }) => {
  return (
    <div className="flex-none w-[70px] flex flex-col items-center gap-1 md:hidden">
      <Image
        src={image}
        alt={text}
        width={56}
        height={56}
        className="object-contain"
      />
      <p className="text-[10px] capitalize text-center truncate w-full">
        {text}
      </p>
    </div>
  );
};

export default CategoryCard;
