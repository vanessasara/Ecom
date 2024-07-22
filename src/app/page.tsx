
import React, { Suspense, useState } from 'react';
import Slider from '@/app/components/Slider';
import dynamic from 'next/dynamic';
import Category from '@/app/components/Category';
import { Skeleton } from '@/app/components/ui/skeleton';

const ClientWrapper = dynamic(() => import('@/app/components/ClientWrapper'), { ssr: false });

const Home: React.FC = () => {


  return (
    <div>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <Slider />
      </Suspense>
      <div className="products-heading">
        <h2>Best Seller Products</h2>
        <p>Speaker There are many variations passages</p>
      </div>
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <ClientWrapper />
      </Suspense>
      <Category />
      <div className='products-heading'>
        <h2>New Products</h2>
        <p>Speaker There are many variations passages</p>
        <Suspense fallback={<Skeleton className="h-64 w-full" />}>
          <ClientWrapper />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;
