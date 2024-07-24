'use client'
import React, { useCallback, useState, useEffect } from 'react';
import { useStateContext } from '@/context/StateContext';
import { AiOutlineClose } from 'react-icons/ai';
import { UrlFor } from '@/lib/client';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useShoppingCart } from 'use-shopping-cart';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import CheckoutButton from './CheckoutButton';

const CartDrawer: React.FC = () => {
  const { showCart, setShowCart, cartItems, toggleCartItemQuantity, onRemove } = useStateContext();
  const { redirectToCheckout, addItem } = useShoppingCart();
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Calculate the subtotal when cartItems change
    const calculateSubtotal = () => {
      const total = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 1), 0);
      setSubtotal(total);
    };
    calculateSubtotal();
  }, [cartItems]);

  const handleRemove = useCallback(async (item: any) => {
    const response = await fetch('/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: item._id }),
    });

    if (response.ok) {
      onRemove(item);
      toast.success('Product removed from cart');
    } else {
      toast.error('Failed to remove product from cart');
    }
  }, [onRemove]);

  const handleToggleQuantity = useCallback(async (id: string, value: 'inc' | 'dec') => {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ product_id: id, action: value }),
    });

    if (response.ok) {
      if (value === 'dec') {
        const item = cartItems.find((item) => item._id === id);
        if (item && item.quantity === 1) {
          handleRemove(item);
        } else {
          toggleCartItemQuantity(id, value);
          toast.success('Product quantity decreased');
        }
      } else {
        toggleCartItemQuantity(id, value);
        toast.success('Product quantity increased');
      }
    } else {
      toast.error('Failed to update product quantity');
    }
  }, [cartItems, toggleCartItemQuantity, handleRemove]);

  const handleCheckout = async () => {
    try {
      const items = cartItems.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        currency: item.currency,
        image: UrlFor(item.image).url(),
        price_id: item.price_id,
      }));

      console.log('Adding items to cart:', items);
      items.forEach(item => addItem(item));
      console.log('Redirecting to checkout...');
      await redirectToCheckout();
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('An error occurred during checkout');
    }
  };

  return (
    <Sheet open={showCart} onOpenChange={setShowCart}>
      <SheetTrigger asChild>
        <button className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full">Open Cart</button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {cartItems.length < 1 ? (
              <div className="mt-6 text-center">
                <h3 className="text-lg">Your cart is empty</h3>
              </div>
            ) : (
              <div className="mt-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex items-center justify-between mb-4">
                    <Image 
                      src={UrlFor(item.image).url()} 
                      alt={item.name} 
                      width={100}
                      height={100}
                      className="object-cover" 
                    />
                    <div className="flex-1 ml-4">
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="mt-1">${item.price}</p>
                      <div className="flex items-center mt-2">
                        <button
                          onClick={() => handleToggleQuantity(item._id, 'dec')}
                          className="px-2 py-1 border"
                        >
                          -
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button
                          onClick={() => handleToggleQuantity(item._id, 'inc')}
                          className="px-2 py-1 border"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemove(item)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold">Subtotal: ${subtotal}</h3>
             
             <CheckoutButton/>
             
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
