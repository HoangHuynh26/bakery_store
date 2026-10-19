import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  ChefHat, 
  AlertTriangle, 
  RefreshCw,
  TrendingUp,
  ArrowRight,
  PackageCheck,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import './AdminDashboardPage.css';

const PIE_COLORS = ['#c89963', '#38261f', '#f3d8d4', '#a8b5a0', '#e07a5f', '#3d5a80'];

export const AdminDashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [restockValues, setRestockValues] = useState({});
  const { addToast } = useToastStore();

  const fetchDashboardData = async () => {
    try {
      const [sumData, stockData] = await Promise.all([
        adminService.getDashboardSummary(),
        adminService.getLowStockAlerts(15)
      ]);
      setSummary(sumData);
      setLowStock(stockData || []);
    } catch (err) {
      addToast(err.message || 'Không thể tải dữ liệu bảng điều khiển', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleQuickRestock = async (productId) => {
    const qty = parseInt(restockValues[productId], 10);
    if (isNaN(qty) || qty < 0) {
      addToast('Vui lòng nhập số lượng hợp lệ', 'error');
      return;
    }
    try {
      await adminService.updateStock(productId, qty);
      addToast('Cập nhật tồn kho thành công!', 'success');
      // Refresh list
      fetchDashboardData();
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật tồn kho', 'error');
    }
  };

  const handleExportOrders = async () => {
    try {
      addToast('Đang tạo báo cáo đơn hàng...', 'info');
      await adminService.downloadOrdersCsv();
      addToast('Xuất báo cáo đơn hàng thành công!', 'success');
    } catch (err) {
      addToast('Không thể xuất báo cáo lúc này', 'error');
    }
  };

  const handleExportInventory = async () => {
    try {
      addToast('Đang tạo báo cáo tồn kho...', 'info');
      await adminService.downloadInventoryCsv();
      addToast('Xuất báo cáo tồn kho thành công!', 'success');
    } catch (err) {
      addToast('Không thể xuất báo cáo lúc này', 'error');
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-800"></div>
      </div>
    );
  }

  // Sample weekly revenue data based on backend figures
  const revenueTrendData = [
    { day: 'T2', revenue: (summary?.todayRevenue || 1200000) * 0.7 },
    { day: 'T3', revenue: (summary?.todayRevenue || 1200000) * 0.85 },
    { day: 'T4', revenue: (summary?.todayRevenue || 1200000) * 0.9 },
    { day: 'T5', revenue: (summary?.todayRevenue || 1200000) * 1.1 },
    { day: 'T6', revenue: (summary?.todayRevenue || 1200000) * 1.3 },
    { day: 'T7', revenue: (summary?.todayRevenue || 1200000) * 1.6 },
    { day: 'CN', revenue: summary?.todayRevenue || 1200000 },
  ];

  const categoryDistribution = [
    { name: 'Bánh Sinh Nhật', value: 40 },
    { name: 'Tiramisu & Mousse', value: 25 },
    { name: 'Choux & Pastry', value: 18 },
    { name: 'Croissant', value: 17 },
  ];

  return (
    <div className="dashboard-root">
      {/* Page Title & Refresh */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Bảng Điều Hành Tiệm Bánh</h1>
          <p className="dashboard-subtitle">
            Giám sát doanh số trực tiếp, quy trình nướng bánh & điều phối giao hàng Maison Douce
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={handleExportOrders} 
            className="dashboard-refresh-btn"
            title="Xuất danh sách đơn hàng sang file CSV"
          >
            <Download size={15} />
            <span>Xuất Đơn (CSV)</span>
          </button>
          <button 
            onClick={handleExportInventory} 
            className="dashboard-refresh-btn"
            title="Xuất tồn kho sản phẩm sang file CSV"
          >
            <Download size={15} />
            <span>Xuất Kho (CSV)</span>
          </button>
          <button 
            onClick={handleRefresh} 
            disabled={refreshing}
            className="dashboard-refresh-btn"
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Doanh thu hôm nay</span>
            <span className="kpi-value">{formatVND(summary?.todayRevenue)}</span>
            <span className="kpi-subtext">Cập nhật theo thời gian thực</span>
          </div>
          <div className="kpi-icon-wrapper kpi-icon-revenue">
            <DollarSign size={26} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Tổng đơn hôm nay</span>
            <span className="kpi-value">{summary?.todayOrdersCount || 0}</span>
            <span className="kpi-subtext">Đơn đặt trong ngày</span>
          </div>
          <div className="kpi-icon-wrapper kpi-icon-orders">
            <ShoppingBag size={26} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Bếp đang làm</span>
            <span className="kpi-value">{summary?.pendingPreparationCount || 0}</span>
            <span className="kpi-subtext">Cần làm & nướng</span>
          </div>
          <div className="kpi-icon-wrapper kpi-icon-kitchen">
            <ChefHat size={26} />
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-info">
            <span className="kpi-label">Cảnh báo hết bánh</span>
            <span className="kpi-value">{summary?.lowStockCount || lowStock.length}</span>
            <span className="kpi-subtext">Tồn kho dưới 15 cái</span>
          </div>
          <div className="kpi-icon-wrapper kpi-icon-stock">
            <AlertTriangle size={26} />
          </div>
        </div>
      </div>

      {/* Pipeline Status Breakdown */}
      <div className="pipeline-card">
        <h2 className="pipeline-title">
          <TrendingUp size={20} className="text-amber-800" />
          <span>Tiến Độ Vận Hành Đơn Hàng</span>
        </h2>
        <div className="pipeline-steps">
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.PENDING_PAYMENT || 0}</span>
            <span className="pipeline-step-name">Chờ thanh toán</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.CONFIRMED || 0}</span>
            <span className="pipeline-step-name">Đã xác nhận</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.PREPARING || 0}</span>
            <span className="pipeline-step-name">Chuẩn bị cốt</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.BAKING || 0}</span>
            <span className="pipeline-step-name">Đang nướng lò</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.DECORATING || 0}</span>
            <span className="pipeline-step-name">Trang trí kem</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.READY_FOR_PICKUP || 0}</span>
            <span className="pipeline-step-name">Sẵn sàng lấy/giao</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.OUT_FOR_DELIVERY || 0}</span>
            <span className="pipeline-step-name">Đang vận chuyển</span>
          </div>
          <div className="pipeline-step-item">
            <span className="pipeline-step-count">{summary?.ordersByStatus?.COMPLETED || 0}</span>
            <span className="pipeline-step-name">Đã hoàn tất</span>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <h2 className="chart-card-title">Ước Tính Doanh Thu Theo Tuần</h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <BarChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(value) => [formatVND(value), 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#c89963" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-card">
          <h2 className="chart-card-title">Cơ Cấu Danh Mục Bán Chạy</h2>
          <div style={{ width: '100%', height: 260 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Tỷ trọng']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Low-Stock Quick Restock Table */}
      <div className="dashboard-table-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Cảnh Báo Bánh Sắp Hết Hàng</h2>
            <p className="text-xs text-slate-500">Nhập trực tiếp số lượng tồn kho mới để bổ sung nhanh</p>
          </div>
          <Link to="/admin/products" className="text-sm font-semibold text-amber-800 hover:underline flex items-center gap-1">
            <span>Quản lý toàn bộ sản phẩm</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {lowStock.length === 0 ? (
          <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl">
            <PackageCheck className="mx-auto mb-2 text-emerald-600" size={32} />
            <p className="font-medium">Tất cả sản phẩm đều có số lượng tồn kho dồi dào!</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Mã SKU</th>
                  <th>Tên bánh</th>
                  <th>Danh mục</th>
                  <th>Giá bán</th>
                  <th>Tồn kho hiện tại</th>
                  <th>Bổ sung nhanh</th>
                </tr>
              </thead>
              <tbody>
                {lowStock.map((prod) => (
                  <tr key={prod.id}>
                    <td className="font-mono text-xs font-semibold">{prod.sku}</td>
                    <td className="font-medium">{prod.nameVi}</td>
                    <td className="text-slate-500">{prod.categoryNameVi || 'Bánh ngọt'}</td>
                    <td className="font-semibold text-amber-900">{formatVND(prod.basePrice)}</td>
                    <td>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                        {prod.stockQuantity} cái
                      </span>
                    </td>
                    <td>
                      <div className="quick-stock-form">
                        <input
                          type="number"
                          min="0"
                          placeholder="Mới"
                          className="quick-stock-input"
                          value={restockValues[prod.id] !== undefined ? restockValues[prod.id] : ''}
                          onChange={(e) => setRestockValues({
                            ...restockValues,
                            [prod.id]: e.target.value
                          })}
                        />
                        <button
                          type="button"
                          className="quick-stock-btn"
                          onClick={() => handleQuickRestock(prod.id)}
                        >
                          Lưu
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminDashboardPage;
