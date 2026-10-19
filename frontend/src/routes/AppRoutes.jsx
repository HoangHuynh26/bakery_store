import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/public/HomePage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        
        {/* Placeholder route redirects for phase navigation */}
        <Route path="/catalog" element={<HomePage />} />
        <Route path="/catalog/:categorySlug" element={<HomePage />} />
        <Route path="/product/:slug" element={<HomePage />} />
        <Route path="/custom-cake-builder" element={<HomePage />} />
        <Route path="/seasonal" element={<HomePage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
        <Route path="/cart" element={<HomePage />} />
        <Route path="/checkout" element={<HomePage />} />
        <Route path="/login" element={<HomePage />} />
        <Route path="/register" element={<HomePage />} />
        <Route path="/wishlist" element={<HomePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
