
'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import Product from './Products'



const ClientWrapper: React.FC = () => {
  const searchParams = useSearchParams();
  const query = searchParams?.get('query') || '';

  return (
    <div>
      <div className="products-container">
        <Product query={query} />
      </div>
    </div>
  );
};

export default ClientWrapper;
