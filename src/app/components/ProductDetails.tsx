
'use client';
import React, { useState } from 'react';
import { UrlFor } from '@/lib/client';
import { AiOutlineMinus, AiOutlinePlus, AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Button } from '@/app/components/ui/button';
import toast, { Toaster } from 'react-hot-toast';
import CartDrawer from './CartDrawer';
import { useStateContext } from '@/context/StateContext';
import Link from 'next/link';
import Image from 'next/image';

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
  image: ImageType[];
  name: string;
  slug: { current: string };
  price: number;
  description: string;
  categoryTitle: string;
}

interface ProductDetailsProps {
  product: ProductType;
  allProducts: ProductType[];
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product, allProducts = [] }) => {
  const [index, setIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { cartItems, setCartItems, showCart, setShowCart, onAdd } = useStateContext();

  if (!product) {
    return <div className="text-center">No product available</div>;
  }

  const { _id, image, name, price, description } = product;
  const imageUrl = image && image[index] ? UrlFor(image[index]).url() : '';

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = () => {
    const existingProduct = cartItems.find(item => item._id === _id);

    if (existingProduct) {
      const updatedCartItems = cartItems.map(item =>
        item._id === _id ? { ...item, quantity: (item.quantity || 0) + quantity } : item
      );
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { _id, name, price, image: imageUrl, quantity }]);
    }

    toast.success(`${quantity} ${name} added to the cart.`);
    setShowCart(true);
  };

  return (
    <div className="flex justify-center items-center h-full">
      <div className="main-container w-full max-w-screen-lg mx-auto">
        <div className="product-detail-container flex flex-wrap justify-center p-10">
          <div className="flex flex-col items-center sm:flex-row sm:items-start">
            <div className="flex flex-row md:flex-col items-center sm:mr-8">
              {image && image.map((img, idx) => (
                <Image
                  key={img._key}
                  src={UrlFor(img).url()}
                  alt={`Thumbnail ${idx + 1}`}
                  width={80}
                  height={80}
                  className={`object-cover cursor-pointer mb-2 sm:mb-4 ${idx === index ? 'border-2 border-red-600' : 'border'}`}
                  onClick={() => setIndex(idx)}
                />
              ))}
            </div>
            <div>
              <div className="product-detail-image w-96 h-96 bg-gray-200 rounded-lg">
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    width={500}
                    height={500}
                    alt={name}
                    className="w-full h-full object-cover rounded-lg transition-transform duration-300 ease-in-out hover:scale-105"
                  />
                )}
              </div>
            </div>
            <div className="product-detail-desc max-w-md sm:ml-8 mt-8 sm:mt-0">
              <h2 className="text-4xl font-bold text-[#324d67]">{name}</h2>
              <div className="reviews flex items-center mt-2 text-red-600">
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiFillStar />
                <AiOutlineStar />
                <p className="ml-2 text-gray-700">(20)</p>
              </div>
              <h4 className="text-xl font-bold mt-4 text-gray-800">Details:</h4>
              <p className="mt-2 text-gray-700">{description}</p>
              <p className=" mt-4 text-2xl font-bold text-gray-600">${price}</p>
              
              <div className="quantity flex items-center mt-4">
                <h3 className="text-xl font-semibold text-gray-800 mr-4">Quantity:</h3>
                <div className="quantity-desc flex items-center border border-gray-300 rounded px-2">
                  <span
                    className="cursor-pointer text-red-600"
                    onClick={decrementQuantity}
                  >
                    <AiOutlineMinus />
                  </span>
                  <span className="num px-4 text-gray-800">{quantity}</span>
                  <span
                    className="cursor-pointer text-green-600"
                    onClick={incrementQuantity}
                  >
                    <AiOutlinePlus />
                  </span>
                </div>
              </div>
              <div className="buttons mt-6 flex flex-col sm:flex-row">
                <Button
                  className="w-full sm:w-auto bg-lama text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105 mt-4 sm:mt-0 hover:bg-lama"
                  onClick={addToCart}
                >
                  Add to Cart
                </Button>
                <Button
                  className="w-full sm:w-auto bg-lama text-white py-2 px-4 rounded-lg transition-transform transform hover:scale-105 mt-4 sm:mt-0 hover:bg-lama"
                  onClick={() => {
                    addToCart();
                    setShowCart(true);
                  }}
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* All products section */}
        <div className="maylike-products-wrapper mt-10">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="marquee">
            <div className="maylike-products-container track flex space-x-4">
              {allProducts.map((prod) => (
                <Link href={`/product/${prod.slug.current}`} key={prod._id}>
                  <div className="flex flex-col items-center cursor-pointer">
                    <Image
                      src={UrlFor(prod.image[0]).url()}
                      alt={prod.name}
                      width={150}
                      height={150}
                      className="object-cover"
                    />
                    <h3 className="text-lg font-semibold mt-2">{prod.name}</h3>
                    <p className="text-gray-600">${prod.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {showCart && (
          <CartDrawer />
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default ProductDetails;
