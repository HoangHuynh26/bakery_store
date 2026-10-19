import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useToastStore } from '../../store/useToastStore';
import { formatCurrency } from '../../utils/formatters';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShoppingBag, 
  Heart, 
  ChevronRight, 
  Clock, 
  ShieldCheck, 
  Award,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import './HomePage.css';

// Featured categories for initial view
const FEATURED_CATEGORIES = [
  {
    id: 'birthday-cakes',
    slug: 'birthday-cakes',
    nameVi: 'Bánh Kem Sinh Nhật',
    nameEn: 'Birthday Cakes',
    count: '12 mẫu bánh',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'tiramisu',
    slug: 'tiramisu',
    nameVi: 'Tiramisu Ý Cổ Điển',
    nameEn: 'Venetian Tiramisu',
    count: '6 vị đặc trưng',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cream-puffs',
    slug: 'cream-puffs',
    nameVi: 'Bánh Su Kem Choux',
    nameEn: 'Choux Craquelin',
    count: '8 hương vị',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cheesecakes',
    slug: 'cheesecakes',
    nameVi: 'Basque Burnt Cheesecake',
    nameEn: 'Artisan Cheesecakes',
    count: '5 kích cỡ',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'croissants',
    slug: 'croissants',
    nameVi: 'Croissant Bơ Pháp AOP',
    nameEn: 'French Viennoiserie',
    count: 'Nướng mới 06:00',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'macarons',
    slug: 'macarons',
    nameVi: 'Macaron Di Sản Paris',
    nameEn: 'Parisian Macarons',
    count: 'Hộp quà sang trọng',
    image: 'https://images.unsplash.com/photo-1569864321390-3330e7041fa9?auto=format&fit=crop&w=600&q=80',
  },
];

// Highlight signature bestsellers
const SIGNATURE_PRODUCTS = [
  {
    id: 'b0000001-0000-0000-0000-000000000001',
    sku: 'CAKE-BDAY-01',
    slug: 'fraisier-vanilla-strawberry-cake',
    nameVi: 'Bánh Kem Dâu Tây Fraisier Hoàng Gia',
    nameEn: 'Fraisier Royal Strawberry Cake',
    categoryName: 'Bánh Sinh Nhật',
    basePrice: 450000,
    promotionalPrice: 420000,
    rating: 5.0,
    reviewCount: 38,
    leadTimeHours: 4,
    dietaryTag: 'Dâu Tây Đà Lạt Tươi',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b0000005-0000-0000-0000-000000000005',
    sku: 'TIRA-01',
    slug: 'traditional-venetian-tiramisu-box',
    nameVi: 'Tiramisu Venice Cổ Điển Hộp Thiếc',
    nameEn: 'Traditional Venetian Tiramisu Box',
    categoryName: 'Tiramisu',
    basePrice: 260000,
    promotionalPrice: 240000,
    rating: 4.9,
    reviewCount: 52,
    leadTimeHours: 2,
    dietaryTag: 'Mascarpone Galbani Ý',
    imageUrl: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b0000007-0000-0000-0000-000000000007',
    sku: 'CHOUX-01',
    slug: 'vanilla-craquelin-choux-box-6',
    nameVi: 'Hộp 6 Bánh Su Kem Choux Vani Madagascar',
    nameEn: 'Vanilla Craquelin Choux (Box of 6)',
    categoryName: 'Su Kem Choux',
    basePrice: 180000,
    promotionalPrice: 165000,
    rating: 4.9,
    reviewCount: 44,
    leadTimeHours: 1,
    dietaryTag: 'Vani Bourbon Tự Nhiên',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'b0000010-0000-0000-0000-000000000010',
    sku: 'CHEESE-01',
    slug: 'san-sebastian-basque-burnt-cheesecake',
    nameVi: 'Bánh Cheesecake Cháy San Sebastián',
    nameEn: 'San Sebastián Basque Burnt Cheesecake',
    categoryName: 'Cheesecake',
    basePrice: 480000,
    promotionalPrice: 450000,
    rating: 5.0,
    reviewCount: 67,
    leadTimeHours: 3,
    dietaryTag: 'Lõi Phô Mai Tan Chảy',
    imageUrl: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80',
  },
];

export const HomePage = () => {
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);
  const showToast = useToastStore((state) => state.showToast);
  const [activeFaq, setActiveFaq] = useState(0);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItemToCart(product, null, 1);
    showToast(`Đã thêm "${product.nameVi}" vào giỏ hàng!`, 'success');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 3. Hero Section */}
      <section className="hero-banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="badge-luxury">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tiệm Bánh Pháp Thủ Công Cao Cấp</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-bakery-espresso leading-[1.15] tracking-tight">
              Nghệ Thuật Vị Giác <br />
              <span className="italic font-normal text-bakery-caramel">Đậm Đà Tình Yêu</span> & Đam Mê.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              Mỗi sáng mai tại Maison Douce, chúng tôi nhào nặn những ổ bánh thơm phức từ 100% bơ AOP xứ Normandy, kết hợp cùng dâu tây tươi Đà Lạt và hạt vani Bourbon tự nhiên.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link to="/catalog" className="btn-primary w-full sm:w-auto text-base px-8 py-3.5 flex items-center justify-center gap-2">
                <span>Khám Phá Thực Đơn</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/custom-cake-builder" className="btn-secondary w-full sm:w-auto text-base px-8 py-3.5">
                Thiết Kế Bánh Sinh Nhật
              </Link>
            </div>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <p className="font-serif text-2xl font-bold text-bakery-espresso">100%</p>
                <p className="text-xs text-stone-500 font-medium">Bơ Pháp Chuẩn AOP</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-serif text-2xl font-bold text-bakery-espresso">2 Giờ</p>
                <p className="text-xs text-stone-500 font-medium">Giao Nhanh Sài Gòn</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="font-serif text-2xl font-bold text-bakery-espresso">4.9/5</p>
                <p className="text-xs text-stone-500 font-medium">Đánh Giá Hài Lòng</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="rounded-[28px] overflow-hidden shadow-luxury border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1000&q=85"
                  alt="Maison Douce Fraisier Strawberry Cake"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Chef Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-elevated border border-stone-100 hidden sm:flex items-center gap-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-bakery-ivory flex items-center justify-center text-bakery-caramel">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-bakery-espresso">Chef Pâtissier Jean</p>
                  <p className="text-[11px] text-stone-500">Master Baker từ Lyon, Pháp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Bakery Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <div className="badge-luxury mb-2">Danh Mục Bánh</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso">
              Bộ Sưu Tập Bánh Thủ Công
            </h2>
          </div>
          <Link to="/catalog" className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-bakery-caramel hover:text-bakery-caramel-dark transition mt-2 md:mt-0">
            <span>Xem tất cả danh mục</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {FEATURED_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="category-card group flex flex-col"
            >
              <div className="aspect-square overflow-hidden bg-stone-100">
                <img
                  src={cat.image}
                  alt={cat.nameVi}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3.5 text-center flex-1 flex flex-col justify-center">
                <h3 className="text-sm font-semibold text-bakery-espresso group-hover:text-bakery-caramel transition">
                  {cat.nameVi}
                </h3>
                <p className="text-[11px] text-stone-500 mt-0.5">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Best-Selling Signature Desserts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="badge-luxury mb-2">Tuyệt Tác Bán Chạy</div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso mb-3">
            Những Món Bánh Được Yêu Thích Nhất
          </h2>
          <p className="text-sm text-stone-600 font-light">
            Được chế biến tươi mới mỗi ngày với số lượng giới hạn để đảm bảo độ giòn xốp và hương vị thơm béo hoàn hảo nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SIGNATURE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.slug}`)}
              className="product-card cursor-pointer group flex flex-col"
            >
              {/* Product Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                <img
                  src={product.imageUrl}
                  alt={product.nameVi}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-bakery-ivory/95 backdrop-blur-sm text-bakery-espresso text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                  {product.dietaryTag}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-bakery-espresso">{product.rating}</span>
                    <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
                  </div>
                  <h3 className="font-semibold text-base text-bakery-espresso group-hover:text-bakery-caramel transition line-clamp-1">
                    {product.nameVi}
                  </h3>
                  <p className="text-xs text-stone-500 font-light italic truncate">{product.nameEn}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                  <div>
                    <span className="font-serif text-lg font-bold text-bakery-caramel">
                      {formatCurrency(product.promotionalPrice || product.basePrice)}
                    </span>
                    {product.promotionalPrice && (
                      <span className="block text-[11px] text-stone-400 line-through">
                        {formatCurrency(product.basePrice)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-2.5 rounded-full bg-bakery-cream text-bakery-espresso hover:bg-bakery-caramel hover:text-white transition shadow-sm"
                    aria-label={`Thêm ${product.nameVi} vào giỏ hàng`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Signature Custom Cake Section */}
      <section className="bg-bakery-espresso text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-bakery-caramel/20 text-bakery-caramel border border-bakery-caramel/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Pâtisserie</span>
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Tự Tay Thiết Kế Chiếc Bánh Cho Ngày Đặc Biệt
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
              Bạn có thể tự do lựa chọn hình dáng, kích thước, vị kem bơ, cốt bánh bông lan và lời chúc mang đậm dấu ấn riêng. Đội ngũ nghệ nhân bánh ngọt Maison Douce sẽ biến ý tưởng của bạn thành hiện thực hoàn mỹ.
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-stone-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bakery-caramel" />
                <span>Tùy biến hình dáng: Tròn, Trái Tim, Vuông hoặc Nhiều Tầng</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bakery-caramel" />
                <span>Hương vị cao cấp: Vani Bourbon, Sô-cô-la Bỉ, Trà Xanh Uji, Dâu Rừng</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-bakery-caramel" />
                <span>Vẽ thông điệp cá nhân hóa & tải ảnh mẫu thiết kế mong muốn</span>
              </li>
            </ul>

            <div className="pt-4">
              <Link to="/custom-cake-builder" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">
                <span>Bắt Đầu Thiết Kế Bánh Ngay</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Showcase */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
              <img
                src="https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=900&q=80"
                alt="Custom Luxury Cake Maison Douce"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. Brand Craftsmanship Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80"
              alt="Baking Croissant Process"
              className="rounded-2xl shadow-soft object-cover aspect-[4/5]"
            />
            <img
              src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
              alt="Choux Pastry Craftsmanship"
              className="rounded-2xl shadow-soft object-cover aspect-[4/5] mt-8"
            />
          </div>

          <div className="space-y-6">
            <div className="badge-luxury">Câu Chuyện Maison Douce</div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso leading-snug">
              Tinh Hoa Nước Pháp Trong Từng Mẻ Bánh Nóng Hổi
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Khởi nguồn từ niềm đam mê sâu sắc với nghệ thuật làm bánh Pháp truyền thống, Maison Douce ra đời để mang đến trải nghiệm thưởng thức bánh ngọt tinh tế và chân thực nhất giữa trung tâm Sài Gòn.
            </p>
            <p className="text-sm text-stone-600 leading-relaxed font-light">
              Chúng tôi không bao giờ thỏa hiệp về nguyên liệu: chỉ sử dụng bơ nguyên chất AOP từ vùng Normandy, sô-cô-la nguyên chất Valrhona và trứng gà tươi hữu cơ mỗi sớm mai.
            </p>
            <div className="pt-2">
              <Link to="/about" className="btn-secondary text-sm">
                Đọc Thêm Về Nghệ Nhân Chúng Tôi
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 11. Customer Testimonials */}
      <section className="bg-bakery-cream/50 py-20 border-y border-stone-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <div className="badge-luxury mb-2">Đánh Giá Từ Khách Hàng</div>
            <h2 className="font-serif text-3xl font-bold text-bakery-espresso">
              Những Lời Yêu Thương
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-soft border border-stone-100 space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-700 italic">
                "Chiếc bánh Fraisier trong ngày sinh nhật của mẹ mình thơm nức và thanh mát, không hề bị ngọt gắt như bánh tiệm khác. Giao hàng đúng giờ và đóng gói cực kỳ sang trọng!"
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bakery-blush flex items-center justify-center font-bold text-xs text-bakery-espresso">
                  HN
                </div>
                <div>
                  <p className="text-xs font-bold text-bakery-espresso">Hoàng Ngân</p>
                  <p className="text-[10px] text-stone-400">Khách hàng tại Quận 1</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft border border-stone-100 space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-700 italic">
                "Croissant ở đây giòn rụm và thơm nức mùi bơ Pháp. Ăn kèm một ly cà phê cold brew buổi sáng thì không còn gì hoàn hảo hơn."
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bakery-blush flex items-center justify-center font-bold text-xs text-bakery-espresso">
                  TV
                </div>
                <div>
                  <p className="text-xs font-bold text-bakery-espresso">Thanh Vũ</p>
                  <p className="text-[10px] text-stone-400">Khách hàng tại Thảo Điền</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-soft border border-stone-100 space-y-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-stone-700 italic">
                "Mình đặt bánh cưới 3 tầng tại Maison Douce. Các bạn tư vấn nhiệt tình, bánh lên hình chụp tuyệt đẹp và các khách mời đều khen nức nở vị kem phô mai."
              </p>
              <div className="pt-2 border-t border-stone-100 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-bakery-blush flex items-center justify-center font-bold text-xs text-bakery-espresso">
                  MA
                </div>
                <div>
                  <p className="text-xs font-bold text-bakery-espresso">Minh Anh & Tuấn Kiệt</p>
                  <p className="text-[10px] text-stone-400">Bánh tiệc cưới</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 14. FAQ Preview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="badge-luxury mb-2">Giải Đáp Thắc Mắc</div>
          <h2 className="font-serif text-3xl font-bold text-bakery-espresso">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Tiệm có nhận giao bánh hỏa tốc trong ngày không?',
              a: 'Có! Maison Douce nhận giao các loại bánh tươi sẵn có (Tiramisu, Su kem Choux, Croissant, Cheesecake) trong vòng 2 giờ tại các quận TP. Hồ Chí Minh.',
            },
            {
              q: 'Tôi cần đặt bánh kem sinh nhật thiết kế riêng trước bao lâu?',
              a: 'Đối với các mẫu bánh kem thiết kế riêng hoặc bánh cưới, quý khách vui lòng đặt trước tối thiểu 12–24 giờ để nghệ nhân chuẩn bị hoa văn và phụ kiện tinh tế nhất.',
            },
            {
              q: 'Bánh của Maison Douce bảo quản được bao lâu?',
              a: 'Bánh kem tươi và tiramisu bảo quản ngăn mát tủ lạnh (2°C - 6°C) dùng ngon nhất trong 2-3 ngày. Bánh Croissant nên thưởng thức trong ngày hoặc hâm nóng nhẹ 2 phút trước khi ăn.',
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="border border-stone-200 rounded-xl bg-white overflow-hidden transition"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                className="w-full flex items-center justify-between p-4 text-left font-semibold text-sm text-bakery-espresso hover:text-bakery-caramel transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeFaq === index ? 'rotate-180 text-bakery-caramel' : 'text-stone-400'
                  }`}
                />
              </button>
              {activeFaq === index && (
                <div className="px-4 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-50 pt-2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
