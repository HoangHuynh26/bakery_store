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
import { AdminLayout } from '../components/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import KitchenBoardPage from '../pages/admin/KitchenBoardPage';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import CustomCakeBuilderPage from '../pages/public/CustomCakeBuilderPage';
import AdminCustomCakesPage from '../pages/admin/AdminCustomCakesPage';
import AdminInventoryPage from '../pages/admin/AdminInventoryPage';

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

        {/* Bespoke Cake Builder & Informational */}
        <Route path="/custom-cake-builder" element={<CustomCakeBuilderPage />} />
        <Route path="/seasonal" element={<CatalogPage />} />
        <Route path="/about" element={<HomePage />} />
        <Route path="/contact" element={<HomePage />} />
      </Route>

      {/* Admin Operations Layout */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        <Route path="kitchen" element={<KitchenBoardPage />} />
        <Route path="custom-cakes" element={<AdminCustomCakesPage />} />
        <Route path="inventory" element={<AdminInventoryPage />} />
        <Route path="customers" element={<AdminCustomersPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
