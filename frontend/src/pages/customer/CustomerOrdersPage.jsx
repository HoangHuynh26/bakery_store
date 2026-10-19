import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { checkoutService } from '../../services/checkoutService';
import { formatVND, formatDateTimeVN } from '../../utils/formatters';
import './CustomerOrdersPage.css';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await checkoutService.getCustomerOrders();
        setOrders(data || []);
      } catch (err) {
        setErrorMessage(err.message || 'Không thể tải lịch sử đơn hàng.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'DELIVERED':
      case 'COMPLETED':
        return <span className="order-status-badge bg-green-100 text-green-800">Đã hoàn thành</span>;
      case 'OUT_FOR_DELIVERY':
        return <span className="order-status-badge bg-blue-100 text-blue-800">Đang giao bánh</span>;
      case 'READY_FOR_PICKUP':
        return <span className="order-status-badge bg-purple-100 text-purple-800">Sẵn sàng nhận</span>;
      case 'PREPARING':
      case 'BAKING':
      case 'DECORATING':
        return <span className="order-status-badge bg-amber-100 text-amber-800">Đang chế biến</span>;
      case 'PENDING_PAYMENT':
        return <span className="order-status-badge bg-yellow-100 text-yellow-800">Chờ chuyển khoản</span>;
      default:
        return <span className="order-status-badge bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="customer-orders-page">
        <div className="customer-orders-container text-center py-20">
          <Loader2 size={36} className="animate-spin mx-auto text-caramel mb-4" />
          <p className="text-gray-600">Đang tải danh sách đơn hàng của bạn...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-orders-page">
      <div className="customer-orders-container">
        <div className="orders-page-header">
          <h1 className="orders-page-title">Lịch Sử Đơn Hàng</h1>
          <p className="orders-page-subtitle">Theo dõi trạng thái và lịch sử các mẻ bánh bạn đã đặt tại Maison Douce</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <AlertCircle size={20} className="shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-caramel/20">
            <Package size={52} className="mx-auto text-caramel/60 mb-4" />
            <h3 className="font-serif text-xl font-bold text-espresso mb-2">Bạn chưa có đơn hàng nào</h3>
            <p className="text-gray-600 text-sm max-width-md mx-auto mb-6">
              Các mẻ bánh tươi nướng mỗi sáng luôn sẵn sàng để làm ngọt ngào những dịp kỷ niệm của bạn.
            </p>
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-espresso text-white rounded-xl text-sm font-medium hover:bg-caramel transition-colors"
            >
              <ShoppingBag size={18} /> Khám phá thực đơn bánh
            </Link>
          </div>
        ) : (
          <div>
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3 className="order-card-id">#{order.orderNumber}</h3>
                    <span className="order-card-date">
                      Ngày đặt: {formatDateTimeVN ? formatDateTimeVN(order.createdAt) : new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>{getStatusBadge(order.status)}</div>
                </div>

                <div className="order-card-body">
                  <div className="order-items-preview">
                    {order.items?.map((item) => (
                      <p key={item.id} className="order-preview-item">
                        • <strong>{item.quantity}x</strong> {item.productName}
                        {item.variantName ? ` (${item.variantName})` : ''}
                      </p>
                    ))}
                    <p className="text-xs text-gray-500 mt-1">
                      {order.fulfillmentType === 'DELIVERY' ? 'Giao tận nơi: ' : 'Nhận tại tiệm: '}
                      {order.deliveryDate} ({order.timeSlotName})
                    </p>
                  </div>

                  <div className="order-card-meta">
                    <div>
                      <span className="text-xs text-gray-500 block">Tổng thanh toán</span>
                      <span className="order-total-price">{formatVND(order.totalAmount)}</span>
                    </div>

                    <Link to={`/orders/${order.orderNumber}/track`} className="btn-track-order">
                      Theo dõi <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
