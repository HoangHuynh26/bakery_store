import React, { useState, useEffect } from 'react';
import { 
  ChefHat, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  Clock, 
  ArrowRight,
  Inbox
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import './KitchenBoardPage.css';

export const KitchenBoardPage = () => {
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { addToast } = useToastStore();

  const fetchKitchenQueue = async () => {
    try {
      const data = await adminService.getKitchenQueue();
      setKitchenOrders(data || []);
    } catch (err) {
      addToast(err.message || 'Không thể tải hàng đợi bếp bánh', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKitchenQueue();
    // Auto polling every 30 seconds for live kitchen updates
    const timer = setInterval(fetchKitchenQueue, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchKitchenQueue();
  };

  const handleAdvanceStation = async (orderId, nextStatus, stationName) => {
    try {
      await adminService.updateOrderStatus(orderId, nextStatus, `Bếp: Chuyển sang trạm ${stationName}`);
      addToast(`Đã chuyển đơn sang: ${stationName}`, 'success');
      fetchKitchenQueue();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật trạm bếp', 'error');
    }
  };

  // Group orders into the 4 operational kitchen lanes
  const preparingQueue = kitchenOrders.filter((o) => o.status === 'PREPARING' || o.status === 'CONFIRMED');
  const bakingQueue = kitchenOrders.filter((o) => o.status === 'BAKING');
  const decoratingQueue = kitchenOrders.filter((o) => o.status === 'DECORATING');
  const readyQueue = kitchenOrders.filter((o) => o.status === 'READY_FOR_PICKUP');

  return (
    <div className="kitchen-board-root">
      {/* Header */}
      <div className="kitchen-header">
        <div>
          <h1 className="kitchen-title">
            <ChefHat size={28} className="text-amber-800" />
            <span>Bếp Bánh Maison Douce (Kitchen Queue)</span>
          </h1>
          <p className="text-xs text-slate-500">
            Màn hình điều phối chế biến bánh theo trạm (Chuẩn bị ➔ Nướng lò ➔ Trang trí ➔ Đóng hộp)
          </p>
        </div>

        <button 
          onClick={handleRefresh} 
          disabled={refreshing}
          className="kitchen-refresh-btn"
        >
          <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
          <span>Làm mới ({kitchenOrders.length} đơn)</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center flex-1">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-800"></div>
        </div>
      ) : (
        <div className="kitchen-lanes-container">
          {/* Lane 1: Chuẩn bị cốt bánh */}
          <div className="kitchen-lane">
            <div className="kitchen-lane-header lane-badge-preparing">
              <span className="lane-title">
                <ChefHat size={18} className="text-amber-600" />
                <span>1. Chuẩn Bị Cốt</span>
              </span>
              <span className="lane-count">{preparingQueue.length}</span>
            </div>
            <div className="kitchen-lane-cards">
              {preparingQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Inbox size={28} className="mx-auto mb-1 opacity-50" />
                  <span>Trạm trống</span>
                </div>
              ) : (
                preparingQueue.map((order) => (
                  <div key={order.id} className="kitchen-ticket">
                    <div className="ticket-header">
                      <span className="ticket-number">{order.orderNumber}</span>
                      <span className="ticket-time flex items-center gap-1">
                        <Clock size={12} />
                        <span>{order.deliveryTimeSlotLabel || 'Hôm nay'}</span>
                      </span>
                    </div>

                    <div className="ticket-items">
                      {order.items?.map((it) => (
                        <div key={it.id} className="ticket-item">
                          <span className="font-semibold text-slate-800">
                            {it.quantity}x {it.productNameVi}
                          </span>
                          <span className="text-xs text-slate-500">
                            {it.variantName || 'Chuẩn'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(order.customerNotes || order.internalNotes) && (
                      <div className="ticket-notes">
                        {order.internalNotes ? `Ghi chú: ${order.internalNotes}` : order.customerNotes}
                      </div>
                    )}

                    <button
                      onClick={() => handleAdvanceStation(order.id, 'BAKING', 'Lò Nướng')}
                      className="ticket-advance-btn"
                    >
                      <span>Vào Lò Nướng</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lane 2: Đang nướng lò */}
          <div className="kitchen-lane">
            <div className="kitchen-lane-header lane-badge-baking">
              <span className="lane-title">
                <Flame size={18} className="text-red-500" />
                <span>2. Đang Nướng Lò</span>
              </span>
              <span className="lane-count">{bakingQueue.length}</span>
            </div>
            <div className="kitchen-lane-cards">
              {bakingQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Inbox size={28} className="mx-auto mb-1 opacity-50" />
                  <span>Lò nướng đang rảnh</span>
                </div>
              ) : (
                bakingQueue.map((order) => (
                  <div key={order.id} className="kitchen-ticket">
                    <div className="ticket-header">
                      <span className="ticket-number">{order.orderNumber}</span>
                      <span className="ticket-time flex items-center gap-1">
                        <Clock size={12} />
                        <span>{order.deliveryTimeSlotLabel || 'Hôm nay'}</span>
                      </span>
                    </div>

                    <div className="ticket-items">
                      {order.items?.map((it) => (
                        <div key={it.id} className="ticket-item">
                          <span className="font-semibold text-slate-800">
                            {it.quantity}x {it.productNameVi}
                          </span>
                          <span className="text-xs text-slate-500">
                            {it.variantName || 'Chuẩn'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(order.customerNotes || order.internalNotes) && (
                      <div className="ticket-notes">
                        {order.internalNotes ? `Ghi chú: ${order.internalNotes}` : order.customerNotes}
                      </div>
                    )}

                    <button
                      onClick={() => handleAdvanceStation(order.id, 'DECORATING', 'Bàn Trang Trí')}
                      className="ticket-advance-btn"
                    >
                      <span>Nướng Xong ➔ Bàn Trang Trí</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lane 3: Trang trí kem */}
          <div className="kitchen-lane">
            <div className="kitchen-lane-header lane-badge-decorating">
              <span className="lane-title">
                <Sparkles size={18} className="text-purple-600" />
                <span>3. Bàn Trang Trí</span>
              </span>
              <span className="lane-count">{decoratingQueue.length}</span>
            </div>
            <div className="kitchen-lane-cards">
              {decoratingQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Inbox size={28} className="mx-auto mb-1 opacity-50" />
                  <span>Chưa có bánh chờ trang trí</span>
                </div>
              ) : (
                decoratingQueue.map((order) => (
                  <div key={order.id} className="kitchen-ticket">
                    <div className="ticket-header">
                      <span className="ticket-number">{order.orderNumber}</span>
                      <span className="ticket-time flex items-center gap-1">
                        <Clock size={12} />
                        <span>{order.deliveryTimeSlotLabel || 'Hôm nay'}</span>
                      </span>
                    </div>

                    <div className="ticket-items">
                      {order.items?.map((it) => (
                        <div key={it.id} className="ticket-item">
                          <span className="font-semibold text-slate-800">
                            {it.quantity}x {it.productNameVi}
                          </span>
                          <span className="text-xs text-slate-500">
                            {it.variantName || 'Chuẩn'}
                          </span>
                        </div>
                      ))}
                    </div>

                    {(order.customerNotes || order.internalNotes) && (
                      <div className="ticket-notes">
                        {order.internalNotes ? `Ghi chú: ${order.internalNotes}` : order.customerNotes}
                      </div>
                    )}

                    <button
                      onClick={() => handleAdvanceStation(order.id, 'READY_FOR_PICKUP', 'Đóng Hộp Sẵn Sàng')}
                      className="ticket-advance-btn"
                    >
                      <span>Trang Trí Xong ➔ Đóng Hộp</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Lane 4: Sẵn sàng đóng hộp giao */}
          <div className="kitchen-lane">
            <div className="kitchen-lane-header lane-badge-ready">
              <span className="lane-title">
                <CheckCircle2 size={18} className="text-emerald-600" />
                <span>4. Đã Hoàn Tất / Đóng Hộp</span>
              </span>
              <span className="lane-count">{readyQueue.length}</span>
            </div>
            <div className="kitchen-lane-cards">
              {readyQueue.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <Inbox size={28} className="mx-auto mb-1 opacity-50" />
                  <span>Chưa có đơn chờ</span>
                </div>
              ) : (
                readyQueue.map((order) => (
                  <div key={order.id} className="kitchen-ticket">
                    <div className="ticket-header">
                      <span className="ticket-number">{order.orderNumber}</span>
                      <span className="ticket-time flex items-center gap-1 bg-emerald-100 text-emerald-800">
                        <CheckCircle2 size={12} />
                        <span>Sẵn sàng</span>
                      </span>
                    </div>

                    <div className="ticket-items">
                      {order.items?.map((it) => (
                        <div key={it.id} className="ticket-item">
                          <span className="font-semibold text-slate-800">
                            {it.quantity}x {it.productNameVi}
                          </span>
                          <span className="text-xs text-slate-500">
                            {it.variantName || 'Chuẩn'}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="text-xs text-slate-500">
                      Khách: <strong className="text-slate-800">{order.customerName}</strong> ({order.customerPhone})
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default KitchenBoardPage;
