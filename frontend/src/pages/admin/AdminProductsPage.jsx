import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  X,
  Package,
  Layers,
  Sparkles
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { useToastStore } from '../../store/useToastStore';
import './AdminProductsPage.css';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categorySlug, setCategorySlug] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { addToast } = useToastStore();

  const [formData, setFormData] = useState({
    sku: '',
    slug: '',
    nameVi: '',
    nameEn: '',
    categorySlug: '',
    basePrice: '',
    promotionalPrice: '',
    stockQuantity: 20,
    leadTimeHours: 2,
    shelfLifeDays: 3,
    storageInstructions: 'Bảo quản ngăn mát tủ lạnh (2-6°C)',
    ingredientsVi: '',
    imageUrl: '',
    featured: false,
    active: true,
  });

  const fetchCategories = async () => {
    try {
      const data = await adminService.getAdminCategories();
      setCategories(data || []);
      if (data?.length > 0 && !formData.categorySlug) {
        setFormData((prev) => ({ ...prev, categorySlug: data[0].slug }));
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await adminService.getAdminProducts({
        page,
        size: 15,
        search,
        categorySlug,
      });
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      addToast(err.message || 'Không thể tải danh sách sản phẩm', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, categorySlug]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
    fetchProducts();
  };

  const handleToggleStatus = async (productId) => {
    try {
      await adminService.toggleProductStatus(productId);
      addToast('Cập nhật trạng thái hiển thị thành công', 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Không thể cập nhật trạng thái', 'error');
    }
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      sku: `CAKE-${Date.now().toString().slice(-4)}`,
      slug: `banh-moi-${Date.now().toString().slice(-4)}`,
      nameVi: '',
      nameEn: '',
      categorySlug: categories[0]?.slug || 'birthday-cakes',
      basePrice: '',
      promotionalPrice: '',
      stockQuantity: 25,
      leadTimeHours: 2,
      shelfLifeDays: 3,
      storageInstructions: 'Bảo quản ngăn mát tủ lạnh (2-6°C)',
      ingredientsVi: 'Bột mì Pháp, bơ lạt Elle & Vire, kem tươi Anchor, trứng gà tươi',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      featured: false,
      active: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (prod) => {
    setEditingProduct(prod);
    setFormData({
      sku: prod.sku,
      slug: prod.slug,
      nameVi: prod.nameVi,
      nameEn: prod.nameEn,
      categorySlug: prod.categorySlug || categories[0]?.slug,
      basePrice: prod.basePrice,
      promotionalPrice: prod.promotionalPrice || '',
      stockQuantity: prod.stockQuantity,
      leadTimeHours: prod.leadTimeHours,
      shelfLifeDays: 3,
      storageInstructions: 'Bảo quản mát 2-6°C',
      ingredientsVi: 'Bột mì thượng hạng, bơ Pháp, trứng, sữa tươi',
      imageUrl: prod.thumbnailUrl || '',
      featured: prod.featured || false,
      active: prod.active !== false,
    });
    setModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nameVi || !formData.nameEn || !formData.basePrice) {
      addToast('Vui lòng điền đủ tên bánh và giá bán', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        promotionalPrice: formData.promotionalPrice ? parseFloat(formData.promotionalPrice) : null,
        stockQuantity: parseInt(formData.stockQuantity, 10),
        leadTimeHours: parseInt(formData.leadTimeHours, 10),
        shelfLifeDays: parseInt(formData.shelfLifeDays, 10),
        images: formData.imageUrl ? [{
          imageUrl: formData.imageUrl,
          altText: formData.nameVi,
          thumbnail: true,
          displayOrder: 1
        }] : []
      };

      if (editingProduct) {
        await adminService.updateProduct(editingProduct.id, payload);
        addToast('Cập nhật thông tin bánh thành công!', 'success');
      } else {
        await adminService.createProduct(payload);
        addToast('Tạo mới sản phẩm thành công!', 'success');
      }

      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Lỗi lưu sản phẩm', 'error');
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
    <div className="products-page-root">
      {/* Page Header Toolbar */}
      <div className="products-toolbar">
        <form onSubmit={handleSearchSubmit} className="products-filters">
          <div className="search-input-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Tìm theo tên bánh, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="category-select"
            value={categorySlug}
            onChange={(e) => {
              setCategorySlug(e.target.value);
              setPage(0);
            }}
          >
            <option value="">Tất cả danh mục ({categories.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.nameVi} ({c.nameEn})
              </option>
            ))}
          </select>
        </form>

        <button onClick={openAddModal} className="add-product-btn">
          <Plus size={18} />
          <span>Thêm Bánh Mới</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="products-table-card">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-800"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-slate-500">
            <Package size={40} className="mx-auto mb-2 text-slate-400" />
            <p className="font-semibold text-slate-700">Không tìm thấy sản phẩm nào</p>
            <p className="text-xs text-slate-400 mt-1">Hãy thử tìm với từ khoá khác hoặc tạo mới sản phẩm</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Tên bánh (Vi / En)</th>
                  <th>Mã SKU</th>
                  <th>Danh mục</th>
                  <th>Giá niêm yết</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.id}>
                    <td>
                      <img
                        src={prod.thumbnailUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=150&q=80'}
                        alt={prod.nameVi}
                        className="product-thumb"
                      />
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900">{prod.nameVi}</div>
                      <div className="text-xs text-slate-400 italic">{prod.nameEn}</div>
                    </td>
                    <td className="font-mono text-xs">{prod.sku}</td>
                    <td>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                        {prod.categoryNameVi || 'Bánh ngọt'}
                      </span>
                    </td>
                    <td>
                      <div className="font-semibold text-amber-900">{formatVND(prod.basePrice)}</div>
                      {prod.promotionalPrice && (
                        <div className="text-xs text-emerald-600 line-through">
                          {formatVND(prod.promotionalPrice)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        prod.stockQuantity > 10 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {prod.stockQuantity} cái
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleStatus(prod.id)}
                        className={`badge-status ${prod.active !== false ? 'badge-active' : 'badge-inactive'}`}
                        title="Bấm để đổi trạng thái"
                      >
                        {prod.active !== false ? 'Đang bán' : 'Tạm ẩn'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="action-btn"
                          title="Sửa thông tin bánh"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
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
                Trang trước
              </button>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 text-xs border rounded disabled:opacity-40"
              >
                Trang sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="admin-modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="text-lg font-bold text-slate-800">
                {editingProduct ? 'Chỉnh Sửa Thông Tin Bánh' : 'Thêm Bánh Mới Vào Cửa Hàng'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="admin-modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mã SKU *</label>
                    <input
                      type="text"
                      required
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Tên bánh (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      placeholder="VD: Bánh Kem Dâu Tây Thượng Hạng"
                      value={formData.nameVi}
                      onChange={(e) => setFormData({ ...formData, nameVi: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Tên bánh (English) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Strawberry Shortcake"
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Danh mục bánh *</label>
                    <select
                      value={formData.categorySlug}
                      onChange={(e) => setFormData({ ...formData, categorySlug: e.target.value })}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.slug}>
                          {c.nameVi} ({c.nameEn})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Số lượng tồn kho ban đầu *</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Giá niêm yết (VNĐ) *</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      required
                      placeholder="350000"
                      value={formData.basePrice}
                      onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Giá ưu đãi (VNĐ, nếu có)</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="320000"
                      value={formData.promotionalPrice}
                      onChange={(e) => setFormData({ ...formData, promotionalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Thời gian chuẩn bị (Giờ)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.leadTimeHours}
                      onChange={(e) => setFormData({ ...formData, leadTimeHours: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Hạn sử dụng (Ngày)</label>
                    <input
                      type="number"
                      min="1"
                      value={formData.shelfLifeDays}
                      onChange={(e) => setFormData({ ...formData, shelfLifeDays: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Đường dẫn ảnh đại diện (Image URL)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Thành phần chính</label>
                  <textarea
                    rows={2}
                    value={formData.ingredientsVi}
                    onChange={(e) => setFormData({ ...formData, ingredientsVi: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 border rounded-lg text-slate-600 font-medium hover:bg-slate-50"
                >
                  Huỷ bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-amber-800 text-white rounded-lg font-medium hover:bg-amber-900 disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : editingProduct ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminProductsPage;
