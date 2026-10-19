import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';
import { 
  ShoppingBag, Plus, Minus, Trash2, ArrowRight, Sparkles, 
  Tag, ShieldCheck, ArrowLeft, Clock, Truck 
} from 'lucide-react';
import './CartPage.css';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cart, items, fetchCart, updateQuantity, removeItem, clearCart, isLoading } = useCartStore();
  const { addToast } = useToastStore();

  const [promoCode, setPromoCode] = useState('');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = Number(cart?.subtotal || items.reduce((sum, i) => sum + (Number(i.unitPrice) * i.quantity), 0));
  const freeThreshold = Number(cart?.freeDeliveryThreshold || 500000);
  const freeProgress = Math.min(100, (subtotal / freeThreshold) * 100);
  const remainingForFree = Math.max(0, freeThreshold - subtotal);
  const deliveryFee = subtotal >= freeThreshold || subtotal === 0 ? 0 : 30000;
  const total = subtotal + deliveryFee;

  const handleUpdateNote = async (item) => {
    try {
      await updateQuantity(item.id, item.quantity, noteText);
      addToast('Đã cập nhật ghi chú bánh.', 'success');
      setEditingNoteId(null);
    } catch (err) {
      addToast('Không thể cập nhật ghi chú.', 'error');
    }
  };

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (promoCode.toUpperCase() === 'WELCOME10') {
      addToast('Mã WELCOME10 sẽ được áp dụng trực tiếp tại bước Thanh toán!', 'info');
    } else {
      addToast('Mã ưu đãi sẽ được kiểm tra và áp dụng tại bước Thanh toán.', 'info');
    }
  };

  if (items.length === 0 && !isLoading) {
    return (
      <div className="cart-page-container text-center py-24">
        <div className="max-w-md mx-auto p-8 bg-white rounded-3xl border border-stone-200 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-bakery-cream text-bakery-caramel flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-bakery-espresso mb-2">
            Giỏ Hàng Đang Trống
          </h1>
          <p className="text-xs text-stone-500 mb-8">
            Bạn chưa chọn món bánh nào. Hãy ghé qua thực đơn bánh ngọt nghệ thuật của Maison Douce để chọn cho mình món yêu thích nhé!
          </p>
          <button
            onClick={() => navigate('/catalog')}
            className="btn-primary text-xs px-8 py-3 w-full"
          >
            Khám Phá Menu Bánh Ngọt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      {/* Title & Back Link */}
      <div className="mb-8">
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-bakery-caramel transition mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tiếp tục chọn bánh</span>
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-3xl font-bold text-bakery-espresso">
            Giỏ Hàng Của Bạn ({items.length} món)
          </h1>
          <button
            onClick={() => {
              if (window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) {
                clearCart();
                addToast('Đã làm trống giỏ hàng.', 'info');
              }
            }}
            className="text-xs text-stone-400 hover:text-red-500 transition"
          >
            Xóa tất cả
          </button>
        </div>
      </div>

      {/* Free Shipping Notification Bar */}
      <div className="p-4 rounded-2xl bg-white border border-bakery-caramel/20 shadow-sm mb-8">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="flex items-center gap-1.5 font-semibold text-bakery-espresso">
            <Sparkles className="w-4 h-4 text-bakery-caramel" />
            {remainingForFree === 0
              ? 'Tuyệt vời! Đơn hàng của bạn đã đủ điều kiện MIỄN PHÍ VẬN CHUYỂN toàn thành phố!'
              : `Mua thêm ${formatCurrency(remainingForFree)} để được MIỄN PHÍ VẬN CHUYỂN`}
          </span>
          <span className="font-bold text-bakery-caramel">{Math.round(freeProgress)}%</span>
        </div>
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-bakery-caramel h-full rounded-full transition-all duration-500"
            style={{ width: `${freeProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="cart-item-row flex flex-col sm:flex-row gap-4 items-start">
              {/* Product Thumbnail */}
              <Link to={`/product/${item.productSlug}`} className="flex-shrink-0">
                <img
                  src={item.imageUrl || item.image || '/images/placeholder-cake.jpg'}
                  alt={item.nameVi || item.nameEn || item.productName}
                  className="w-24 h-24 object-cover rounded-xl bg-stone-100"
                />
              </Link>

              {/* Item Details */}
              <div className="flex-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="font-serif text-base font-bold text-bakery-espresso hover:text-bakery-caramel transition truncate"
                  >
                    {item.nameVi || item.nameEn || item.productName}
                  </Link>
                  <span className="font-bold text-bakery-caramel text-base sm:text-right">
                    {formatCurrency(Number(item.unitPrice) * item.quantity)}
                  </span>
                </div>

                {item.variantName && (
                  <p className="text-xs text-stone-500 mb-1">
                    Phân loại: <span className="font-medium text-stone-700">{item.variantName}</span>
                  </p>
                )}

                <p className="text-xs text-stone-400 mb-3">
                  Đơn giá: {formatCurrency(item.unitPrice)}
                </p>

                {/* Custom Notes Section */}
                {editingNoteId === item.id ? (
                  <div className="mb-3 p-2 rounded-lg bg-stone-50 border border-stone-200">
                    <input
                      type="text"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Ghi chú chữ trên bánh, nến số, v.v..."
                      className="login-input text-xs py-1.5 mb-2"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="btn-secondary text-[11px] px-2.5 py-1"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleUpdateNote(item)}
                        className="btn-primary text-[11px] px-3 py-1"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 mb-3">
                    {item.customizationNotes ? (
                      <span className="text-[11px] text-stone-500 italic bg-stone-50 px-2.5 py-1 rounded-md border border-stone-100">
                        "{item.customizationNotes}"
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400 italic">Chưa có ghi chú đặc biệt</span>
                    )}
                    <button
                      onClick={() => {
                        setEditingNoteId(item.id);
                        setNoteText(item.customizationNotes || '');
                      }}
                      className="text-[11px] text-bakery-caramel hover:underline"
                    >
                      {item.customizationNotes ? 'Sửa' : '+ Thêm ghi chú bánh'}
                    </button>
                  </div>
                )}

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition"
                      aria-label="Giảm số lượng"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-bakery-espresso">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-stone-600 hover:bg-stone-200 transition"
                      aria-label="Tăng số lượng"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-stone-400 hover:text-red-500 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa món</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sticky Card */}
        <div className="lg:col-span-4">
          <div className="cart-summary-card sticky top-24 space-y-4">
            <h2 className="font-serif text-lg font-bold text-bakery-espresso border-b border-stone-100 pb-3">
              Tóm Tắt Đơn Hàng
            </h2>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Tạm tính ({items.length} món):</span>
                <span className="font-semibold text-bakery-espresso">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Phí vận chuyển ước tính:</span>
                <span className="font-semibold text-bakery-espresso">
                  {deliveryFee === 0 ? (
                    <span className="text-green-600 font-bold uppercase">Miễn phí</span>
                  ) : (
                    formatCurrency(deliveryFee)
                  )}
                </span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyPromo} className="pt-2">
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                Mã Giảm Giá / Thẻ Ưu Đãi
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã (ví dụ: WELCOME10)"
                  className="login-input text-xs uppercase"
                />
                <button type="submit" className="btn-secondary text-xs px-4 flex-shrink-0">
                  Áp Dụng
                </button>
              </div>
            </form>

            {/* Final Total */}
            <div className="border-t border-stone-200 pt-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-semibold text-bakery-espresso">Tổng thanh toán:</span>
                <span className="font-serif text-2xl font-bold text-bakery-caramel">
                  {formatCurrency(total)}
                </span>
              </div>
              <p className="text-[11px] text-stone-400">Đã bao gồm thuế GTGT nếu áp dụng</p>
            </div>

            {/* Primary Checkout CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-sm mt-4 shadow-lg hover:shadow-bakery-caramel/25"
            >
              <span>Tiến Hành Đặt Hàng</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Guarantees */}
            <div className="pt-4 border-t border-stone-100 space-y-2 text-[11px] text-stone-500">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-bakery-caramel" />
                <span>Giao hàng bằng thùng giữ nhiệt chuyên dụng</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-bakery-caramel" />
                <span>Nướng mới mỗi ngày theo giờ đặt hẹn</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-bakery-caramel" />
                <span>Cam kết 100% nguyên liệu bơ và kem Pháp tự nhiên</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
