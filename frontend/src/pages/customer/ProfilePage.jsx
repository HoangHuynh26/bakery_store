import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import { authService } from '../../services/authService';
import { retentionService } from '../../services/retentionService';
import { 
  User, MapPin, Shield, ShoppingBag, Plus, Trash2, Edit3, 
  Check, AlertCircle, LogOut, Sparkles, Building, Phone, Mail,
  Crown, Award, Gift, ArrowRight
} from 'lucide-react';
import './ProfilePage.css';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser } = useAuthStore();
  const { addToast } = useToastStore();

  const [activeTab, setActiveTab] = useState('profile');
  const [addresses, setAddresses] = useState([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);

  // Profile Edit State
  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: '',
    phoneNumber: '',
    streetAddress: '',
    ward: '',
    district: '',
    city: 'Ho Chi Minh City',
    defaultAddress: false,
    deliveryNote: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadAddresses();
    loadLoyalty();
  }, [isAuthenticated]);

  const [loyaltyAccount, setLoyaltyAccount] = useState(null);
  const [isLoadingLoyalty, setIsLoadingLoyalty] = useState(false);

  const loadLoyalty = async () => {
    setIsLoadingLoyalty(true);
    try {
      const data = await retentionService.getMyLoyaltyAccount();
      setLoyaltyAccount(data);
    } catch (err) {
      // Quiet fail if not loaded
    } finally {
      setIsLoadingLoyalty(false);
    }
  };

  const loadAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const data = await authService.getAddresses();
      setAddresses(data || []);
    } catch (err) {
      // Quiet fail if not loaded
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const updated = await authService.updateProfile({ fullName, phoneNumber });
      updateUser(updated);
      addToast('Cập nhật thông tin thành công!', 'success');
    } catch (err) {
      addToast(err.data?.message || 'Không thể cập nhật hồ sơ.', 'error');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword.length < 6) {
      setPasswordError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Mật khẩu xác nhận không trùng khớp.');
      return;
    }

    setIsChangingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      addToast('Đổi mật khẩu thành công!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.data?.message || 'Mật khẩu hiện tại không chính xác.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setAddressForm({
      recipientName: user?.fullName || '',
      phoneNumber: user?.phoneNumber || '',
      streetAddress: '',
      ward: '',
      district: '',
      city: 'Ho Chi Minh City',
      defaultAddress: addresses.length === 0,
      deliveryNote: '',
    });
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddressForm({
      recipientName: addr.recipientName,
      phoneNumber: addr.phoneNumber,
      streetAddress: addr.streetAddress,
      ward: addr.ward || '',
      district: addr.district,
      city: addr.city || 'Ho Chi Minh City',
      defaultAddress: addr.defaultAddress,
      deliveryNote: addr.deliveryNote || '',
    });
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      if (editingAddress) {
        await authService.updateAddress(editingAddress.id, addressForm);
        addToast('Cập nhật địa chỉ thành công!', 'success');
      } else {
        await authService.addAddress(addressForm);
        addToast('Đã thêm địa chỉ giao hàng mới!', 'success');
      }
      setIsAddressModalOpen(false);
      loadAddresses();
    } catch (err) {
      addToast(err.data?.message || 'Có lỗi xảy ra khi lưu địa chỉ.', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) return;
    try {
      await authService.deleteAddress(id);
      addToast('Đã xóa địa chỉ.', 'success');
      loadAddresses();
    } catch (err) {
      addToast('Không thể xóa địa chỉ.', 'error');
    }
  };

  const handleSetDefaultAddress = async (id) => {
    try {
      await authService.setDefaultAddress(id);
      addToast('Đã đặt làm địa chỉ mặc định.', 'success');
      loadAddresses();
    } catch (err) {
      addToast('Có lỗi xảy ra.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    addToast('Đã đăng xuất khỏi Maison Douce.', 'info');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Page Title */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-bakery-caramel flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Tài Khoản Thành Viên
          </span>
          <h1 className="font-serif text-3xl font-bold text-bakery-espresso">
            Xin chào, {user.fullName}
          </h1>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary self-start md:self-auto text-xs px-4 py-2 flex items-center gap-2 text-stone-600 hover:text-red-600"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Đăng Xuất</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 space-y-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`profile-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            <User className="w-4 h-4" />
            <span>Thông Tin Cá Nhân</span>
          </button>

          <button
            onClick={() => setActiveTab('loyalty')}
            className={`profile-nav-btn ${activeTab === 'loyalty' ? 'active' : ''}`}
          >
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="flex items-center justify-between w-full">
              <span>Maison Douce Club</span>
              {loyaltyAccount && (
                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded-full">
                  {loyaltyAccount.pointsBalance} đ
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`profile-nav-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          >
            <MapPin className="w-4 h-4" />
            <span>Sổ Địa Chỉ Giao Hàng</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`profile-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
          >
            <Shield className="w-4 h-4" />
            <span>Bảo Mật & Mật Khẩu</span>
          </button>

          <button
            onClick={() => navigate('/cart')}
            className="profile-nav-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Giỏ Hàng Của Tôi</span>
          </button>
        </aside>

        {/* Tab Content */}
        <main className="lg:col-span-3">
          {/* TAB 1: Profile Information */}
          {activeTab === 'profile' && (
            <div className="profile-card p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-bakery-espresso mb-6">
                Thông Tin Cá Nhân
              </h2>
              <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Họ và Tên
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Email Đăng Ký
                  </label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="login-input opacity-70 bg-stone-100 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Email là mã định danh không thể thay đổi
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Số Điện Thoại
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0901234567"
                    className="login-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn-primary text-xs px-6 py-2.5 mt-2 flex items-center gap-2"
                >
                  {isUpdatingProfile ? 'Đang lưu...' : 'Lưu Thay Đổi'}
                </button>
              </form>
            </div>
          )}

          {/* TAB: Maison Douce Club & Loyalty Rewards */}
          {activeTab === 'loyalty' && (
            <div className="space-y-6">
              {/* VIP Membership Card */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2E1F1A] via-[#38261F] to-[#1E1410] p-7 md:p-9 text-white shadow-xl border border-amber-500/30">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col justify-between h-52">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-300">
                        Maison Douce Patisserie
                      </span>
                      <h3 className="font-serif text-2xl font-bold tracking-wide mt-0.5 text-stone-100">
                        VIP PRIVILEGE CLUB
                      </h3>
                    </div>
                    <div className="px-3.5 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-sm">
                      <Crown className="w-3.5 h-3.5 text-amber-300" />
                      <span>{loyaltyAccount?.currentTier?.name || 'Bronze Member'}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-6 border-t border-stone-700/60">
                    <div>
                      <span className="text-xs text-stone-400 block mb-1">Chủ Thẻ Thành Viên</span>
                      <span className="font-medium text-base tracking-wide text-stone-200">
                        {user?.fullName || 'Khách Hàng Quý Mến'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-stone-400 block mb-1">Điểm Thưởng Khả Dụng</span>
                      <span className="font-serif text-3xl font-bold text-amber-400">
                        {loyaltyAccount?.pointsBalance?.toLocaleString('vi-VN') || 0}
                        <span className="text-sm font-sans font-normal text-amber-200 ml-1">điểm</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tier Progress & Benefits */}
              <div className="profile-card p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-bakery-espresso mb-1">
                    Đặc Quyền Hạng {loyaltyAccount?.currentTier?.name || 'Bronze Member'}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {loyaltyAccount?.currentTier?.benefitsDescription ||
                      'Tích luỹ 1% điểm thưởng trên mọi đơn hàng và nhận ưu đãi riêng vào tháng sinh nhật.'}
                  </p>
                </div>

                {loyaltyAccount?.nextTier && (
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-bakery-espresso">
                        Tiến độ lên hạng {loyaltyAccount.nextTier.name}
                      </span>
                      <span className="text-amber-700 font-bold">
                        Còn {loyaltyAccount.pointsToNextTier} điểm
                      </span>
                    </div>
                    <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(
                              15,
                              ((loyaltyAccount.lifetimePoints || 100) /
                                ((loyaltyAccount.lifetimePoints || 100) +
                                  (loyaltyAccount.pointsToNextTier || 1))) *
                                100
                            )
                          )}%`,
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-stone-500 block">
                      Đặc quyền tiếp theo: {loyaltyAccount.nextTier.benefitsDescription}
                    </span>
                  </div>
                )}

                {/* Points Transactions Ledger */}
                <div className="space-y-3 pt-2">
                  <h4 className="font-serif font-bold text-sm text-bakery-espresso flex items-center gap-2">
                    <Award className="w-4 h-4 text-bakery-caramel" />
                    <span>Lịch Sử Giao Dịch Điểm</span>
                  </h4>

                  {loyaltyAccount?.recentTransactions && loyaltyAccount.recentTransactions.length > 0 ? (
                    <div className="divide-y divide-stone-100">
                      {loyaltyAccount.recentTransactions.map((tx) => (
                        <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-semibold text-stone-800 block">{tx.description}</span>
                            <span className="text-[11px] text-stone-400">
                              {tx.createdAt ? new Date(tx.createdAt).toLocaleDateString('vi-VN') : ''}
                            </span>
                          </div>
                          <span
                            className={`font-bold font-serif text-sm ${
                              tx.pointsChange >= 0 ? 'text-emerald-600' : 'text-rose-600'
                            }`}
                          >
                            {tx.pointsChange >= 0 ? `+${tx.pointsChange}` : tx.pointsChange} đ
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-stone-400 italic py-2">
                      Chưa có giao dịch tích điểm nào.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Address Book */}
          {activeTab === 'addresses' && (
            <div className="profile-card p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-xl font-bold text-bakery-espresso">
                    Sổ Địa Chỉ Giao Hàng
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Quản lý các địa chỉ nhận bánh tại gia hoặc gửi tặng người thân.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddAddress}
                  className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm Địa Chỉ</span>
                </button>
              </div>

              {isLoadingAddresses ? (
                <div className="py-8 text-center text-xs text-stone-400">Đang tải địa chỉ...</div>
              ) : addresses.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-stone-200 rounded-xl">
                  <MapPin className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p className="text-xs text-stone-500 mb-4">Bạn chưa lưu địa chỉ giao hàng nào.</p>
                  <button onClick={handleOpenAddAddress} className="btn-secondary text-xs px-4 py-2">
                    Thêm địa chỉ đầu tiên
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-sm text-bakery-espresso">
                            {addr.recipientName}
                          </span>
                          {addr.defaultAddress && (
                            <span className="address-badge-default">Mặc Định</span>
                          )}
                        </div>
                        <p className="text-xs text-stone-600 flex items-center gap-1.5 mb-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          <span>{addr.phoneNumber}</span>
                        </p>
                        <p className="text-xs text-stone-600 flex items-start gap-1.5 mb-2">
                          <Building className="w-3 h-3 text-stone-400 mt-0.5 flex-shrink-0" />
                          <span>
                            {addr.streetAddress}
                            {addr.ward ? `, Phường ${addr.ward}` : ''}, {addr.district}, {addr.city}
                          </span>
                        </p>
                        {addr.deliveryNote && (
                          <p className="text-[11px] text-stone-400 italic">
                            Ghi chú: "{addr.deliveryNote}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t border-stone-200/60 text-xs">
                        {!addr.defaultAddress ? (
                          <button
                            onClick={() => handleSetDefaultAddress(addr.id)}
                            className="text-stone-500 hover:text-bakery-caramel transition"
                          >
                            Đặt làm mặc định
                          </button>
                        ) : <span />}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleOpenEditAddress(addr)}
                            className="text-stone-400 hover:text-stone-700"
                            title="Sửa"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-stone-400 hover:text-red-500"
                            title="Xóa"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Security & Password */}
          {activeTab === 'security' && (
            <div className="profile-card p-6 md:p-8">
              <h2 className="font-serif text-xl font-bold text-bakery-espresso mb-2">
                Đổi Mật Khẩu
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Để bảo vệ an toàn tài khoản của bạn, vui lòng không chia sẻ mật khẩu cho người khác.
              </p>

              {passwordError && (
                <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Mật Khẩu Hiện Tại
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1.5">
                    Xác Nhận Mật Khẩu Mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="login-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-primary text-xs px-6 py-2.5 mt-2"
                >
                  {isChangingPassword ? 'Đang cập nhật...' : 'Đổi Mật Khẩu'}
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Address Edit/Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95">
            <h3 className="font-serif text-lg font-bold text-bakery-espresso mb-4">
              {editingAddress ? 'Chỉnh Sửa Địa Chỉ' : 'Thêm Địa Chỉ Giao Hàng Mới'}
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                    Người nhận *
                  </label>
                  <input
                    type="text"
                    value={addressForm.recipientName}
                    onChange={(e) => setAddressForm({ ...addressForm, recipientName: e.target.value })}
                    required
                    className="login-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => setAddressForm({ ...addressForm, phoneNumber: e.target.value })}
                    required
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                  Địa chỉ chi tiết (Số nhà, tên đường) *
                </label>
                <input
                  type="text"
                  value={addressForm.streetAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, streetAddress: e.target.value })}
                  placeholder="Ví dụ: 124 Lê Lợi"
                  required
                  className="login-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                    Phường / Xã
                  </label>
                  <input
                    type="text"
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                    placeholder="Bến Nghé"
                    className="login-input"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                    Quận / Huyện *
                  </label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="Quận 1"
                    required
                    className="login-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-bakery-espresso mb-1">
                  Ghi chú cho shipper
                </label>
                <input
                  type="text"
                  value={addressForm.deliveryNote}
                  onChange={(e) => setAddressForm({ ...addressForm, deliveryNote: e.target.value })}
                  placeholder="Gửi lễ tân hoặc gọi trước khi giao"
                  className="login-input"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="defaultAddress"
                  checked={addressForm.defaultAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, defaultAddress: e.target.checked })}
                  className="rounded border-stone-300 text-bakery-caramel focus:ring-bakery-caramel"
                />
                <label htmlFor="defaultAddress" className="text-xs text-stone-600 cursor-pointer">
                  Đặt làm địa chỉ nhận hàng mặc định
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="btn-secondary text-xs px-4 py-2"
                >
                  Hủy
                </button>
                <button type="submit" className="btn-primary text-xs px-5 py-2">
                  Lưu Địa Chỉ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
