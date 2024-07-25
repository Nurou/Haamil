import React from 'react';
import { Menu } from './menu';
import { usePageSwipe } from '../hooks/usePageSwipe';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const handlers = usePageSwipe();

  return (
    <>
      <div className='flex flex-col h-screen'>
        <main {...handlers} className='flex-grow flex items-center justify-center'>
          {children}
        </main>
        <Menu />
      </div>
    </>
  );
};
