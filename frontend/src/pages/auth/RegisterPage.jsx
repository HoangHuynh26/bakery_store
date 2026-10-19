import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { UserPlus, User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, AlertCircle } from 'lucide-react';
import './RegisterPage.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const { addToast } = useToastStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 6) {
      setErrorMessage('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    try {
      const data = await register({
        fullName,
        email,
        phoneNumber,
        password,
      });

      addToast(`Chào mừng bạn gia nhập gia đình Maison Douce, ${data.user.fullName}!`, 'success');
      navigate('/account/profile');
    } catch (err) {
      setErrorMessage(
        err.data?.message || err.message || 'Đăng ký tài khoản không thành công. Vui lòng thử lại.'
      );
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-card">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-bakery-cream text-bakery-caramel mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Tạo Tài Khoản Mới
          </span>
          <h1 className="font-serif text-3xl font-bold text-bakery-espresso">Gia Nhập Maison Douce</h1>
          <p className="text-xs text-stone-500 mt-2">
            Nhận ưu đãi 10% cho đơn hàng đầu tiên cùng đặc quyền tích lũy điểm thưởng thành viên thân thiết.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
              Họ và Tên *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nguyễn Văn A"
                required
                className="login-input pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
              Địa chỉ Email *
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
            <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
              Số Điện Thoại
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="0901234567"
                className="login-input pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                Mật Khẩu *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ít nhất 6 ký tự"
                  required
                  className="login-input pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                Xác Nhận Mật Khẩu *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className="login-input pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-stone-500 hover:text-bakery-espresso flex items-center gap-1"
            >
              {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 mt-4 flex items-center justify-center gap-2 text-sm"
          >
            {isLoading ? (
              <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Hoàn Tất Đăng Ký</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-4 border-t border-stone-100 text-xs text-stone-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-bakery-caramel hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    </div>
  );
};
