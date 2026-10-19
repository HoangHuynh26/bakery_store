import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { CartDrawer } from '../cart/CartDrawer';
import { ToastContainer } from '../common/Toast';
import { FaqChatbotModal } from '../common/FaqChatbotModal';

export const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-bakery-ivory text-bakery-espresso">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <ToastContainer />
      <FaqChatbotModal />
    </div>
  );
};
