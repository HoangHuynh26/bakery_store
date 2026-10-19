import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  ShieldCheck, 
  LogOut,
  ChevronDown
} from 'lucide-react';
import './Navbar.css';

export const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const cartItemCount = useCartStore((state) => state.getTotalItemCount());
  const openCartDrawer = useCartStore((state) => state.openDrawer);
  const { user, isAuthenticated, logout, isAdmin, isStaff } = useAuthStore();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <>
      {/* 1. Announcement Bar */}
      <div className="announcement-bar flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-bakery-caramel" />
        <span>Giao bánh tận nơi trong 2 giờ tại TP.HCM • Miễn phí vận chuyển cho đơn từ 450.000₫</span>
      </div>

      {/* 2. Main Navigation Header */}
      <header className="navbar-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Mobile menu trigger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-bakery-espresso hover:text-bakery-caramel transition"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex flex-col text-left group">
                <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-bakery-espresso group-hover:text-bakery-caramel transition">
                  Maison Douce
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-bakery-caramel -mt-1 font-semibold">
                  Pâtisserie Fine
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Trang Chủ
              </NavLink>
              <NavLink to="/catalog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Thực Đơn Bánh
              </NavLink>
              <NavLink to="/custom-cake-builder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Đặt Bánh Thiết Kế
              </NavLink>
              <NavLink to="/seasonal" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Bộ Sưu Tập Mùa
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Nghệ Nhân Maison
              </NavLink>
              <NavLink to="/orders/track" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Tra Cứu Đơn
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Liên Hệ & Tiệm
              </NavLink>
            </nav>

            {/* Header Right Actions */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-bakery-espresso hover:text-bakery-caramel transition"
                aria-label="Search pastries"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="hidden sm:flex p-2 text-bakery-espresso hover:text-bakery-caramel transition"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                      className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-bakery-cream transition text-sm font-medium"
                    >
                      <div className="w-8 h-8 rounded-full bg-bakery-caramel text-white flex items-center justify-center font-bold text-xs uppercase">
                        {user?.fullName?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-stone-600 hidden sm:block" />
                    </button>

                    {isUserDropdownOpen && (
                      <div 
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-elevated border border-stone-200 py-2 z-50 animate-in fade-in"
                        onMouseLeave={() => setIsUserDropdownOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-stone-100">
                          <p className="text-xs text-stone-500">Đăng nhập bởi</p>
                          <p className="text-sm font-semibold text-bakery-espresso truncate">{user?.fullName}</p>
                          <p className="text-xs text-bakery-caramel truncate">{user?.email}</p>
                        </div>

                        {(isAdmin() || isStaff()) && (
                          <Link
                            to="/admin"
                            onClick={() => setIsUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-bakery-caramel hover:bg-bakery-ivory font-semibold"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Quản Trị Hệ Thống
                          </Link>
                        )}

                        <Link
                          to="/customer/profile"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <User className="w-4 h-4" />
                          Tài khoản của tôi
                        </Link>
                        <Link
                          to="/customer/orders"
                          onClick={() => setIsUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          Lịch sử đơn hàng
                        </Link>

                        <div className="border-t border-stone-100 mt-1 pt-1">
                          <button
                            onClick={() => {
                              setIsUserDropdownOpen(false);
                              logout();
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            Đăng xuất
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1.5 p-2 text-bakery-espresso hover:text-bakery-caramel transition text-sm font-medium"
                    aria-label="Account Login"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden sm:inline">Đăng nhập</span>
                  </Link>
                )}
              </div>

              {/* Shopping Cart Drawer Trigger */}
              <button
                onClick={openCartDrawer}
                className="relative p-2 text-bakery-espresso hover:text-bakery-caramel transition"
                aria-label={`Shopping Cart with ${cartItemCount} items`}
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {isSearchOpen && (
          <div className="border-t border-stone-200 bg-white py-4 px-4 shadow-soft animate-in slide-in-from-top-2">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="absolute left-4 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bánh sinh nhật, tiramisu, macaron, croissant..."
                  className="w-full pl-12 pr-24 py-3 bg-bakery-ivory rounded-full border border-stone-300 focus:outline-none focus:border-bakery-caramel text-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-bakery-caramel text-white rounded-full text-xs font-semibold hover:bg-bakery-caramel-dark transition"
                >
                  Tìm Kiếm
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-bakery-ivory px-6 py-6 space-y-4 animate-in slide-in-from-top-3">
            <div className="flex flex-col space-y-3 font-medium text-bakery-espresso">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200/60"
              >
                Trang Chủ
              </Link>
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200/60"
              >
                Thực Đơn Bánh
              </Link>
              <Link
                to="/custom-cake-builder"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200/60 text-bakery-caramel font-semibold"
              >
                Đặt Bánh Thiết Kế
              </Link>
              <Link
                to="/seasonal"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200/60"
              >
                Bộ Sưu Tập Mùa
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-stone-200/60"
              >
                Nghệ Nhân Maison
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2"
              >
                Liên Hệ & Tiệm
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
