'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCartIcon } from 'lucide-react';
import { useStateContext } from '@/context/StateContext';
import CartDrawer from './CartDrawer';
import { signOut } from 'next-auth/react';

const Menu = () => {
  const [open, setOpen] = useState(false);
  const { showCart, setShowCart, totalQuantities } = useStateContext();

  const handleCartOpen = () => {
    setShowCart(true);
    setOpen(false); // Close menu when cart is opened
  };

  return (
    <div>
      <Image
        src="/menu.png"
        alt="Menu"
        width={28}
        height={28}
        className="cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="absolute bg-black text-white left-0 top-20 w-full h-[calc(100vh-80px)] flex flex-col items-center justify-center gap-8 text-xl z-10">
          <Link href="/">Homepage</Link>
          <Link href="/">Profile</Link>
          <Link href="/list">Shop</Link>
          <Link href="/">Contact</Link>
          <button
            onClick={handleCartOpen}
            className="flex items-center gap-2"
          >
            <ShoppingCartIcon />
            <span>Cart</span>
          </button>
          {showCart && <CartDrawer />}
          <button
            onClick={() => signOut()}
           >
            Sign Out
          </button>
        </div>
      )}
      {showCart && <CartDrawer />}
    </div>
  );
};

export default Menu;
