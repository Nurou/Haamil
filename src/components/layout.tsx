import React from 'react';
import { Menu } from './menu';

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="flex flex-col h-screen">
        <main className="flex-grow flex items-center justify-center">{children}</main>
        <Menu />
      </div>
    </>
  );
};
