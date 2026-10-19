import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  DollarSign, 
  User, 
  Phone, 
  Mail, 
  Edit3, 
  CheckCircle2, 
  X,
  Send,
  ExternalLink,
  ChefHat
} from 'lucide-react';
import { customCakeService } from '../../services/customCakeService';
import { useToastStore } from '../../store/useToastStore';
import './AdminCustomCakesPage.css';

const STATUS_TABS = [
  { key: 'ALL', label: 'Tất cả yêu cầu' },
  { key: 'SUBMITTED', label: 'Chờ báo giá' },
  { key: 'QUOTED', label: 'Đã báo giá' },
  { key: 'ACCEPTED', label: 'Khách đồng ý' },
  { key: 'IN_PRODUCTION', label: 'Đang làm bánh' },
  { key: 'COMPLETED', label: 'Hoàn tất' },
  { key: 'REJECTED', label: 'Từ chối' },
];

export const AdminCustomCakesPage = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [quoteModalRequest, setQuoteModalRequest] = useState(null);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteNotes, setQuoteNotes] = useState('');
  const [submittingQuote, setSubmittingQuote] = useState(false);
  const { addToast } = useToastStore();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const data = await customCakeService.getAdminCustomCakes({
        page,
        size: 15,
        status: statusFilter,
      });
      setRequests(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      addToast(err.message || 'Không thể tải danh sách bánh thiết kế', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [statusFilter, page]);

  const handleOpenQuotation = (req) => {
    setQuoteModalRequest(req);
    setQuoteAmount(req.quotationAmount || '');
    setQuoteNotes(req.adminQuotationNotes || 'Đã bao gồm hộp quà cao cấp, hoa trang trí và nến số');
  };

  const handleQuotationSubmit = async (e) => {
    e.preventDefault();
    if (!quoteAmount || parseFloat(quoteAmount) <= 0) {
      addToast('Vui lòng nhập số tiền báo giá hợp lệ', 'error');
      return;
    }

    setSubmittingQuote(true);
    try {
      await customCakeService.submitQuotation(quoteModalRequest.id, {
        quotationAmount: parseFloat(quoteAmount),
        adminNotes: quoteNotes,
      });
      addToast('Gửi báo giá đến khách hàng thành công!', 'success');
      setQuoteModalRequest(null);
      fetchRequests();
    } catch (err) {
      addToast(err.message || 'Lỗi gửi báo giá', 'error');
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleUpdateStatus = async (id, nextStatus) => {
    try {
      await customCakeService.updateRequestStatus(id, nextStatus);
      addToast(`Cập nhật trạng thái thành công: ${nextStatus}`, 'success');
      fetchRequests();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật trạng thái', 'error');
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED': return 'bg-amber-100 text-amber-800';
      case 'QUOTED': return 'bg-blue-100 text-blue-800';
      case 'ACCEPTED': return 'bg-emerald-100 text-emerald-800';
      case 'IN_PRODUCTION': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-emerald-100 text-emerald-800';
      case 'REJECTED': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  return (
    <div className="custom-cakes-admin-root">
      {/* Header & Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Quản Lý Bánh Thiết Kế & Báo Giá (Bespoke Atelier)
          </h1>
          <p className="text-xs text-slate-500">
            Tiếp nhận yêu cầu từ khách hàng, tính toán chi phí và phản hồi báo giá
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-xl border border-slate-200">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setStatusFilter(tab.key);
                setPage(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === tab.key ? 'bg-amber-800 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <Sparkles size={40} className="mx-auto mb-2 text-slate-300" />
          <p className="font-semibold text-slate-700">Không có yêu cầu bánh thiết kế nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map((req) => (
            <div key={req.id} className="custom-cake-card">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-slate-900">
                    {req.requestNumber}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge(req.status)}`}>
                    {req.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    Ngày gửi: {req.createdAt ? new Date(req.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                  </span>
                </div>

                {req.quotationAmount && (
                  <div className="text-base font-bold text-amber-900">
                    Báo giá: {formatVND(req.quotationAmount)}
                  </div>
                )}
              </div>

              {/* Customer Contact */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-medium text-slate-800">
                  <User size={14} className="text-slate-400" />
                  <span>{req.customerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={14} className="text-slate-400" />
                  <span>{req.customerPhone || 'Chưa cung cấp SĐT'}</span>
                </div>
                {req.customerEmail && (
                  <div className="flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    <span>{req.customerEmail}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold">
                  <Calendar size={14} />
                  <span>Hẹn nhận: {req.preferredDate} ({req.preferredTime || 'Trong ngày'})</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="cake-spec-grid">
                <div className="spec-badge">
                  <span>Dáng bánh:</span>
                  <strong>{req.shape}</strong>
                </div>
                <div className="spec-badge">
                  <span>Kích thước:</span>
                  <strong>{req.sizeServings}</strong>
                </div>
                <div className="spec-badge">
                  <span>Cốt bánh & Kem:</span>
                  <strong>{req.cakeType}</strong>
                </div>
                <div className="spec-badge">
                  <span>Nhân bánh:</span>
                  <strong>{req.filling}</strong>
                </div>
                <div className="spec-badge">
                  <span>Tone màu:</span>
                  <strong>{req.colorTheme}</strong>
                </div>
                <div className="spec-badge">
                  <span>Chữ viết lên bánh:</span>
                  <strong className="italic text-amber-900">"{req.pipingMessage}"</strong>
                </div>
              </div>

              {/* Special Instructions & Reference Photo */}
              {(req.specialInstructions || req.referenceImageUrl) && (
                <div className="text-xs bg-amber-50/70 p-3 rounded-lg border border-amber-100 flex flex-col gap-1.5">
                  {req.specialInstructions && (
                    <div>
                      <strong className="text-amber-900">Dặn dò của khách:</strong> {req.specialInstructions}
                    </div>
                  )}
                  {req.referenceImageUrl && (
                    <div className="flex items-center gap-2">
                      <strong className="text-amber-900">Ảnh mẫu khách gửi:</strong>
                      <a
                        href={req.referenceImageUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-800 underline flex items-center gap-1"
                      >
                        <span>Xem ảnh</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <div className="text-xs text-slate-500">
                  {req.adminQuotationNotes && (
                    <span>Ghi chú báo giá: <em>{req.adminQuotationNotes}</em></span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'SUBMITTED' && (
                    <button
                      onClick={() => handleOpenQuotation(req)}
                      className="px-4 py-2 bg-amber-800 text-white rounded-lg text-xs font-semibold hover:bg-amber-900 flex items-center gap-1"
                    >
                      <DollarSign size={14} />
                      <span>Gửi Báo Giá Ngay</span>
                    </button>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'IN_PRODUCTION')}
                      className="px-4 py-2 bg-purple-700 text-white rounded-lg text-xs font-semibold hover:bg-purple-800 flex items-center gap-1"
                    >
                      <ChefHat size={14} />
                      <span>Chuyển Vào Bếp Làm Bánh</span>
                    </button>
                  )}

                  {req.status === 'IN_PRODUCTION' && (
                    <button
                      onClick={() => handleUpdateStatus(req.id, 'COMPLETED')}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800 flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} />
                      <span>Hoàn Tất & Sẵn Sàng Giao</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quotation Dialog Modal */}
      {quoteModalRequest && (
        <div className="admin-modal-overlay" onClick={() => setQuoteModalRequest(null)}>
          <div className="admin-modal-card" style={{ maxWidth: 520 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="text-base font-bold text-slate-800">
                Gửi Báo Giá Bánh Thiết Kế - {quoteModalRequest.requestNumber}
              </h2>
              <button onClick={() => setQuoteModalRequest(null)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleQuotationSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tổng Số Tiền Báo Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="10000"
                  required
                  placeholder="850000"
                  value={quoteAmount}
                  onChange={(e) => setQuoteAmount(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ghi chú báo giá & Tư vấn của Bếp trưởng
                </label>
                <textarea
                  rows={3}
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setQuoteModalRequest(null)}
                  className="px-4 py-2 border rounded-lg text-sm text-slate-600"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={submittingQuote}
                  className="px-5 py-2 bg-amber-800 text-white rounded-lg text-sm font-semibold hover:bg-amber-900 disabled:opacity-50"
                >
                  {submittingQuote ? 'Đang gửi...' : 'Xác Nhận & Gửi Báo Giá'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCustomCakesPage;
