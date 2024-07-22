'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { client, UrlFor } from '@/lib/client';
import { Skeleton } from "@/app/components/ui/skeleton";
import Image from 'next/image';
import { Button } from '@/app/components/ui/button';

interface ImageType {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface ProductType {
  _id: string;
  name: string;
  slug: { current: string };
  price: number;
  image: ImageType[];
  description: string;
}

const Product: React.FC<{ query: string }> = ({ query }) => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const productQuery = query
        ? `*[_type == "product" && name match "${query}*"]}`
        : '*[_type == "product"]';
      const products: ProductType[] = await client.fetch(productQuery);
      setProducts(products);
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  const displayedProducts = products.slice(0, 3);

  if (loading) {
    return (
      <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="w-full sm:w-[45%] lg:w-[30%] border rounded-lg p-4 shadow-md">
            <div className="flex flex-col space-y-3">
              <Skeleton className="h-[125px] w-[250px] rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (displayedProducts.length === 0) {
    return (
      <div>
        No products available
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-12">
    <div className="flex gap-x-8 gap-y-16 justify-between flex-wrap">
      {displayedProducts.map((product) => {
        const imageUrl = product.image && product.image[0] ? UrlFor(product.image[0]).url() : '';
  
        return (
          <Link href={`/product/${product.slug.current}`} key={product._id} className="w-full sm:w-[45%] lg:w-[30%]">
            <div className="product-card flex flex-col items-center ">
              {imageUrl && (
                <Image
                  src={imageUrl}
                  width={500}
                  height={500}
                  className=" max-h-[250px] max-w-[500px] object-contain rounded-xl mb-4"
                  alt={product.name}
                /> 
              )}
              <div className="flex flex-col space-y-2">
                <p className="product-name text-lg font-semibold">{product.name}</p>
                <p className="product-price text-gray-700">${product.price}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
    <div className="flex justify-center mt-8">
      <Link href="/list">
        <button className="bg-lama text-white py-2 px-4 rounded-lg">
          See All
        </button>
      </Link>
    </div>
  </div>
  

  );
};

export default Product;
