import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { formatCurrency } from '../../utils/formatters';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import './CartDrawer.css';

const FREE_SHIPPING_THRESHOLD = 450000;

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { isDrawerOpen, closeDrawer, items, updateQuantity, removeItem, getSubtotal } = useCartStore();

  if (!isDrawerOpen) return null;

  const subtotal = getSubtotal();
  const progressToFreeShipping = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  return (
    <>
      <div className="cart-drawer-overlay" onClick={closeDrawer} />
      <aside className="cart-drawer-content">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-bakery-caramel" />
            <h2 className="font-serif text-xl font-bold text-bakery-espresso">Giỏ Hàng Của Bạn</h2>
            <span className="text-xs bg-bakery-cream text-bakery-espresso font-semibold px-2 py-0.5 rounded-full">
              {items.length} món
            </span>
          </div>
          <button
            onClick={closeDrawer}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
            aria-label="Close cart drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Tier Banner */}
        <div className="bg-bakery-ivory px-6 py-3 border-b border-stone-100">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1 text-bakery-espresso">
              <Sparkles className="w-3.5 h-3.5 text-bakery-caramel" />
              {remainingForFreeShipping === 0
                ? 'Đơn hàng của bạn đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!'
                : `Thêm ${formatCurrency(remainingForFreeShipping)} để được miễn phí ship`}
            </span>
            <span className="font-bold text-bakery-caramel">{Math.round(progressToFreeShipping)}%</span>
          </div>
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-bakery-caramel h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressToFreeShipping}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-bakery-cream flex items-center justify-center text-bakery-caramel mb-4">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-bakery-espresso mb-1">
                Giỏ hàng đang trống
              </h3>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Hãy khám phá các món bánh kem thượng hạng, tiramisu và croissant bơ Pháp của Maison Douce.
              </p>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/catalog');
                }}
                className="btn-primary text-xs px-6 py-2.5"
              >
                Khám Phá Bánh Ngọt
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3.5 p-3.5 rounded-xl border border-stone-100 hover:border-bakery-caramel/30 transition bg-white"
              >
                <img
                  src={item.imageUrl || item.image || '/images/placeholder-cake.jpg'}
                  alt={item.nameVi || item.nameEn || item.productName || 'Bakery product'}
                  className="w-18 h-18 w-20 h-20 object-cover rounded-lg flex-shrink-0 bg-stone-100"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-bakery-espresso truncate">
                    {item.nameVi || item.nameEn || item.productName}
                  </h4>
                  {item.variantName && (
                    <p className="text-xs text-stone-500 mt-0.5 truncate">{item.variantName}</p>
                  )}
                  {item.customizationNotes && (
                    <p className="text-[11px] text-stone-400 italic truncate">"{item.customizationNotes}"</p>
                  )}
                  <p className="text-sm font-bold text-bakery-caramel mt-1">
                    {formatCurrency(item.unitPrice)}
                  </p>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold text-bakery-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-stone-600 hover:bg-stone-200 transition"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-stone-400 hover:text-red-500 p-1 transition"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Checkout Call-to-Action */}
        {items.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-stone-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone-600">Tạm tính:</span>
              <span className="font-serif text-xl font-bold text-bakery-espresso">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <p className="text-[11px] text-stone-400 text-right">
              Phí vận chuyển và mã giảm giá được tính ở bước thanh toán
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/cart');
                }}
                className="btn-secondary text-xs py-3 w-full"
              >
                Xem Giỏ Hàng
              </button>
              <button
                onClick={() => {
                  closeDrawer();
                  navigate('/checkout');
                }}
                className="btn-primary text-xs py-3 w-full flex items-center justify-center gap-1.5"
              >
                <span>Thanh Toán</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
