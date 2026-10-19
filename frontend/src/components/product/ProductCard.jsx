import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, Star, Clock } from 'lucide-react';
import './ProductCard.css';

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    addItemToCart(product, null, 1);
    showToast(`Đã thêm "${product.nameVi}" vào giỏ hàng!`, 'success');
  };

  const effectivePrice = product.promotionalPrice || product.basePrice;

  return (
    <div className="product-card-container cursor-pointer group" onClick={handleCardClick}>
      {/* Visual Thumbnail */}
      <div className="product-image-wrap">
        <img
          src={product.thumbnailUrl || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80'}
          alt={product.nameVi}
          loading="lazy"
        />

        {product.dietaryTags && (
          <span className="tag-badge">
            {product.dietaryTags.split(',')[0]}
          </span>
        )}

        {product.leadTimeHours > 2 && (
          <span className="absolute bottom-2.5 right-2.5 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3 text-bakery-caramel" />
            <span>Đặt trước {product.leadTimeHours}h</span>
          </span>
        )}
      </div>

      {/* Information Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {product.categoryNameVi && (
            <p className="text-[11px] uppercase tracking-wider text-bakery-caramel font-semibold mb-1">
              {product.categoryNameVi}
            </p>
          )}

          <h3 className="font-semibold text-sm sm:text-base text-bakery-espresso group-hover:text-bakery-caramel transition line-clamp-1">
            {product.nameVi}
          </h3>
          <p className="text-xs text-stone-500 italic font-light truncate mt-0.5">
            {product.nameEn}
          </p>
        </div>

        {/* Pricing & Add to Cart */}
        <div className="flex items-end justify-between pt-2 border-t border-stone-100">
          <div>
            <div className="font-serif text-base sm:text-lg font-bold text-bakery-espresso">
              {formatCurrency(effectivePrice)}
            </div>
            {product.promotionalPrice && (
              <span className="text-[11px] text-stone-400 line-through">
                {formatCurrency(product.basePrice)}
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className="quick-add-btn"
            aria-label={`Thêm ${product.nameVi} vào giỏ`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
