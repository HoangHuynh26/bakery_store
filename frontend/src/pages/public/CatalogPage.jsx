import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../../services/catalogService';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  Filter, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  Sparkles,
  Search
} from 'lucide-react';
import './CatalogPage.css';

const PRICE_PRESETS = [
  { label: 'Tất cả mức giá', min: null, max: null },
  { label: 'Dưới 100.000₫', min: null, max: 100000 },
  { label: '100.000₫ – 300.000₫', min: 100000, max: 300000 },
  { label: '300.000₫ – 600.000₫', min: 300000, max: 600000 },
  { label: 'Trên 600.000₫', min: 600000, max: null },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'price_asc', label: 'Giá: Thấp đến Cao' },
  { value: 'price_desc', label: 'Giá: Cao đến Thấp' },
  { value: 'popularity', label: 'Phổ biến nhất' },
];

export const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || '';
  const currentSort = searchParams.get('sort') || 'newest';
  const currentPage = parseInt(searchParams.get('page') || '0', 10);
  const currentSearch = searchParams.get('q') || '';
  const [selectedPriceIdx, setSelectedPriceIdx] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => catalogService.getCategories(),
  });

  // 2. Fetch products
  const selectedPrice = PRICE_PRESETS[selectedPriceIdx];
  const { data: productsData, isLoading, isError } = useQuery({
    queryKey: [
      'products',
      currentCategory,
      currentSort,
      currentPage,
      currentSearch,
      selectedPrice.min,
      selectedPrice.max,
    ],
    queryFn: () =>
      catalogService.getProducts({
        category: currentCategory || undefined,
        sort: currentSort,
        page: currentPage,
        size: 12,
        q: currentSearch || undefined,
        minPrice: selectedPrice.min || undefined,
        maxPrice: selectedPrice.max || undefined,
      }),
  });

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 0;
  const totalElements = productsData?.totalElements || 0;

  const handleCategorySelect = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set('category', slug);
    } else {
      next.delete('category');
    }
    next.set('page', '0');
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set('sort', e.target.value);
    next.set('page', '0');
    setSearchParams(next);
  };

  const handlePageChange = (newPage) => {
    const next = new URLSearchParams(searchParams);
    next.set('page', newPage.toString());
    setSearchParams(next);
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setSelectedPriceIdx(0);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="badge-luxury">Thực Đơn Pâtisserie</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-bakery-espresso">
          Tuyệt Tác Bánh Ngọt Thủ Công
        </h1>
        <p className="text-sm text-stone-600 font-light">
          Thưởng thức 16 dòng bánh Pháp và Ý cao cấp nướng mới mỗi ngày từ nguyên liệu thượng hạng.
        </p>
      </div>

      {/* Category Pills Navigation (Horizontal Scrollable) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleCategorySelect('')}
          className={`category-pill ${!currentCategory ? 'active' : ''}`}
        >
          Tất Cả ({categories.length} danh mục)
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.slug)}
            className={`category-pill ${currentCategory === cat.slug ? 'active' : ''}`}
          >
            {cat.nameVi}
          </button>
        ))}
      </div>

      {/* Filter & Sort Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 border-y border-stone-200">
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="flex items-center gap-2 text-sm font-semibold text-bakery-espresso hover:text-bakery-caramel transition"
          >
            <SlidersHorizontal className="w-4 h-4 text-bakery-caramel" />
            <span>Bộ Lọc ({totalElements} sản phẩm)</span>
          </button>

          {(currentCategory || currentSearch || selectedPriceIdx > 0) && (
            <button
              onClick={resetAllFilters}
              className="text-xs text-red-600 hover:underline flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs text-stone-500 whitespace-nowrap">Sắp xếp theo:</span>
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs font-medium text-bakery-espresso focus:outline-none focus:border-bakery-caramel"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar (Desktop & Mobile Drawer) */}
        <div className={`lg:col-span-1 space-y-6 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="filter-sidebar space-y-6">
            <h3 className="font-serif text-base font-bold text-bakery-espresso flex items-center justify-between">
              <span>Khoảng Giá</span>
            </h3>

            {/* Price Presets */}
            <div className="space-y-2">
              {PRICE_PRESETS.map((preset, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer hover:text-bakery-caramel transition"
                >
                  <input
                    type="radio"
                    name="priceFilter"
                    checked={selectedPriceIdx === idx}
                    onChange={() => setSelectedPriceIdx(idx)}
                    className="accent-bakery-caramel"
                  />
                  <span>{preset.label}</span>
                </label>
              ))}
            </div>

            {/* Boutique Commitments */}
            <div className="pt-6 border-t border-stone-100 space-y-3 text-xs text-stone-500 font-light">
              <p className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
                <span>100% bơ Pháp chuẩn AOP Normandy</span>
              </p>
              <p className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
                <span>Giao hỏa tốc 2 giờ tại Sài Gòn</span>
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white rounded-2xl h-80 border border-stone-100" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
              <p className="text-sm text-stone-600 mb-4">Không thể tải danh sách sản phẩm lúc này.</p>
              <button onClick={() => window.location.reload()} className="btn-primary text-xs px-6 py-2.5">
                Tải Lại Trang
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-bakery-ivory flex items-center justify-center text-bakery-caramel mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-xl font-bold text-bakery-espresso">
                Không tìm thấy món bánh phù hợp
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Hãy thử chọn khoảng giá khác hoặc xem tất cả danh mục bánh của Maison Douce.
              </p>
              <button onClick={resetAllFilters} className="btn-primary text-xs px-6 py-2.5">
                Xem Tất Cả Bánh
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-lg border border-stone-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-50 transition"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition ${
                    currentPage === p
                      ? 'bg-bakery-espresso text-white'
                      : 'border border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {p + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg border border-stone-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-stone-50 transition"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
