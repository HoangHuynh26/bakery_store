import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  MapPin, 
  CheckCircle, 
  ChefHat, 
  Truck, 
  Edit3, 
  AlertCircle,
  FileText,
  User,
  Phone,
  ArrowRight,
  X
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import './AdminOrdersPage.css';

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả đơn' },
  { key: 'PENDING_PAYMENT', label: 'Chờ thanh toán' },
  { key: 'CONFIRMED', label: 'Đã duyệt' },
  { key: 'PREPARING', label: 'Chuẩn bị cốt' },
  { key: 'BAKING', label: 'Đang nướng' },
  { key: 'DECORATING', label: 'Trang trí bánh' },
  { key: 'READY_FOR_PICKUP', label: 'Sẵn sàng lấy/giao' },
  { key: 'OUT_FOR_DELIVERY', label: 'Đang giao' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
  { key: 'CANCELLED', label: 'Đã huỷ' },
];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [notesModalOrder, setNotesModalOrder] = useState(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const { addToast } = useToastStore();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminOrders({
        page,
        size: 15,
        status: statusFilter,
      });
      setOrders(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      addToast(err.message || 'Không thể tải danh sách đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page]);

  const handleAdvanceStatus = async (orderId, nextStatus, comment = '') => {
    try {
      await adminService.updateOrderStatus(orderId, nextStatus, comment);
      addToast(`Đã chuyển đơn hàng sang trạng thái: ${getStatusLabel(nextStatus)}`, 'success');
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật trạng thái đơn hàng', 'error');
    }
  };

  const handleOpenNotes = (order) => {
    setNotesModalOrder(order);
    setInternalNotes(order.internalNotes || '');
  };

  const handleSaveNotes = async () => {
    if (!notesModalOrder) return;
    setSavingNotes(true);
    try {
      await adminService.updateOrderNotes(notesModalOrder.id, internalNotes);
      addToast('Cập nhật ghi chú nội bộ thành công', 'success');
      setNotesModalOrder(null);
      fetchOrders();
    } catch (err) {
      addToast(err.message || 'Lỗi lưu ghi chú', 'error');
    } finally {
      setSavingNotes(false);
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'Chờ thanh toán';
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'PREPARING': return 'Chuẩn bị cốt bánh';
      case 'BAKING': return 'Đang nướng lò';
      case 'DECORATING': return 'Trang trí kem';
      case 'READY_FOR_PICKUP': return 'Sẵn sàng giao / lấy';
      case 'OUT_FOR_DELIVERY': return 'Đang giao hàng';
      case 'DELIVERED':
      case 'COMPLETED': return 'Hoàn tất';
      case 'CANCELLED': return 'Đã huỷ';
      default: return status;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
      case 'BAKING':
      case 'DECORATING': return 'bg-amber-100 text-amber-800';
      case 'READY_FOR_PICKUP': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED':
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'CANCELLED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="orders-page-root">
      {/* Status Filter Navigation */}
      <div className="orders-status-nav">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            className={`order-tab-btn ${statusFilter === tab.key ? 'active' : ''}`}
            onClick={() => {
              setStatusFilter(tab.key);
              setPage(0);
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <ShoppingBag size={42} className="mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-700">Không có đơn hàng nào ở trạng thái này</p>
        </div>
      ) : (
        <div className="orders-list-grid">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              {/* Header */}
              <div className="order-card-header">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {order.orderNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-xs text-slate-400">
                    {order.fulfillmentType === 'STORE_PICKUP' ? 'Nhận tại tiệm' : 'Giao tận nơi'}
                  </span>
                </div>

                <div className="text-sm font-bold text-amber-900">
                  {formatVND(order.grandTotal)}
                </div>
              </div>

              {/* Body */}
              <div className="order-card-body">
                {/* Customer Details */}
                <div className="order-info-block">
                  <span className="order-info-label">Khách hàng & Liên hệ</span>
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <User size={15} className="text-slate-400" />
                    <span>{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 text-xs">
                    <Phone size={14} className="text-slate-400" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-500 text-xs mt-1">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{order.deliveryAddressText || 'Cửa hàng Maison Douce Bakery'}</span>
                  </div>
                </div>

                {/* Delivery Time & Custom Cake Notes */}
                <div className="order-info-block">
                  <span className="order-info-label">Thời gian hẹn</span>
                  <div className="flex items-center gap-2 text-slate-700 text-xs">
                    <Clock size={14} className="text-slate-400" />
                    <span>
                      {order.deliveryDate || 'Hôm nay'} ({order.deliveryTimeSlotLabel || 'Giờ tiệm mở cửa'})
                    </span>
                  </div>
                  {order.customerNotes && (
                    <div className="bg-amber-50 p-2 rounded text-xs text-amber-900 mt-1">
                      <span className="font-semibold">Lời dặn của khách:</span> {order.customerNotes}
                    </div>
                  )}
                  {order.internalNotes && (
                    <div className="bg-slate-100 p-2 rounded text-xs text-slate-700 mt-1">
                      <span className="font-semibold">Ghi chú bếp:</span> {order.internalNotes}
                    </div>
                  )}
                </div>

                {/* Ordered Items Summary */}
                <div className="order-info-block">
                  <span className="order-info-label">Danh sách bánh ({order.items?.length || 0})</span>
                  <div className="order-items-summary">
                    {order.items?.map((item) => (
                      <div key={item.id} className="order-item-row">
                        <span className="line-clamp-1">
                          {item.quantity}x {item.productNameVi} {item.variantName ? `(${item.variantName})` : ''}
                        </span>
                        <span className="font-semibold shrink-0">{formatVND(item.subtotal)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="order-card-footer">
                <div className="text-xs text-slate-400">
                  Phương thức thanh toán: <strong className="text-slate-600">{order.paymentMethod}</strong> ({order.paymentStatus})
                </div>

                <div className="order-actions-row">
                  <button
                    onClick={() => handleOpenNotes(order)}
                    className="notes-btn"
                  >
                    <Edit3 size={14} />
                    <span>Ghi chú nội bộ</span>
                  </button>

                  {/* Stage Progressions */}
                  {order.status === 'PENDING_PAYMENT' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'CONFIRMED', 'Xác nhận thanh toán thành công')}
                      className="advance-btn"
                    >
                      <CheckCircle size={14} />
                      <span>Xác nhận đơn</span>
                    </button>
                  )}

                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'PREPARING', 'Bắt đầu làm cốt bánh')}
                      className="advance-btn"
                    >
                      <ChefHat size={14} />
                      <span>Vào bếp làm bánh</span>
                    </button>
                  )}

                  {order.status === 'PREPARING' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'BAKING', 'Đưa vào lò nướng')}
                      className="advance-btn"
                    >
                      <ChefHat size={14} />
                      <span>Đưa vào lò nướng</span>
                    </button>
                  )}

                  {order.status === 'BAKING' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'DECORATING', 'Chuyển qua bàn trang trí')}
                      className="advance-btn"
                    >
                      <ChefHat size={14} />
                      <span>Trang trí kem bánh</span>
                    </button>
                  )}

                  {order.status === 'DECORATING' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'READY_FOR_PICKUP', 'Bánh đã đóng hộp hoàn chỉnh')}
                      className="advance-btn"
                    >
                      <CheckCircle size={14} />
                      <span>Sẵn sàng giao / lấy</span>
                    </button>
                  )}

                  {order.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'OUT_FOR_DELIVERY', 'Tài xế bắt đầu giao bánh')}
                      className="advance-btn"
                    >
                      <Truck size={14} />
                      <span>Bắt đầu giao bánh</span>
                    </button>
                  )}

                  {order.status === 'OUT_FOR_DELIVERY' && (
                    <button
                      onClick={() => handleAdvanceStatus(order.id, 'DELIVERED', 'Khách đã nhận bánh an toàn')}
                      className="advance-btn"
                    >
                      <CheckCircle size={14} />
                      <span>Giao thành công</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Internal Notes Modal */}
      {notesModalOrder && (
        <div className="admin-modal-overlay" onClick={() => setNotesModalOrder(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="text-base font-bold text-slate-800">
                Ghi Chú Nội Bộ - {notesModalOrder.orderNumber}
              </h2>
              <button onClick={() => setNotesModalOrder(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="p-4">
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Ghi chú làm bánh, trang trí hoặc dặn dò nhân viên giao hàng:
              </label>
              <textarea
                rows={4}
                className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                placeholder="VD: Khách dặn viết chữ 'Chúc Mừng Sinh Nhật Lan 2026' bằng sô-cô-la trắng..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
            </div>
            <div className="admin-modal-footer">
              <button
                onClick={() => setNotesModalOrder(null)}
                className="px-4 py-2 border rounded-lg text-sm text-slate-600"
              >
                Huỷ
              </button>
              <button
                onClick={handleSaveNotes}
                disabled={savingNotes}
                className="px-5 py-2 bg-amber-800 text-white rounded-lg text-sm font-semibold hover:bg-amber-900 disabled:opacity-50"
              >
                {savingNotes ? 'Đang lưu...' : 'Lưu ghi chú'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminOrdersPage;
