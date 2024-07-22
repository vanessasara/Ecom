
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client, UrlFor } from '@/lib/client';
import Image from 'next/image';

interface ImageType {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface CategoryType {
  _id: string;
  categoryy: string;
  image: ImageType;
  category: {
    _ref: string;
  };
}

const Category: React.FC = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoryQuery = '*[_type == "productscategory"]';
      const categories: CategoryType[] = await client.fetch(categoryQuery);
      setCategories(categories);
    };

    fetchCategories();
  }, []);

  if (categories.length === 0) {
    return <div>No categories available</div>;
  }

  return (
    <div className="maylike-products-wrapper products-heading">
      <h2 >Products Category</h2>
      <div className="marquee">
        <div className="maylike-products-container track flex space-x-4">
          {categories.map((cat) => (
            <Link href={`/list?cat=${cat.category._ref}`} key={cat._id}>
              <div className="flex flex-col items-center cursor-pointer ">
                <Image
                  src={UrlFor(cat.image).url()}
                  alt={cat.categoryy}
                  width={200}
                  height={500}
                  className=" max-h-[250px] max-w-[500px]  rounded-xl mb-4"
                />
                <h3 className="text-lg font-semibold mt-2">{cat.categoryy}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Category;
