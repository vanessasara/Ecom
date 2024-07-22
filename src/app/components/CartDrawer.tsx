'use client'
import React, { useCallback, useState, useEffect } from 'react';
import { useStateContext } from '@/context/StateContext';
import { AiOutlineClose } from 'react-icons/ai';
import { UrlFor } from '@/lib/client';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import CheckoutButton from './CheckoutButton';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

const CartDrawer: React.FC = () => {
  const { showCart, setShowCart, cartItems, toggleCartItemQuantity, onRemove } = useStateContext();
  const [subtotal, setSubtotal] = useState(0);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Create checkout session on the server
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItems }),
      });

      if (!response.ok) {
        toast.error('Failed to initiate checkout');
        setLoading(false);
        return;
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe?.redirectToCheckout({ sessionId: session.id });

      if (result?.error) {
        toast.error('errorr');
      }
    } catch (error) {
      toast.error('An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {showCart && (
        <>
          <div className="fixed inset-0 z-40 bg-black opacity-50" onClick={() => setShowCart(false)}></div>
          <div className={`fixed right-0 top-0 z-50 w-full max-w-md h-full bg-white shadow-xl overflow-y-auto transform transition-transform ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
            <button onClick={() => setShowCart(false)} className="absolute top-4 right-4 text-xl">
              <AiOutlineClose />
            </button>
            <div className="p-6">
              <h2 className="text-2xl font-semibold">Your Cart</h2>
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
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
