import React, { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ChefHat, 
  Cake, 
  Users, 
  Store, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import './AdminLayout.css';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isStaff, logout } = useAuthStore();
  const navigate = useNavigate();

  // Guard: Must be authenticated and either ADMIN or STAFF
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin() && !isStaff()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-serif font-bold text-slate-800 mb-2">Quyền truy cập bị từ chối</h1>
        <p className="text-slate-600 max-w-md mb-6">
          Khu vực quản trị chỉ dành cho Quản lý cửa hàng (Admin) và Nhân viên làm bánh (Staff) của Maison Douce Bakery.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 bg-amber-800 text-white rounded-lg font-medium hover:bg-amber-900 transition-colors"
        >
          Trở về Trang chủ
        </button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tổng quan (Dashboard)' },
    { to: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng (Orders)' },
    { to: '/admin/kitchen', icon: ChefHat, label: 'Bếp bánh (Kitchen Queue)' },
    { to: '/admin/products', icon: Cake, label: 'Sản phẩm (Products)' },
    { to: '/admin/customers', icon: Users, label: 'Khách hàng (Customers)' },
  ];

  const userRoleDisplay = isAdmin() ? 'Quản lý (Admin)' : 'Thợ làm bánh (Staff)';

  return (
    <div className="admin-layout-root">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <NavLink to="/admin/dashboard" className="admin-brand-link">
            <div className="admin-brand-emblem">M</div>
            <div>
              <div className="admin-brand-title">Maison Douce</div>
              <div className="admin-brand-subtitle">Patisserie Ops</div>
            </div>
          </NavLink>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="admin-nav-divider" />

          <NavLink to="/" className="admin-nav-item">
            <Store size={19} />
            <span>Về Cửa hàng (Storefront)</span>
          </NavLink>
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-profile">
            <div className="admin-avatar">
              {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="admin-user-info">
              <div className="admin-user-name">{user?.fullName || 'Boutique Manager'}</div>
              <div className="admin-user-role">{userRoleDisplay}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={15} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Wrapper */}
      <div className="admin-main-wrapper">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-menu-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation menu"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="admin-breadcrumbs">
              <span className="font-semibold text-slate-800">Maison Douce Admin</span>
              <span>/</span>
              <span className="text-slate-500">Hệ thống Điều hành Tiệm Bánh</span>
            </div>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-live-badge">
              <span className="admin-live-dot" />
              <span>Hệ thống trực tuyến</span>
            </div>
          </div>
        </header>

        <main className="admin-content-container">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
