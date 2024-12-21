'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCartIcon } from 'lucide-react';
import { SearchBar } from './SearchBar';
import { useSearchParams } from 'next/navigation';
import { useStateContext } from '@/context/StateContext';
import CartDrawer from './CartDrawer';
import Menu from './Menu';
import { UserProfile } from './UserProfile'; // Import the UserProfile component

const Navbar: React.FC = () => {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <div className="h-20 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 relative">
      {/* MOBILE */}
      <div className="h-full flex items-center justify-between md:hidden">
        <Link href="/">
          <div className="text-2xl tracking-wide cursor-pointer">SARAH</div>
        </Link>
        <div className="w-2/4 mt-4 md:hidden">
          <SearchBar placeholder="Search Products" />
        </div>
        <div className="flex items-center gap-4">
          <Menu />
          {/* <button type="button" className="cart-icon" onClick={() => setShowCart(true)}>
            <ShoppingCartIcon />
            <span className="cart-item-qty">{totalQuantities}</span>
          </button>
          {showCart && <CartDrawer />} */}
        </div>
      </div>
      {/* BIGGER SCREENS */}
      <div className="hidden md:flex items-center justify-between gap-8 h-full">
        {/* LEFT */}
        <div className="w-1/3 xl:w-1/2 flex items-center gap-12">
          <Link href="/" className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={24} height={24} />
            <div className="text-2xl tracking-wide cursor-pointer">SARAH</div>
          </Link>
          <div className="hidden xl:flex gap-4">
            <Link href="/">
              <button>Homepage</button></Link>
            <Link href="/list">
            <button>Shop</button>
            </Link>
            <Link href="/list">
            <button>Men</button>
            </Link>
            <Link href="/list">
            <button>Women</button>
            </Link>
            <Link href="/list">
            <button>Accessories</button>
            </Link>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-2/3 xl:w-1/2 flex items-center justify-between gap-8 ">
          <SearchBar placeholder="Search Products" />
          <div className="flex items-center gap-4 relative">
            <UserProfile /> {/* Use the UserProfile component here */}
            <button type="button" onClick={() => setShowCart(true)}>
              <ShoppingCartIcon />
            </button>
            {showCart && <CartDrawer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
