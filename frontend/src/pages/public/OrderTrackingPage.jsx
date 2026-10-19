import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Store,
  Package,
  AlertCircle,
  HelpCircle,
  PhoneCall,
  Loader2,
} from 'lucide-react';
import { checkoutService } from '../../services/checkoutService';
import { formatVND, formatDateTimeVN } from '../../utils/formatters';
import './OrderTrackingPage.css';

export default function OrderTrackingPage() {
  const { orderNumber: paramOrderNumber } = useParams();
  const navigate = useNavigate();

  const [inputOrderNumber, setInputOrderNumber] = useState(paramOrderNumber || '');
  const [trackingData, setTrackingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchTracking = async (numberToFetch) => {
    if (!numberToFetch?.trim()) return;
    try {
      setIsLoading(true);
      setErrorMessage('');
      const data = await checkoutService.getOrderTracking(numberToFetch.trim());
      setTrackingData(data);
    } catch (err) {
      setErrorMessage(err.message || 'Không tìm thấy đơn hàng với mã số này.');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (paramOrderNumber) {
      setInputOrderNumber(paramOrderNumber);
      fetchTracking(paramOrderNumber);
    }
  }, [paramOrderNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputOrderNumber.trim()) {
      navigate(`/orders/${inputOrderNumber.trim()}/track`);
    }
  };

  return (
    <div className="tracking-page">
      <div className="tracking-container">
        {/* Search Bar */}
        <div className="tracking-search-bar">
          <h2 className="tracking-search-title">Tra Cứu Tiến Trình Làm & Giao Bánh</h2>
          <form onSubmit={handleSearchSubmit} className="tracking-search-form">
            <input
              type="text"
              className="tracking-input"
              placeholder="Nhập mã đơn hàng (VD: MD-20261019-1234)"
              value={inputOrderNumber}
              onChange={(e) => setInputOrderNumber(e.target.value.toUpperCase())}
            />
            <button type="submit" disabled={isLoading} className="tracking-search-btn">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Tra cứu
            </button>
          </form>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span className="text-sm font-medium">{errorMessage}</span>
          </div>
        )}

        {/* Tracking Details */}
        {trackingData && (
          <div className="tracking-card">
            {/* Header */}
            <div className="tracking-header">
              <div>
                <span className="text-xs uppercase text-gray-500 font-semibold tracking-wider block mb-1">
                  Mã đơn hàng
                </span>
                <h1 className="tracking-order-id">#{trackingData.orderNumber}</h1>
              </div>

              <div className="tracking-status-pill status-pill-gold">
                <Clock size={16} />
                <span>{trackingData.currentStatusLabelVi}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="timeline-stepper">
              {trackingData.timeline.map((step, idx) => (
                <div
                  key={step.statusCode}
                  className={`timeline-step ${step.completed ? 'completed' : ''} ${step.current ? 'current' : ''}`}
                >
                  <div className="step-marker">
                    {step.completed ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-gray-400" />}
                  </div>

                  <div className="step-content">
                    <div className="step-title-row">
                      <span className="step-title">{step.labelVi}</span>
                      {step.timestamp && (
                        <span className="step-time">
                          {formatDateTimeVN ? formatDateTimeVN(step.timestamp) : new Date(step.timestamp).toLocaleTimeString('vi-VN')}
                        </span>
                      )}
                    </div>
                    {step.description && <p className="step-desc">{step.description}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details Grid */}
            {trackingData.orderDetails && (
              <div className="tracking-details-grid">
                <div className="tracking-detail-block">
                  <h4 className="tracking-detail-title">Người nhận & Địa điểm</h4>
                  <div className="tracking-detail-content">
                    <p className="font-semibold">{trackingData.orderDetails.recipientName}</p>
                    <p className="text-gray-600">{trackingData.orderDetails.recipientPhone}</p>
                    <p className="mt-1">
                      {trackingData.fulfillmentType === 'DELIVERY'
                        ? `${trackingData.orderDetails.deliveryAddress}, ${trackingData.orderDetails.deliveryZoneName || ''}`
                        : 'Nhận tại Maison Douce Boutique - 72 Lê Lợi, Quận 1, TP. HCM'}
                    </p>
                    <p className="text-xs text-caramel mt-2 font-medium">
                      Thời gian: {trackingData.orderDetails.deliveryDate} ({trackingData.orderDetails.timeSlotName})
                    </p>
                  </div>
                </div>

                <div className="tracking-detail-block">
                  <h4 className="tracking-detail-title">Tóm tắt thanh toán</h4>
                  <div className="tracking-detail-content">
                    <div className="flex justify-between mb-1">
                      <span>Tạm tính bánh:</span>
                      <span>{formatVND(trackingData.orderDetails.subtotal)}</span>
                    </div>
                    <div className="flex justify-between mb-1">
                      <span>Phí giao nhận:</span>
                      <span>{formatVND(trackingData.orderDetails.deliveryFee)}</span>
                    </div>
                    {Number(trackingData.orderDetails.discountAmount) > 0 && (
                      <div className="flex justify-between mb-1 text-green-700">
                        <span>Giảm giá:</span>
                        <span>-{formatVND(trackingData.orderDetails.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-espresso border-t border-gray-200 pt-2 mt-2">
                      <span>Tổng giá trị:</span>
                      <span className="text-caramel">{formatVND(trackingData.orderDetails.totalAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Customer Support Notice */}
        <div className="bg-white rounded-xl p-6 border border-gray-100 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <PhoneCall size={24} className="text-caramel shrink-0" />
            <div>
              <p className="font-semibold text-espresso text-sm">Cần hỗ trợ thay đổi giờ giao hoặc bánh gấp?</p>
              <p className="text-xs text-gray-500">Đội ngũ Maison Douce sẵn sàng phục vụ từ 08:00 - 21:00 hàng ngày</p>
            </div>
          </div>
          <a
            href="tel:02838229999"
            className="px-4 py-2 bg-warm-ivory text-espresso border border-caramel/30 rounded-lg text-sm font-semibold hover:bg-caramel hover:text-white transition-colors"
          >
            Hotline: 028 3822 9999
          </a>
        </div>
      </div>
    </div>
  );
}
