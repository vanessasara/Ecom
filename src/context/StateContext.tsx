'use client'
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  quantity?: number;
  image?: any; // Add appropriate type for image
  [key: string]: any;
}

interface ContextProps {
  showCart: boolean;
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  cartItems: Product[];
  totalPrice: number;
  totalQuantities: number;
  qty: number;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: Product, quantity: number) => void;
  toggleCartItemQuantity: (id: string, value: 'inc' | 'dec') => void;
  onRemove: (product: Product) => void;
  setCartItems: React.Dispatch<React.SetStateAction<Product[]>>;
  setTotalPrice: React.Dispatch<React.SetStateAction<number>>;
  setTotalQuantities: React.Dispatch<React.SetStateAction<number>>;
}

const Context = createContext<ContextProps | undefined>(undefined);

interface StateContextProps {
  children: ReactNode;
}

export const StateContext: React.FC<StateContextProps> = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  // Load cart from local storage on mount
  useEffect(() => {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const { items, total, quantities } = JSON.parse(cartData);
      setCartItems(items);
      setTotalPrice(total);
      setTotalQuantities(quantities);
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'cart',
      JSON.stringify({
        items: cartItems,
        total: totalPrice,
        quantities: totalQuantities,
      })
    );
  }, [cartItems, totalPrice, totalQuantities]);

  const onAdd = (product: Product, quantity: number) => {
    const checkProductInCart = cartItems.find((item) => item._id === product._id);

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: (cartProduct.quantity || 0) + quantity,
          };
        }
        return cartProduct;
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }


    
    const newTotalPrice = cartItems.reduce((acc, item) => acc + item.price * (item.quantity || 0), 0);
    setTotalPrice(newTotalPrice);
    const newTotalQuantities = cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    setTotalQuantities(newTotalQuantities);

    toast.success(`${qty} ${product.name} added to the cart.`);
  };

  const onRemove = (product: Product) => {
    const foundProduct = cartItems.find((item) => item._id === product._id);
    if (foundProduct) {
      const newCartItems = cartItems.filter((item) => item._id !== product._id);
      setCartItems(newCartItems);

      const newTotalPrice = newCartItems.reduce((acc, item) => acc + item.price * (item.quantity || 0), 0);
      setTotalPrice(newTotalPrice);
      const newTotalQuantities = newCartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
      setTotalQuantities(newTotalQuantities);
    }
  };

  const toggleCartItemQuantity = (id: string, value: 'inc' | 'dec') => {
    const foundProduct = cartItems.find((item) => item._id === id);
    if (foundProduct) {
      const newCartItems = cartItems.map((item) =>
        item._id === id ? { ...item, quantity: value === 'inc' ? (item.quantity || 0) + 1 : (item.quantity || 0) - 1 } : item
      );
      setCartItems(newCartItems);

      const newTotalPrice = newCartItems.reduce((acc, item) => acc + item.price * (item.quantity || 0), 0);
      setTotalPrice(newTotalPrice);
      const newTotalQuantities = newCartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
      setTotalQuantities(newTotalQuantities);
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        toggleCartItemQuantity,
        onRemove,
        setCartItems,
        setTotalPrice,
        setTotalQuantities,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = (): ContextProps => {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContextProvider');
  }
  return context;
};
