import Link from 'next/link';
import React from 'react';

export default function Layout({ children } : any) {
  return (
    <div className='flex flex-col min-h-screen'>
      <nav className='bg-white-100 mb-8 py-4 border-b-2'>
        <div className='container mx-auto flex justify-center'>
					<h1>Hello</h1>
        </div>
      </nav>
      <main className='container mx-auto flex-1'>{children}</main>

    </div>
  );
}