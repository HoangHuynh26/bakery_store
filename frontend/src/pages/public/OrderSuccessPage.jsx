import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle,
  Copy,
  Check,
  Calendar,
  Clock,
  MapPin,
  Phone,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import { checkoutService } from '../../services/checkoutService';
import { formatVND } from '../../utils/formatters';
import './OrderSuccessPage.css';

export default function OrderSuccessPage() {
  const { orderNumber } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!location.state?.order);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    if (!order && orderNumber) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true);
          const data = await checkoutService.getOrderByNumber(orderNumber);
          setOrder(data);
        } catch (err) {
          console.error('Failed to load order', err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [order, orderNumber]);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="order-success-page">
        <div className="order-success-container text-center py-24">
          <Loader2 size={40} className="animate-spin mx-auto text-caramel mb-4" />
          <p className="text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-success-page">
        <div className="order-success-container text-center py-24">
          <h2 className="success-title">Không tìm thấy đơn hàng</h2>
          <p className="success-subtitle">Mã đơn hàng #{orderNumber} không tồn tại hoặc đã hết hạn truy cập.</p>
          <Link to="/" className="btn-primary-action">
            Về Trang Chủ
          </Link>
        </div>
      </div>
    );
  }

  const isBankTransfer = order.paymentMethod === 'BANK_TRANSFER';
  const bankDetails = order.bankTransferDetails;

  return (
    <div className="order-success-page">
      <div className="order-success-container">
        {/* Hero Card */}
        <div className="success-hero-card">
          <div className="success-emblem">
            <CheckCircle size={44} />
          </div>
          <h1 className="success-title">Đặt Bánh Thành Công!</h1>
          <p className="success-subtitle">
            Cảm ơn bạn đã tin chọn Maison Douce. Nghệ nhân bếp bánh đã tiếp nhận đơn và sẽ chăm chút từng chi tiết để mang đến trải nghiệm ngọt ngào nhất.
          </p>

          <div className="order-number-badge">
            <span>Mã đơn hàng: #{order.orderNumber}</span>
            <button
              onClick={() => handleCopy(order.orderNumber, 'orderNumber')}
              className="copy-btn"
              title="Sao chép mã đơn"
            >
              {copiedField === 'orderNumber' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        {/* VietQR Bank Transfer Box */}
        {isBankTransfer && bankDetails && (
          <div className="vietqr-card">
            <h2 className="vietqr-title">Thanh Toán Chuyển Khoản Qua VietQR</h2>
            <p className="vietqr-desc">
              Vui lòng quét mã QR bên dưới bằng ứng dụng ngân hàng hoặc chuyển khoản theo cú pháp chính xác
            </p>

            <div className="vietqr-grid">
              <div className="vietqr-img-wrapper">
                <img
                  src={bankDetails.qrCodeUrl}
                  alt="VietQR Payment"
                  className="vietqr-img"
                />
              </div>

              <div className="bank-details-list">
                <div className="bank-detail-item">
                  <span className="bank-label">Ngân hàng thụ hưởng:</span>
                  <span className="bank-value">{bankDetails.bankName}</span>
                </div>

                <div className="bank-detail-item">
                  <span className="bank-label">Số tài khoản:</span>
                  <div className="bank-value">
                    <span>{bankDetails.accountNumber}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.accountNumber, 'accNumber')}
                      className="copy-btn"
                    >
                      {copiedField === 'accNumber' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="bank-detail-item">
                  <span className="bank-label">Chủ tài khoản:</span>
                  <span className="bank-value">{bankDetails.accountName}</span>
                </div>

                <div className="bank-detail-item">
                  <span className="bank-label">Số tiền cần chuyển:</span>
                  <span className="bank-value text-caramel font-bold text-lg">
                    {formatVND(bankDetails.amount)}
                  </span>
                </div>

                <div className="bank-detail-item">
                  <span className="bank-label">Nội dung chuyển khoản:</span>
                  <div className="bank-value font-mono text-caramel">
                    <span>{bankDetails.transferNote}</span>
                    <button
                      onClick={() => handleCopy(bankDetails.transferNote, 'note')}
                      className="copy-btn"
                    >
                      {copiedField === 'note' ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="vietqr-footer-note">
              * Hệ thống ngân hàng tự động cập nhật trạng thái đơn sau 1 - 3 phút kể từ khi nhận được chuyển khoản.
            </p>
          </div>
        )}

        {/* Fulfillment & Recipient Details */}
        <div className="order-overview-card">
          <h3 className="overview-title">Thông Tin Giao Nhận Bánh</h3>
          <div className="overview-grid">
            <div className="overview-item">
              <div className="overview-icon">
                <Calendar size={20} />
              </div>
              <div>
                <p className="overview-meta-label">Ngày nhận bánh</p>
                <p className="overview-meta-val">{order.deliveryDate}</p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">
                <Clock size={20} />
              </div>
              <div>
                <p className="overview-meta-label">Khung giờ tiếp nhận</p>
                <p className="overview-meta-val">{order.timeSlotName || 'Giờ hành chính (08:00 - 20:00)'}</p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">
                <MapPin size={20} />
              </div>
              <div>
                <p className="overview-meta-label">
                  {order.fulfillmentType === 'DELIVERY' ? 'Địa chỉ giao hàng' : 'Điểm nhận bánh'}
                </p>
                <p className="overview-meta-val">
                  {order.fulfillmentType === 'DELIVERY'
                    ? `${order.deliveryAddress}${order.deliveryZoneName ? `, ${order.deliveryZoneName}` : ''}`
                    : 'Boutique Maison Douce - 72 Lê Lợi, Bến Nghé, Quận 1, TP. HCM'}
                </p>
              </div>
            </div>

            <div className="overview-item">
              <div className="overview-icon">
                <Phone size={20} />
              </div>
              <div>
                <p className="overview-meta-label">Người nhận & Số điện thoại</p>
                <p className="overview-meta-val">
                  {order.recipientName} ({order.recipientPhone})
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="success-actions">
          <Link to={`/orders/${order.orderNumber}/track`} className="btn-primary-action">
            Theo Dõi Hành Trình Bánh <ArrowRight size={18} />
          </Link>
          <Link to="/catalog" className="btn-secondary-action">
            <ShoppingBag size={18} /> Tiếp Tục Mua Sắm
          </Link>
        </div>
      </div>
    </div>
  );
}
