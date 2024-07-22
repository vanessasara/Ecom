'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { User } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export const UserProfile = () => {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const userImage = session?.user?.image ?? '/default-profile.png'; // Provide a fallback image URL

  return (
    <div className="relative" ref={dropdownRef}>
      {session ? (
        <Image
          src={userImage}
          width={40}
          height={40}
          alt='user profile picture'
          className='rounded-full cursor-pointer'
          onClick={toggleDropdown}
        />
      ) : (
        <User size={24} className='cursor-pointer' onClick={toggleDropdown} />
      )}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50">
      
          <button
            onClick={() => signOut()}
            className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};
