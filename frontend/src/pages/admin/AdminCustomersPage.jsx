import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  ShoppingBag, 
  CreditCard, 
  CheckCircle,
  Calendar
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import './AdminCustomersPage.css';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToastStore();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminCustomers({
        page,
        size: 15,
        search,
      });
      setCustomers(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      addToast(err.message || 'Không thể tải danh sách khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchCustomers();
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <div className="customers-page-root">
      {/* Toolbar */}
      <div className="customers-toolbar">
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative w-80">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm outline-none focus:border-amber-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-900"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="text-xs text-slate-500 font-medium">
          Tổng thành viên: <strong className="text-slate-800">{customers.length}</strong> khách hàng
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Users size={40} className="mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-slate-700">Chưa có khách hàng nào</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Email</th>
                  <th>Tổng đơn đã đặt</th>
                  <th>Tổng chi tiêu</th>
                  <th>Ngày đăng ký</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="customer-avatar">
                          {c.fullName ? c.fullName.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{c.fullName || 'Khách hàng'}</div>
                          <div className="text-xs text-slate-400">ID: {c.id.slice(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-700 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        <span>{c.phoneNumber || 'Chưa cập nhật'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                        <Mail size={14} className="text-slate-400" />
                        <span>{c.email}</span>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <ShoppingBag size={14} className="text-amber-700" />
                        <span>{c.totalOrders || 0} đơn</span>
                      </span>
                    </td>
                    <td>
                      <span className="font-bold text-amber-900">
                        {formatVND(c.totalSpent)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <Calendar size={13} className="text-slate-400" />
                        <span>{c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : 'Mới'}</span>
                      </div>
                    </td>
                    <td>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        <CheckCircle size={12} />
                        <span>Hoạt động</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <span className="text-xs text-slate-500">
              Trang {page + 1} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 text-xs border rounded disabled:opacity-40"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-xs border rounded disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminCustomersPage;
