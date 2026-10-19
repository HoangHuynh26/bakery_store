import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { wishlistService } from '../../services/wishlistService';
import { formatCurrency } from '../../utils/formatters';
import { Heart, ShoppingBag, Trash2, ArrowRight, Sparkles } from 'lucide-react';
import './WishlistPage.css';

export const WishlistPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addItem } = useCartStore();
  const { addToast } = useToastStore();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadWishlist();
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    setIsLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      setWishlistItems(data || []);
    } catch (err) {
      addToast('Không thể tải danh sách yêu thích.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems((prev) => prev.filter((item) => item.productId !== productId));
      addToast('Đã xóa khỏi danh sách yêu thích.', 'info');
    } catch (err) {
      addToast('Có lỗi xảy ra.', 'error');
    }
  };

  const handleAddToCart = async (item) => {
    try {
      await addItem({ id: item.productId, ...item });
      addToast(`Đã thêm ${item.nameVi || item.nameEn} vào giỏ hàng!`, 'success');
    } catch (err) {
      addToast('Không thể thêm vào giỏ hàng.', 'error');
    }
  };

  return (
    <div className="wishlist-container">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-bakery-cream text-bakery-caramel mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Bộ Sưu Tập Của Bạn
        </span>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-bakery-espresso">
          Danh Sách Bánh Yêu Thích
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Lưu lại những chiếc bánh kem nghệ thuật và món tráng miệng bạn ưng ý nhất để đặt cho những dịp đặc biệt.
        </p>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-xs text-stone-400">
          Đang tải bộ sưu tập của bạn...
        </div>
      ) : wishlistItems.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white rounded-2xl border border-stone-200 max-w-lg mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-bakery-cream/80 text-bakery-caramel flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-bakery-espresso mb-1">
            Danh sách yêu thích đang trống
          </h3>
          <p className="text-xs text-stone-500 max-w-xs mx-auto mb-6">
            Khám phá thực đơn bánh Pháp tinh tế và nhấn biểu tượng trái tim để lưu lại những hương vị say đắm.
          </p>
          <button onClick={() => navigate('/catalog')} className="btn-primary text-xs px-6 py-2.5">
            Khám Phá Menu Bánh
          </button>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item-card flex flex-col">
              <div className="relative aspect-square overflow-hidden bg-stone-100">
                <Link to={`/product/${item.productSlug}`}>
                  <img
                    src={item.primaryImageUrl || '/images/placeholder-cake.jpg'}
                    alt={item.nameVi || item.nameEn}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <button
                  onClick={() => handleRemove(item.productId)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-400 hover:text-red-500 shadow-sm transition"
                  title="Xóa khỏi yêu thích"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-bakery-caramel uppercase tracking-wider block mb-1">
                    {item.categoryNameVi || item.categoryNameEn}
                  </span>
                  <Link
                    to={`/product/${item.productSlug}`}
                    className="font-serif text-sm font-bold text-bakery-espresso hover:text-bakery-caramel line-clamp-1"
                  >
                    {item.nameVi}
                  </Link>
                  <p className="text-[11px] text-stone-400 italic line-clamp-1 mb-2">
                    {item.nameEn}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-bakery-caramel">
                      {formatCurrency(item.promotionalPrice || item.basePrice)}
                    </span>
                    {item.promotionalPrice && (
                      <span className="text-xs text-stone-400 line-through">
                        {formatCurrency(item.basePrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-stone-100">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="btn-primary w-full text-xs py-2 flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Thêm Vào Giỏ Hàng</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
