import React from 'react';
import { ShopProvider } from '@/context/ShopContext';
import StorefrontContent from '@/components/StorefrontContent';

export default function Home() {
  return (
    <ShopProvider>
      <StorefrontContent />
    </ShopProvider>
  );
}
