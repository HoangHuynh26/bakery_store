import React, { useState } from 'react';
import { 
  Sparkles, 
  Heart, 
  Circle, 
  Square, 
  Layers, 
  Send, 
  Clock, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  HelpCircle,
  Copy,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { customCakeService } from '../../services/customCakeService';
import { useAuthStore } from '../../store/useAuthStore';
import { useToastStore } from '../../store/useToastStore';
import './CustomCakeBuilderPage.css';

const CAKE_SHAPES = [
  { id: 'ROUND', name: 'Tròn Cổ Điển (Classic Round)', icon: Circle, desc: 'Dáng bánh truyền thống thanh lịch' },
  { id: 'HEART', name: 'Trái Tim (Romantic Heart)', icon: Heart, desc: 'Hoàn hảo cho sinh nhật & kỷ niệm' },
  { id: 'SQUARE', name: 'Vuông Hiện Đại (Square)', icon: Square, desc: 'Đường nét sắc sảo, tối giản' },
  { id: 'TWO_TIER', name: 'Hai Tầng Sang Trọng (Tiered)', icon: Layers, desc: 'Lễ kỷ niệm & tiệc cưới hoàng gia' },
];

const CAKE_SIZES = [
  { id: '14cm', name: '14cm (4-6 phần)', servings: '4-6 khách', price: 380000 },
  { id: '18cm', name: '18cm (8-10 phần)', servings: '8-10 khách', price: 520000 },
  { id: '22cm', name: '22cm (12-14 phần)', servings: '12-14 khách', price: 680000 },
  { id: '26cm', name: '26cm (16-20 phần)', servings: '16-20 khách', price: 890000 },
  { id: 'TWO_TIER_25', name: 'Hai Tầng (25-30 phần)', servings: '25-30 khách', price: 1450000 },
];

const CAKE_FLAVORS = [
  { id: 'VANILLA', name: 'Vani Madagascar Hữu Cơ', desc: 'Thơm dịu nồng nàn hoa cỏ' },
  { id: 'CHOCOLATE', name: 'Sô-cô-la Bỉ Valrhona 70%', desc: 'Đắng nhẹ quý phái, béo ngậy' },
  { id: 'MATCHA', name: 'Trà Xanh Matcha Uji Kyoto', desc: 'Hương trà mộc mạc thanh tao' },
  { id: 'RED_VELVET', name: 'Red Velvet Nhung Đỏ', desc: 'Mềm mượt phong cách quý tộc Pháp' },
  { id: 'EARL_GREY', name: 'Trà Bá Tước Earl Grey', desc: 'Hương cam bergamot tinh tế' },
];

const CAKE_FILLINGS = [
  { id: 'STRAWBERRY', name: 'Dâu Tây Đà Lạt Tươi Nấu Tay', price: 30000 },
  { id: 'PASSION_CURD', name: 'Curd Chanh Leo & Nam Việt Quất', price: 30000 },
  { id: 'CARAMEL_HAZELNUT', name: 'Caramel Muối & Hạt Phỉ Giòn', price: 40000 },
  { id: 'VALRHONA_MOUSSE', name: 'Mousse Sô-cô-la Đen Valrhona', price: 50000 },
  { id: 'DIPLOMAT', name: 'Kem Trứng Bơ Pháp Diplomat', price: 20000 },
];

const CAKE_FROSTINGS = [
  { id: 'FRENCH_BUTTERCREAM', name: 'Kem Bơ Pháp Elle & Vire', desc: 'Mịn màng, tan chảy trên đầu lưỡi' },
  { id: 'FRESH_CHANTILLY', name: 'Kem Tươi Whipping Anchor New Zealand', desc: 'Thanh nhẹ, béo dịu tự nhiên' },
  { id: 'CREAM_CHEESE', name: 'Kem Phô Mai Cream Cheese Galbani', desc: 'Đậm đà, hơi chua thanh' },
  { id: 'MIRROR_GLAZE', name: 'Tráng Gương Bóng Bẩy (Mirror Glaze)', desc: 'Lớp bóng nghệ thuật Pháp lộng lẫy' },
];

const COLOR_THEMES = [
  { id: 'WARM_IVORY', name: 'Kem Ngà (Warm Ivory)', hex: '#FFF9F2', border: '#cbd5e1' },
  { id: 'BLUSH_PINK', name: 'Hồng Pastel (Blush Pink)', hex: '#F3D8D4', border: '#e5b8b2' },
  { id: 'CARAMEL_GOLD', name: 'Vàng Caramel (Caramel Gold)', hex: '#C89963', border: '#a87943' },
  { id: 'NATURAL_SAGE', name: 'Xanh Sage (Natural Sage)', hex: '#A8B5A0', border: '#8b9983' },
  { id: 'LAVENDER', name: 'Tím Oải Hương (Lavender)', hex: '#E6E6FA', border: '#c3c3e8' },
  { id: 'VINTAGE_COCOA', name: 'Nâu Cacao (Vintage Cocoa)', hex: '#5D4037', border: '#422d27' },
];

export const CustomCakeBuilderPage = () => {
  const { user } = useAuthStore();
  const { addToast } = useToastStore();

  // Selected state
  const [shape, setShape] = useState(CAKE_SHAPES[0]);
  const [size, setSize] = useState(CAKE_SIZES[1]);
  const [flavor, setFlavor] = useState(CAKE_FLAVORS[0]);
  const [filling, setFilling] = useState(CAKE_FILLINGS[0]);
  const [frosting, setFrosting] = useState(CAKE_FROSTINGS[0]);
  const [colorTheme, setColorTheme] = useState(COLOR_THEMES[0]);
  const [pipingMessage, setPipingMessage] = useState('Happy Birthday');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [referenceImageUrl, setReferenceImageUrl] = useState('');

  // Delivery & Contact
  const [customerName, setCustomerName] = useState(user?.fullName || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [preferredTime, setPreferredTime] = useState('14:00 - 16:00');

  const [submitting, setSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState(null);

  // Dynamic estimate calculation
  const estimatedPrice = size.price + (filling.price || 0) + (shape.id === 'TWO_TIER' ? 200000 : 0);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customerName || !customerPhone || !preferredDate) {
      addToast('Vui lòng điền đủ họ tên, số điện thoại và ngày nhận bánh', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        cakeType: `${flavor.name} - ${frosting.name}`,
        shape: shape.name,
        sizeServings: `${size.name} (${size.servings})`,
        flavor: flavor.name,
        filling: filling.name,
        frosting: frosting.name,
        colorTheme: colorTheme.name,
        pipingMessage: pipingMessage || 'Không viết chữ',
        specialInstructions,
        referenceImageUrl,
        preferredDate,
        preferredTime,
      };

      const result = await customCakeService.createRequest(payload);
      setSuccessResult(result);
      addToast('Yêu cầu thiết kế bánh đã được gửi đến Bếp trưởng!', 'success');
    } catch (err) {
      addToast(err.message || 'Không thể gửi yêu cầu bánh thiết kế', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cake-atelier-root">
      <div className="atelier-container">
        {/* Header Title */}
        <div className="atelier-header">
          <div className="atelier-badge">
            <Sparkles size={14} />
            <span>Atelier Bánh Thiết Kế Thủ Công</span>
          </div>
          <h1 className="atelier-title">Tự Tay Phác Hoạ Chiếc Bánh Mơ Ước</h1>
          <p className="atelier-subtitle">
            Mỗi lễ kỷ niệm là một câu chuyện độc bản. Hãy chọn hình dáng, hương vị, cốt bánh và thông điệp
            để các nghệ nhân Pâtissier của Maison Douce hiện thực hoá tình yêu của bạn.
          </p>
        </div>

        {/* Success Modal */}
        {successResult && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
                Yêu Cầu Thiết Kế Đã Gửi Thành Công!
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Bếp trưởng Maison Douce sẽ xem xét chi tiết thiết kế và liên hệ với bạn trong vòng 2 giờ
                để tư vấn và chốt phương án trang trí hoàn hảo nhất.
              </p>

              <div className="w-full bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
                <div className="text-xs text-amber-800 uppercase font-bold tracking-wider mb-1">
                  Mã Yêu Cầu Của Bạn
                </div>
                <div className="text-xl font-mono font-bold text-amber-950 flex items-center justify-between">
                  <span>{successResult.requestNumber}</span>
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(successResult.requestNumber);
                      addToast('Đã sao chép mã yêu cầu', 'success');
                    }}
                    className="text-xs font-sans font-semibold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <Copy size={13} />
                    <span>Sao chép</span>
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  Ngày nhận dự kiến: <strong>{successResult.preferredDate}</strong> ({successResult.preferredTime})
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setSuccessResult(null)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 text-sm"
                >
                  Tạo Thêm Bánh Khác
                </button>
                <Link
                  to="/"
                  className="flex-1 py-3 bg-amber-800 text-white rounded-xl font-semibold hover:bg-amber-900 text-sm flex items-center justify-center gap-1"
                >
                  <span>Về Trang Chủ</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="atelier-layout">
          {/* Left Column: Interactive Steps */}
          <div className="builder-card">
            {/* Step 1: Shape */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">1</div>
                <h2 className="step-title">Chọn Dáng Bánh (Shape)</h2>
              </div>
              <div className="options-grid mt-4">
                {CAKE_SHAPES.map((sh) => {
                  const Icon = sh.icon;
                  return (
                    <div
                      key={sh.id}
                      className={`option-box ${shape.id === sh.id ? 'selected' : ''}`}
                      onClick={() => setShape(sh)}
                    >
                      <Icon className="w-8 h-8 text-amber-800" />
                      <div className="option-name">{sh.name}</div>
                      <div className="option-desc">{sh.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Size & Servings */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">2</div>
                <h2 className="step-title">Kích Thước & Số Phần Ăn</h2>
              </div>
              <div className="options-grid mt-4">
                {CAKE_SIZES.map((sz) => (
                  <div
                    key={sz.id}
                    className={`option-box ${size.id === sz.id ? 'selected' : ''}`}
                    onClick={() => setSize(sz)}
                  >
                    <div className="option-name">{sz.name}</div>
                    <div className="option-desc">Phù hợp {sz.servings}</div>
                    <div className="option-price-tag">{formatVND(sz.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Flavor & Base */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">3</div>
                <h2 className="step-title">Hương Vị Cốt Bánh (Sponge Cake)</h2>
              </div>
              <div className="options-grid mt-4">
                {CAKE_FLAVORS.map((fl) => (
                  <div
                    key={fl.id}
                    className={`option-box ${flavor.id === fl.id ? 'selected' : ''}`}
                    onClick={() => setFlavor(fl)}
                  >
                    <div className="option-name">{fl.name}</div>
                    <div className="option-desc">{fl.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 4: Filling */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">4</div>
                <h2 className="step-title">Nhân Kem & Trái Cây (Filling)</h2>
              </div>
              <div className="options-grid mt-4">
                {CAKE_FILLINGS.map((fi) => (
                  <div
                    key={fi.id}
                    className={`option-box ${filling.id === fi.id ? 'selected' : ''}`}
                    onClick={() => setFilling(fi)}
                  >
                    <div className="option-name">{fi.name}</div>
                    <div className="option-price-tag">+{formatVND(fi.price)}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 5: Frosting & Color */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">5</div>
                <h2 className="step-title">Lớp Kem Phủ & Tone Màu Chủ Đạo</h2>
              </div>

              <div className="options-grid mt-4 mb-6">
                {CAKE_FROSTINGS.map((fr) => (
                  <div
                    key={fr.id}
                    className={`option-box ${frosting.id === fr.id ? 'selected' : ''}`}
                    onClick={() => setFrosting(fr)}
                  >
                    <div className="option-name">{fr.name}</div>
                    <div className="option-desc">{fr.desc}</div>
                  </div>
                ))}
              </div>

              <div className="text-sm font-semibold text-slate-800 mb-3">Tone Màu Kem:</div>
              <div className="colors-grid">
                {COLOR_THEMES.map((col) => (
                  <div
                    key={col.id}
                    className={`color-swatch-item ${colorTheme.id === col.id ? 'selected' : ''}`}
                    onClick={() => setColorTheme(col)}
                  >
                    <div
                      className="color-circle"
                      style={{ backgroundColor: col.hex, borderColor: col.border }}
                    />
                    <span className="text-xs font-semibold text-slate-700">{col.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 6: Inscription & Instructions */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">6</div>
                <h2 className="step-title">Chữ Viết Lên Bánh & Lời Dặn Nghệ Nhân</h2>
              </div>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Chữ viết viền kem nghệ thuật (Piping Message)
                  </label>
                  <input
                    type="text"
                    maxLength={50}
                    placeholder="VD: Happy 25th Birthday My Love"
                    value={pipingMessage}
                    onChange={(e) => setPipingMessage(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:border-amber-700 outline-none"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">
                    Chữ sẽ hiển thị mô phỏng trực tiếp trên hình bánh bên phải
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Đường dẫn ảnh mẫu bạn thích (Reference Photo URL)
                  </label>
                  <input
                    type="url"
                    placeholder="https://pinterest.com/pin/... hoặc ảnh bạn sưu tầm"
                    value={referenceImageUrl}
                    onChange={(e) => setReferenceImageUrl(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:border-amber-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Yêu cầu trang trí đặc biệt (hoa tươi, nến số, vị ít ngọt...)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="VD: Làm vị ít ngọt, trang trí thêm lá vàng ăn được và nến số 25..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:border-amber-700 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 7: Contact & Delivery Appointment */}
            <div className="step-section">
              <div className="step-header">
                <div className="step-number">7</div>
                <h2 className="step-title">Thông Tin Liên Hệ & Lịch Nhận Bánh</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email nhận báo giá</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Ngày nhận bánh *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 border rounded-lg text-sm outline-none focus:border-amber-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Live Canvas Preview & Estimated Price */}
          <div className="preview-sidebar">
            <div className="preview-card">
              <h3 className="preview-title">
                <Sparkles size={18} className="text-amber-800" />
                <span>Mô Phỏng Trực Quan Chiếc Bánh</span>
              </h3>

              {/* Dynamic 3D-feel visual canvas */}
              <div className="cake-canvas">
                <div className="cake-plate" />
                <div
                  className="visual-cake-body"
                  style={{
                    backgroundColor: colorTheme.hex,
                    borderRadius: shape.id === 'HEART' ? '30% 30% 12px 12px' : shape.id === 'SQUARE' ? '8px' : '50% 50% 12px 12px / 20px 20px 12px 12px',
                    border: `2px solid ${colorTheme.border}`,
                    zIndex: 2,
                  }}
                >
                  <div className="piping-text-preview">
                    "{pipingMessage || 'Maison Douce'}"
                  </div>
                </div>
              </div>

              {/* Specifications Review */}
              <div className="specs-list">
                <div className="spec-item">
                  <span>Dáng bánh:</span>
                  <span className="spec-value">{shape.name}</span>
                </div>
                <div className="spec-item">
                  <span>Kích thước:</span>
                  <span className="spec-value">{size.name}</span>
                </div>
                <div className="spec-item">
                  <span>Cốt bánh:</span>
                  <span className="spec-value">{flavor.name}</span>
                </div>
                <div className="spec-item">
                  <span>Nhân bánh:</span>
                  <span className="spec-value">{filling.name}</span>
                </div>
                <div className="spec-item">
                  <span>Tone màu:</span>
                  <span className="spec-value">{colorTheme.name}</span>
                </div>
                <div className="spec-item">
                  <span>Ngày hẹn:</span>
                  <span className="spec-value">{preferredDate || 'Chưa chọn'}</span>
                </div>
              </div>

              {/* Estimated Price */}
              <div className="price-estimate-box">
                <div className="price-estimate-label">Dự toán kinh phí ban đầu</div>
                <div className="price-estimate-val">{formatVND(estimatedPrice)}</div>
                <div className="text-[11px] text-slate-500">
                  (Báo giá chính xác sẽ được Bếp trưởng gửi sau khi xem chi tiết trang trí)
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="submit-atelier-btn"
              >
                <Send size={18} />
                <span>{submitting ? 'Đang gửi bản vẽ...' : 'Gửi Bản Thiết Kế Đến Bếp Trưởng'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CustomCakeBuilderPage;
