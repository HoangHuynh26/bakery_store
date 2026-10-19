import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../../services/catalogService';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';
import { ProductCard } from '../../components/product/ProductCard';
import { 
  ShoppingBag, 
  Clock, 
  Calendar, 
  ShieldAlert, 
  Info, 
  CheckCircle2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Sparkles,
  Wheat,
  Milk,
  Egg,
  Wine
} from 'lucide-react';
import './ProductDetailPage.css';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [candlesCount, setCandlesCount] = useState(1);
  const [customMessage, setCustomMessage] = useState('');

  // 1. Fetch product detail
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => catalogService.getProduct(slug),
  });

  // 2. Fetch related products
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', product?.id],
    queryFn: () => catalogService.getRelatedProducts(product.id, 4),
    enabled: !!product?.id,
  });

  // Initialize first variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    } else {
      setSelectedVariant(null);
    }
    setActiveImageIndex(0);
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-pulse">
          <div className="bg-white rounded-3xl aspect-square" />
          <div className="space-y-6">
            <div className="h-8 bg-stone-200 rounded w-3/4" />
            <div className="h-6 bg-stone-200 rounded w-1/4" />
            <div className="h-24 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4 space-y-4">
        <h2 className="font-serif text-2xl font-bold text-bakery-espresso">
          Không tìm thấy món bánh này
        </h2>
        <p className="text-sm text-stone-500">
          Sản phẩm có thể đã được thay đổi hoặc tạm ngưng phục vụ theo mùa.
        </p>
        <Link to="/catalog" className="btn-primary text-xs px-6 py-2.5 inline-block">
          Quay Lại Thực Đơn
        </Link>
      </div>
    );
  }

  const basePrice = Number(product.basePrice);
  const promotionalPrice = product.promotionalPrice ? Number(product.promotionalPrice) : null;
  const priceAdjustment = selectedVariant ? Number(selectedVariant.priceAdjustment || 0) : 0;
  const currentUnitPrice = (promotionalPrice || basePrice) + priceAdjustment;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'default', imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=80', altText: product.nameVi }];

  const handleAddToCart = () => {
    const customization = {
      candles: candlesCount,
      message: customMessage.trim() || null,
    };
    addItemToCart(product, selectedVariant, quantity, customization);
    showToast(`Đã thêm ${quantity}x "${product.nameVi}" vào giỏ hàng!`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-stone-500">
        <Link to="/" className="hover:text-bakery-caramel">Trang Chủ</Link>
        <span>/</span>
        <Link to="/catalog" className="hover:text-bakery-caramel">Thực Đơn</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link to={`/catalog?category=${product.category.slug}`} className="hover:text-bakery-caramel">
              {product.category.nameVi}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-bakery-espresso font-semibold truncate">{product.nameVi}</span>
      </nav>

      {/* Main Product Specification Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Gallery Showcase */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white shadow-soft border border-stone-100">
            <img
              src={images[activeImageIndex]?.imageUrl}
              alt={images[activeImageIndex]?.altText || product.nameVi}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails Row */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div
                  key={img.id || idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`gallery-thumb w-20 h-20 ${activeImageIndex === idx ? 'active' : ''}`}
                >
                  <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {product.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-bakery-caramel">
                {product.category.nameVi}
              </span>
            )}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso mt-1 leading-tight">
              {product.nameVi}
            </h1>
            <p className="text-sm text-stone-500 italic font-light mt-0.5">
              {product.nameEn} • SKU: {product.sku}
            </p>
          </div>

          {/* Price Display */}
          <div className="flex items-baseline gap-3 py-2 border-y border-stone-100">
            <span className="font-serif text-3xl font-bold text-bakery-espresso">
              {formatCurrency(currentUnitPrice)}
            </span>
            {promotionalPrice && (
              <span className="text-sm text-stone-400 line-through">
                {formatCurrency(basePrice + priceAdjustment)}
              </span>
            )}
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
              Còn hàng (Sẵn sàng phục vụ)
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-stone-600 leading-relaxed font-light">
            {product.descriptionVi}
          </p>

          {/* Variants Selection (if available) */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-bakery-espresso">
                Kích Thước & Khẩu Phần Phục Vụ
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.variants.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`variant-btn ${selectedVariant?.id === v.id ? 'selected' : ''}`}
                  >
                    <p className="text-xs font-bold text-bakery-espresso">{v.nameVi}</p>
                    <p className="text-[11px] text-stone-500">
                      {v.servingCount} {v.priceAdjustment > 0 && `(+${formatCurrency(v.priceAdjustment)})`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Cake Message / Candles option */}
          <div className="bg-bakery-ivory p-4 rounded-2xl border border-bakery-caramel/20 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-bakery-espresso">
              <Sparkles className="w-3.5 h-3.5 text-bakery-caramel" />
              <span>Ghi Lời Chúc Lên Bánh (Miễn Phí)</span>
            </div>
            <input
              type="text"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="VD: Chúc Mừng Sinh Nhật Lan Anh 25 Tuổi!"
              className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 text-xs focus:outline-none focus:border-bakery-caramel"
              maxLength={80}
            />
            <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
              <span>Số lượng nến tặng kèm:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCandlesCount(Math.max(0, candlesCount - 1))}
                  className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center font-bold"
                >
                  -
                </button>
                <span className="font-bold text-bakery-espresso">{candlesCount} cây</span>
                <button
                  type="button"
                  onClick={() => setCandlesCount(Math.min(20, candlesCount + 1))}
                  className="w-6 h-6 rounded bg-white border border-stone-300 flex items-center justify-center font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart Action */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-stone-300 rounded-full bg-white px-3 py-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-1 text-stone-500 hover:text-bakery-espresso"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-bold text-bakery-espresso">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-1 text-stone-500 hover:text-bakery-espresso"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 text-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Thêm Vào Giỏ — {formatCurrency(currentUnitPrice * quantity)}</span>
            </button>
          </div>

          {/* Operational & Dietary Notice */}
          <div className="space-y-2 pt-4 border-t border-stone-100 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
              <span>
                Thời gian chuẩn bị: <strong>{product.leadTimeHours} giờ</strong> (để bánh luôn tươi mới).
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
              <span>
                Hạn sử dụng: <strong>{product.shelfLifeDays} ngày</strong> trong ngăn mát tủ lạnh.
              </span>
            </div>
            {product.storageInstructions && (
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
                <span>Bảo quản: {product.storageInstructions}</span>
              </div>
            )}
          </div>

          {/* Allergen Information */}
          {product.allergens && product.allergens.length > 0 && (
            <div className="pt-2 space-y-2">
              <p className="text-xs font-bold text-bakery-espresso flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                <span>Thông Tin Dị Ứng / Thành Phần Cần Lưu Ý:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.allergens.map((al) => (
                  <span key={al.id} className="allergen-chip">
                    {al.code === 'GLUTEN' && <Wheat className="w-3 h-3 text-amber-700" />}
                    {al.code === 'DAIRY' && <Milk className="w-3 h-3 text-sky-700" />}
                    {al.code === 'EGGS' && <Egg className="w-3 h-3 text-orange-600" />}
                    {al.code === 'ALCOHOL' && <Wine className="w-3 h-3 text-purple-700" />}
                    <span>{al.nameVi}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-stone-200">
          <div>
            <div className="badge-luxury mb-1">Gợi Ý Thêm</div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bakery-espresso">
              Món Bánh Cùng Dòng Bạn Sẽ Thích
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
