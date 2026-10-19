import React, { useState, useEffect } from 'react';
import { 
  Boxes, 
  PlusCircle, 
  MinusCircle, 
  AlertTriangle, 
  CheckCircle2, 
  History, 
  X,
  PackagePlus,
  RefreshCw
} from 'lucide-react';
import { customCakeService } from '../../services/customCakeService';
import { useToastStore } from '../../store/useToastStore';
import './AdminInventoryPage.css';

export const AdminInventoryPage = () => {
  const [ingredients, setIngredients] = useState([]);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [adjustType, setAdjustType] = useState('INBOUND');
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustReason, setAdjustReason] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToastStore();

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const [ingData, movData] = await Promise.all([
        customCakeService.getIngredients(),
        customCakeService.getMovements(),
      ]);
      setIngredients(ingData || []);
      setMovements(movData || []);
    } catch (err) {
      addToast(err.message || 'Không thể tải dữ liệu kho nguyên liệu', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, []);

  const openAdjustModal = (ing, type = 'INBOUND') => {
    setSelectedIngredient(ing);
    setAdjustType(type);
    setAdjustQuantity('');
    setAdjustReason(type === 'INBOUND' ? 'Nhập kho lô hàng mới' : 'Xuất kho làm bánh');
    setAdjustModalOpen(true);
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    const qty = parseFloat(adjustQuantity);
    if (isNaN(qty) || qty <= 0) {
      addToast('Vui lòng nhập số lượng hợp lệ lớn hơn 0', 'error');
      return;
    }

    setSubmitting(true);
    try {
      await customCakeService.adjustStock({
        ingredientId: selectedIngredient.id,
        quantity: qty,
        movementType: adjustType,
        reason: adjustReason,
      });
      addToast('Điều chỉnh kho nguyên liệu thành công!', 'success');
      setAdjustModalOpen(false);
      fetchInventoryData();
    } catch (err) {
      addToast(err.message || 'Lỗi cập nhật kho', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  return (
    <div className="inventory-page-root">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-slate-900">
            Kho Nguyên Liệu Bếp Bánh (Raw Ingredients Inventory)
          </h1>
          <p className="text-xs text-slate-500">
            Theo dõi tồn kho bơ Pháp, sữa tươi, bột mì, sô-cô-la Bỉ và xuất nhập nguyên liệu theo thời gian thực
          </p>
        </div>

        <button
          onClick={fetchInventoryData}
          className="px-4 py-2 border rounded-xl bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5"
        >
          <RefreshCw size={14} />
          <span>Cập nhật số liệu</span>
        </button>
      </div>

      {/* Ingredients Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800 text-sm">Danh Mục Nguyên Liệu Tiệm Bánh ({ingredients.length})</h2>
          <span className="text-xs text-slate-400">Đơn vị: kg, lít, quả, hộp</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Mã NL</th>
                  <th>Tên nguyên liệu</th>
                  <th>Đơn vị</th>
                  <th>Tồn kho hiện tại</th>
                  <th>Mức cảnh báo</th>
                  <th>Giá vốn ước tính</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {ingredients.map((ing) => {
                  const percent = Math.min(100, Math.round((ing.currentStock / (ing.minimumThreshold * 3)) * 100));
                  return (
                    <tr key={ing.id}>
                      <td className="font-mono text-xs font-bold text-slate-700">{ing.code}</td>
                      <td>
                        <div className="font-semibold text-slate-900">{ing.name}</div>
                      </td>
                      <td className="text-slate-500 font-medium text-xs">{ing.unit}</td>
                      <td>
                        <div className="font-bold text-slate-900">
                          {ing.currentStock} {ing.unit}
                        </div>
                        <div className="ingredient-stock-bar w-24">
                          <div
                            className={`ingredient-stock-fill ${ing.isLowStock ? 'stock-low' : 'stock-good'}`}
                            style={{ width: `${Math.max(10, percent)}%` }}
                          />
                        </div>
                      </td>
                      <td className="text-xs text-slate-500">{ing.minimumThreshold} {ing.unit}</td>
                      <td className="font-semibold text-amber-900">{formatVND(ing.costPerUnit)} / {ing.unit}</td>
                      <td>
                        {ing.isLowStock ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                            <AlertTriangle size={12} />
                            <span>Sắp hết</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={12} />
                            <span>Đầy đủ</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => openAdjustModal(ing, 'INBOUND')}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
                            title="Nhập thêm hàng"
                          >
                            <PlusCircle size={13} />
                            <span>Nhập</span>
                          </button>
                          <button
                            onClick={() => openAdjustModal(ing, 'PRODUCTION_DEDUCTION')}
                            className="px-2.5 py-1 bg-slate-50 text-slate-700 border border-slate-200 rounded text-xs font-semibold hover:bg-slate-100 flex items-center gap-1"
                            title="Xuất làm bánh"
                          >
                            <MinusCircle size={13} />
                            <span>Xuất</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Movements History */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
        <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
          <History size={16} className="text-amber-800" />
          <span>Sổ Nhật Ký Biến Động Kho Gần Đây</span>
        </h2>
        {movements.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">Chưa có giao dịch biến động nào</p>
        ) : (
          <div className="space-y-2">
            {movements.slice(0, 10).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                    m.movementType === 'INBOUND' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {m.movementType}
                  </span>
                  <span className="font-semibold text-slate-800">{m.ingredient?.name || 'Nguyên liệu'}</span>
                  <span className="text-slate-400">— {m.reason}</span>
                </div>
                <div className="font-mono font-bold text-slate-900">
                  {m.movementType === 'INBOUND' ? '+' : '-'}{m.quantity} {m.ingredient?.unit || ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Adjust Modal */}
      {adjustModalOpen && selectedIngredient && (
        <div className="admin-modal-overlay" onClick={() => setAdjustModalOpen(false)}>
          <div className="admin-modal-card" style={{ maxWidth: 480 }} onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="text-base font-bold text-slate-800">
                Điều Chỉnh Tồn Kho: {selectedIngredient.name}
              </h2>
              <button onClick={() => setAdjustModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAdjustSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Loại Biến Động Kho *
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                >
                  <option value="INBOUND">Nhập Kho (Inbound +)</option>
                  <option value="PRODUCTION_DEDUCTION">Xuất Dùng Làm Bánh (Deduction -)</option>
                  <option value="SPOILAGE">Hao Hụt / Hỏng Hóc (Spoilage -)</option>
                  <option value="MANUAL_ADJUSTMENT">Kiểm Kê Đặt Lại Số Tồn (Manual Count)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Số Lượng ({selectedIngredient.unit}) *
                </label>
                <input
                  type="number"
                  step="0.001"
                  min="0.001"
                  required
                  placeholder="VD: 5.5"
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lý Do Biến Động / Số Hóa Đơn / Ghi Chú
                </label>
                <input
                  type="text"
                  placeholder="VD: Nhập thêm từ nhà cung cấp Anchor..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setAdjustModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-sm text-slate-600"
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-800 text-white rounded-lg text-sm font-semibold hover:bg-amber-900 disabled:opacity-50"
                >
                  {submitting ? 'Đang cập nhật...' : 'Xác Nhận Cập Nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminInventoryPage;
