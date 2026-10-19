import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShoppingBag,
  Truck,
  Store,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Tag,
  ShieldCheck,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { checkoutService } from '../../services/checkoutService';
import { formatVND } from '../../utils/formatters';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, items, clearCart, fetchCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();

  // Delivery configuration from backend
  const [zones, setZones] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);

  // Form State
  const [recipientName, setRecipientName] = useState(user?.fullName || '');
  const [recipientPhone, setRecipientPhone] = useState(user?.phoneNumber || '');
  const [recipientEmail, setRecipientEmail] = useState(user?.email || '');
  const [fulfillmentType, setFulfillmentType] = useState('DELIVERY');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryZoneId, setDeliveryZoneId] = useState('');
  
  // Date calculation: minimum tomorrow morning or today if before 14:00
  const todayStr = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [deliveryDate, setDeliveryDate] = useState(tomorrowStr);
  const [deliveryTimeSlotId, setDeliveryTimeSlotId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [customerNotes, setCustomerNotes] = useState('');

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Initialize data
  useEffect(() => {
    fetchCart();

    const loadConfig = async () => {
      try {
        setIsLoadingConfig(true);
        const [zonesData, slotsData] = await Promise.all([
          checkoutService.getDeliveryZones(),
          checkoutService.getDeliverySlots(),
        ]);
        setZones(zonesData || []);
        setTimeSlots(slotsData || []);

        if (zonesData && zonesData.length > 0) {
          setDeliveryZoneId(zonesData[0].id);
        }
        if (slotsData && slotsData.length > 0) {
          setDeliveryTimeSlotId(slotsData[0].id);
        }
      } catch (err) {
        console.error('Failed to load checkout config', err);
      } finally {
        setIsLoadingConfig(false);
      }
    };

    loadConfig();
  }, [fetchCart]);

  // Pre-fill user data if user logs in or profile becomes available
  useEffect(() => {
    if (user) {
      if (!recipientName) setRecipientName(user.fullName || '');
      if (!recipientPhone) setRecipientPhone(user.phoneNumber || '');
      if (!recipientEmail) setRecipientEmail(user.email || '');
    }
  }, [user]);

  // Synchronize payment methods with fulfillment
  const handleFulfillmentChange = (type) => {
    setFulfillmentType(type);
    if (type === 'STORE_PICKUP' && paymentMethod === 'COD') {
      setPaymentMethod('STORE_PICKUP_CASH');
    } else if (type === 'DELIVERY' && paymentMethod === 'STORE_PICKUP_CASH') {
      setPaymentMethod('COD');
    }
  };

  // Calculate pricing breakdown
  const subtotal = items.reduce((sum, item) => sum + (Number(item.unitPrice) * item.quantity), 0);

  // Selected Zone calculation
  const selectedZone = zones.find((z) => z.id === deliveryZoneId);
  let deliveryFee = 0;
  if (fulfillmentType === 'DELIVERY' && selectedZone) {
    deliveryFee = subtotal >= Number(selectedZone.freeDeliveryThreshold)
      ? 0
      : Number(selectedZone.standardFee);
  }

  const finalTotal = Math.max(0, subtotal + deliveryFee - couponDiscount);

  // Handle Coupon Validation
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      setIsValidatingCoupon(true);
      setCouponError('');
      const res = await checkoutService.validateCoupon(couponCode.trim(), subtotal);
      if (res.valid) {
        setAppliedCoupon(res);
        setCouponDiscount(Number(res.calculatedDiscount || 0));
      } else {
        setCouponError(res.message || 'Mã giảm giá không hợp lệ.');
      }
    } catch (err) {
      setCouponError(err.message || 'Không thể kiểm tra mã giảm giá.');
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
    setCouponError('');
  };

  // Submit Checkout
  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (items.length === 0) {
      setErrorMessage('Giỏ hàng của bạn đang trống.');
      return;
    }

    if (!recipientName.trim()) {
      setErrorMessage('Vui lòng nhập họ tên người nhận.');
      return;
    }

    if (!recipientPhone.trim() || !/^[0-9]{9,12}$/.test(recipientPhone.trim())) {
      setErrorMessage('Vui lòng nhập số điện thoại hợp lệ (9 - 12 chữ số).');
      return;
    }

    if (fulfillmentType === 'DELIVERY') {
      if (!deliveryAddress.trim()) {
        setErrorMessage('Vui lòng nhập địa chỉ giao hàng cụ thể.');
        return;
      }
      if (!deliveryZoneId) {
        setErrorMessage('Vui lòng chọn khu vực giao hàng.');
        return;
      }
    }

    if (!deliveryDate) {
      setErrorMessage('Vui lòng chọn ngày giao hoặc nhận bánh.');
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        recipientName: recipientName.trim(),
        recipientPhone: recipientPhone.trim(),
        recipientEmail: recipientEmail.trim() || null,
        fulfillmentType,
        deliveryAddress: fulfillmentType === 'DELIVERY' ? deliveryAddress.trim() : null,
        deliveryZoneId: fulfillmentType === 'DELIVERY' ? deliveryZoneId : null,
        deliveryDate,
        deliveryTimeSlotId: deliveryTimeSlotId || null,
        paymentMethod,
        customerNotes: customerNotes.trim() || null,
        couponCode: appliedCoupon ? couponCode.trim() : null,
      };

      const createdOrder = await checkoutService.submitCheckout(payload);

      // Clean local cart state
      await clearCart();

      // Navigate to order success screen
      navigate(`/order-success/${createdOrder.orderNumber}`, {
        state: { order: createdOrder },
      });
    } catch (err) {
      setErrorMessage(err.message || 'Đặt hàng thất bại. Vui lòng thử lại.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-container text-center py-16">
          <ShoppingBag size={56} className="mx-auto text-caramel mb-4" />
          <h2 className="checkout-title">Giỏ hàng của bạn đang trống</h2>
          <p className="checkout-subtitle mb-6">
            Hãy khám phá bộ sưu tập bánh ngọt thủ công thượng hạng của Maison Douce trước khi thanh toán.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-espresso text-white rounded-lg font-medium hover:bg-caramel transition-colors"
          >
            <ArrowLeft size={18} /> Khám phá thực đơn
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Thanh Toán & Đặt Bánh</h1>
          <p className="checkout-subtitle">
            Hoàn tất thông tin giao nhận để các nghệ nhân Maison Douce chuẩn bị mẻ bánh tươi ngon nhất
          </p>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder}>
          <div className="checkout-grid">
            {/* Left Column: Information Steps */}
            <div className="checkout-main">
              {/* Step 1: Customer Details */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="section-badge">1</span> Thông tin người nhận bánh
                </h2>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">Họ và tên *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nguyễn Văn A"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số điện thoại *</label>
                    <input
                      type="tel"
                      className="form-input"
                      placeholder="0901234567"
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email nhận hóa đơn & cập nhật đơn hàng</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="example@gmail.com"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Step 2: Fulfillment & Timing */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="section-badge">2</span> Hình thức nhận & Thời gian
                </h2>

                {/* Fulfillment Tabs */}
                <div className="fulfillment-tabs">
                  <button
                    type="button"
                    className={`fulfillment-btn ${fulfillmentType === 'DELIVERY' ? 'active' : ''}`}
                    onClick={() => handleFulfillmentChange('DELIVERY')}
                  >
                    <Truck size={24} className={fulfillmentType === 'DELIVERY' ? 'text-caramel' : 'text-gray-400'} />
                    <span className="fulfillment-title">Giao tận nơi</span>
                    <span className="fulfillment-desc">Vận chuyển lạnh chuyên dụng</span>
                  </button>

                  <button
                    type="button"
                    className={`fulfillment-btn ${fulfillmentType === 'STORE_PICKUP' ? 'active' : ''}`}
                    onClick={() => handleFulfillmentChange('STORE_PICKUP')}
                  >
                    <Store size={24} className={fulfillmentType === 'STORE_PICKUP' ? 'text-caramel' : 'text-gray-400'} />
                    <span className="fulfillment-title">Nhận tại tiệm</span>
                    <span className="fulfillment-desc">Miễn phí tại Boutique Q.1</span>
                  </button>
                </div>

                {/* Delivery Fields */}
                {fulfillmentType === 'DELIVERY' ? (
                  <div>
                    <div className="form-group">
                      <label className="form-label">Khu vực / Quận giao hàng *</label>
                      <select
                        className="form-select"
                        value={deliveryZoneId}
                        onChange={(e) => setDeliveryZoneId(e.target.value)}
                        required
                      >
                        {zones.map((zone) => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} — Phí {formatVND(zone.standardFee)} (Freeship từ {formatVND(zone.freeDeliveryThreshold)})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Địa chỉ chi tiết (Số nhà, tên đường, tòa nhà/căn hộ) *</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Ví dụ: Căn 12.04, Tháp Aqua 1, Vinhomes Golden River, P. Bến Nghé"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required={fulfillmentType === 'DELIVERY'}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="store-pickup-info">
                    <p className="store-pickup-title">Maison Douce Boutique Saigon</p>
                    <p className="store-pickup-address">
                      72 Lê Lợi, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                      <br />
                      Giờ mở cửa đón khách: 08:00 - 21:00 hàng ngày
                      <br />
                      Hotline bếp bánh: 028 3822 9999
                    </p>
                  </div>
                )}

                {/* Date & Time Slot */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      <Calendar size={15} className="inline mr-1 text-caramel" />
                      Ngày {fulfillmentType === 'DELIVERY' ? 'giao hàng' : 'nhận bánh'} *
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      min={todayStr}
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <Clock size={15} className="inline mr-1 text-caramel" />
                      Khung giờ mong muốn *
                    </label>
                    <select
                      className="form-select"
                      value={deliveryTimeSlotId}
                      onChange={(e) => setDeliveryTimeSlotId(e.target.value)}
                    >
                      {timeSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                          {slot.slotName} ({slot.startTime?.slice(0, 5)} - {slot.endTime?.slice(0, 5)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="section-badge">3</span> Phương thức thanh toán
                </h2>

                <div className="payment-methods">
                  {/* Bank Transfer / VietQR */}
                  <label className={`payment-option ${paymentMethod === 'BANK_TRANSFER' ? 'active' : ''}`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="BANK_TRANSFER"
                      checked={paymentMethod === 'BANK_TRANSFER'}
                      onChange={() => setPaymentMethod('BANK_TRANSFER')}
                      className="payment-radio"
                    />
                    <div className="payment-text">
                      <div className="payment-name">
                        <span>Chuyển khoản VietQR tức thì</span>
                        <span className="payment-badge">Khuyên dùng</span>
                      </div>
                      <p className="payment-desc">
                        Quét mã QR qua mọi ứng dụng ngân hàng và ví điện tử, tự động khớp lệnh nhanh chóng.
                      </p>
                    </div>
                  </label>

                  {/* COD (Only for Delivery) */}
                  {fulfillmentType === 'DELIVERY' && (
                    <label className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === 'COD'}
                        onChange={() => setPaymentMethod('COD')}
                        className="payment-radio"
                      />
                      <div className="payment-text">
                        <div className="payment-name">Thanh toán tiền mặt khi nhận bánh (COD)</div>
                        <p className="payment-desc">
                          Thanh toán trực tiếp cho nhân viên vận chuyển sau khi kiểm tra bánh nguyên vẹn.
                        </p>
                      </div>
                    </label>
                  )}

                  {/* Cash at Store (Only for Store Pickup) */}
                  {fulfillmentType === 'STORE_PICKUP' && (
                    <label className={`payment-option ${paymentMethod === 'STORE_PICKUP_CASH' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="STORE_PICKUP_CASH"
                        checked={paymentMethod === 'STORE_PICKUP_CASH'}
                        onChange={() => setPaymentMethod('STORE_PICKUP_CASH')}
                        className="payment-radio"
                      />
                      <div className="payment-text">
                        <div className="payment-name">Thanh toán tại quầy khi nhận bánh</div>
                        <p className="payment-desc">
                          Tiền mặt hoặc quẹt thẻ POS tại quầy tiếp tân Maison Douce Boutique.
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              </div>

              {/* Step 4: Special Occasion & Customization Notes */}
              <div className="checkout-section">
                <h2 className="checkout-section-title">
                  <span className="section-badge">4</span> Lời nhắn bánh & Yêu cầu đặc biệt
                </h2>
                <div className="form-group">
                  <label className="form-label">
                    Nội dung viết chữ lên bánh sinh nhật / Lời chúc tặng kèm / Lưu ý bảo quản
                  </label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="Ví dụ: Ghi chữ 'Happy 25th Birthday Linh Dan' bằng sô-cô-la trắng, kèm nến số 25 giúp tiệm nhé..."
                    value={customerNotes}
                    onChange={(e) => setCustomerNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirmation */}
            <div className="checkout-sidebar">
              <div className="summary-card">
                <h3 className="summary-title">Đơn hàng của bạn ({items.length} món)</h3>

                {/* Item List */}
                <div className="summary-items-list">
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <img
                        src={item.productImage || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150'}
                        alt={item.productName}
                        className="summary-item-img"
                      />
                      <div className="summary-item-details">
                        <p className="summary-item-name">{item.productName}</p>
                        <p className="summary-item-meta">
                          {item.variantName ? `${item.variantName} • ` : ''}SL: {item.quantity}
                        </p>
                      </div>
                      <span className="summary-item-price">
                        {formatVND(Number(item.unitPrice) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                {!appliedCoupon ? (
                  <div>
                    <div className="coupon-box">
                      <input
                        type="text"
                        className="coupon-input"
                        placeholder="MÃ GIẢM GIÁ (VD: WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCode.trim()}
                        className="coupon-btn"
                      >
                        {isValidatingCoupon ? <Loader2 size={16} className="animate-spin" /> : 'Áp dụng'}
                      </button>
                    </div>
                    {couponError && <p className="coupon-error">{couponError}</p>}
                  </div>
                ) : (
                  <div className="coupon-success">
                    <span>
                      <Tag size={14} className="inline mr-1 text-green-700" />
                      Mã <strong>{appliedCoupon.code}</strong>: -{formatVND(couponDiscount)}
                    </span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-xs text-red-600 hover:underline font-semibold"
                    >
                      Gỡ bỏ
                    </button>
                  </div>
                )}

                {/* Financial Summary */}
                <div className="summary-line">
                  <span>Tạm tính bánh:</span>
                  <span>{formatVND(subtotal)}</span>
                </div>

                <div className="summary-line">
                  <span>Phí giao hàng:</span>
                  <span>{deliveryFee === 0 ? 'Miễn phí' : formatVND(deliveryFee)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="summary-line discount">
                    <span>Giảm giá khuyến mãi:</span>
                    <span>-{formatVND(couponDiscount)}</span>
                  </div>
                )}

                <div className="summary-line total">
                  <span>Tổng thanh toán:</span>
                  <span className="text-caramel">{formatVND(finalTotal)}</span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoadingConfig}
                  className="submit-order-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Đang xử lý đơn hàng...
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      Xác Nhận Đặt Bánh ({formatVND(finalTotal)})
                    </>
                  )}
                </button>

                <p className="checkout-policy-notice">
                  Bằng việc bấm đặt bánh, bạn đồng ý với Điều khoản dịch vụ và Chính sách giao nhận bánh tươi của Maison Douce Bakery.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
