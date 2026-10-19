import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { HomePage } from '../pages/public/HomePage';
import { CatalogPage } from '../pages/public/CatalogPage';
import { ProductDetailPage } from '../pages/public/ProductDetailPage';
import { SearchResultsPage } from '../pages/public/SearchResultsPage';
import { CartPage } from '../pages/public/CartPage';
import CheckoutPage from '../pages/public/CheckoutPage';
import OrderSuccessPage from '../pages/public/OrderSuccessPage';
import OrderTrackingPage from '../pages/public/OrderTrackingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ProfilePage } from '../pages/customer/ProfilePage';
import { WishlistPage } from '../pages/customer/WishlistPage';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Storefront Layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/catalog/:categorySlug" element={<CatalogPage />} />
        <Route path="/product/:slug" element={<ProductDetailPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
        <Route path="/orders/:orderNumber/track" element={<OrderTrackingPage />} />
        <Route path="/orders/track" element={<OrderTrackingPage />} />

        {/* Authentication & Customer Account */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/profile" element={<ProfilePage />} />
        <Route path="/customer/profile" element={<ProfilePage />} />
        <Route path="/account/orders" element={<CustomerOrdersPage />} />
        <Route path="/customer/orders" element={<CustomerOrdersPage />} />
        <Route path="/account/wishlist" element={<WishlistPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />

        {/* Informational pages */}
        <Route path="/seasonal" element={<CatalogPage />} />
        <Route path="/custom-cake-builder" element={<CatalogPage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
