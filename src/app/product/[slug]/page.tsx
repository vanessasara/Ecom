
import React from 'react';
import { client } from '@/lib/client';
import ProductDetails from '@/app/components/ProductDetails';

interface ImageType {
  _key: string;
  _type: string;
  asset: {
    _ref: string;
    _type: string;
  };
}

interface ProductProps {
  params: {
    slug: string;
  };
}

const fetchProduct = async (slug: string) => {
  const query = `*[_type == "product" && slug.current == '${slug}'][0]`;
  const product = await client.fetch(query);
  return product;
};

const fetchAllProducts = async () => {
  const query = `*[_type == "product"]`;
  const allProducts = await client.fetch(query);
  return allProducts;
};

const ProductPage: React.FC<ProductProps> = async ({ params }) => {
  const product = await fetchProduct(params.slug);
  const allProducts = await fetchAllProducts();


  return <ProductDetails product={product} allProducts={allProducts} />;
};

export default ProductPage;
