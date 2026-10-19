import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { LogIn, Lock, Mail, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuthStore();
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Vui lòng điền đầy đủ email và mật khẩu.');
      return;
    }

    try {
      const data = await login(email, password);
      addToast(`Chào mừng trở lại, ${data.user.fullName}!`, 'success');
      
      if (data.user.roles?.includes('ROLE_ADMIN') || data.user.roles?.includes('ROLE_SUPER_ADMIN')) {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(
        err.data?.message || err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.'
      );
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-bakery-cream text-bakery-caramel mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Maison Douce Boutique
          </span>
          <h1 className="font-serif text-3xl font-bold text-bakery-espresso">Đăng Nhập</h1>
          <p className="text-xs text-stone-500 mt-2">
            Đăng nhập để theo dõi đơn hàng, lưu bánh yêu thích và nhận điểm thưởng thành viên.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
              Địa chỉ Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="login-input pl-10"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-bakery-espresso">
                Mật khẩu
              </label>
              <a href="#forgot" className="text-xs text-bakery-caramel hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="login-input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 mt-2 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Fast Login Helper */}
        <div className="mt-8 pt-6 border-t border-stone-100">
          <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider text-center mb-2.5">
            Tài Khoản Thử Nghiệm (One-Click Demo)
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleDemoFill('customer@example.com', 'Customer@2026!')}
              className="demo-account-chip"
            >
              Khách hàng (Customer)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('chef@maisondouce.vn', 'Staff@MaisonDouce2026!')}
              className="demo-account-chip"
            >
              Bếp bánh (Chef)
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill('admin@maisondouce.vn', 'Admin@MaisonDouce2026!')}
              className="demo-account-chip font-medium text-bakery-caramel"
            >
              Quản trị (Admin)
            </button>
          </div>
        </div>

        {/* Register Footer */}
        <div className="text-center mt-6 pt-4 text-xs text-stone-600">
          Chưa có tài khoản Maison Douce?{' '}
          <Link to="/register" className="font-semibold text-bakery-caramel hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
