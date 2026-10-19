import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart } from 'lucide-react';
import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Upper Footer: Value Props */}
      <div className="border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-bakery-caramel/20 flex items-center justify-center text-bakery-caramel">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Nướng Mới Mỗi Ngày</h4>
              <p className="text-xs text-stone-400">Ra lò lúc 6:00 sáng mỗi ngày</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-bakery-caramel/20 flex items-center justify-center text-bakery-caramel">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Bơ Pháp Chuẩn AOP</h4>
              <p className="text-xs text-stone-400">100% bơ nhập khẩu Normandy</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-bakery-caramel/20 flex items-center justify-center text-bakery-caramel">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Bánh Thiết Kế Riêng</h4>
              <p className="text-xs text-stone-400">Tạo hình theo ý muốn quý khách</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-3">
            <div className="w-10 h-10 rounded-full bg-bakery-caramel/20 flex items-center justify-center text-bakery-caramel">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Concierge Hotline</h4>
              <p className="text-xs text-bakery-caramel font-semibold">028 3822 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                Maison Douce
              </span>
              <span className="block text-[11px] uppercase tracking-[0.25em] text-bakery-caramel font-semibold">
                Crafted with Love, Baked with Passion
              </span>
            </Link>
            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              Tiệm bánh boutique phong cách Pháp đương đại tại Sài Gòn. Mỗi chiếc bánh là một tác phẩm nghệ thuật vị giác, hòa quyện giữa tinh hoa nguyên liệu nhập khẩu và tình yêu thủ công thuần túy.
            </p>
            <div className="space-y-2 pt-2 text-xs text-stone-300">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
                <span>18 Rue de la Paix, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-bakery-caramel flex-shrink-0" />
                <span>bonjour@maisondouce.vn</span>
              </p>
            </div>
          </div>

          {/* Catalog Categories */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Thực Đơn Bánh
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/catalog/birthday-cakes" className="footer-link">Bánh Kem Sinh Nhật</Link></li>
              <li><Link to="/catalog/tiramisu" className="footer-link">Tiramisu Ý Cổ Điển</Link></li>
              <li><Link to="/catalog/cream-puffs" className="footer-link">Bánh Su Kem Choux</Link></li>
              <li><Link to="/catalog/cheesecakes" className="footer-link">Basque Burnt Cheesecake</Link></li>
              <li><Link to="/catalog/croissants" className="footer-link">Croissant Bơ Pháp AOP</Link></li>
              <li><Link to="/catalog/macarons" className="footer-link">Macaron Di Sản Paris</Link></li>
            </ul>
          </div>

          {/* Customer Service & Policies */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Chính Sách & Hỗ Trợ
            </h3>
            <ul className="space-y-2 text-xs">
              <li><Link to="/faq" className="footer-link">Câu Hỏi Thường Gặp (FAQ)</Link></li>
              <li><Link to="/delivery-policy" className="footer-link">Chính Sách Giao Hàng</Link></li>
              <li><Link to="/custom-cake-guide" className="footer-link">Hướng Dẫn Đặt Bánh Thiết Kế</Link></li>
              <li><Link to="/allergen-info" className="footer-link">Bảng Thông Tin Dị Ứng</Link></li>
              <li><Link to="/contact" className="footer-link">Góp Ý & Đặt Tiệc Sự Kiện</Link></li>
            </ul>
          </div>

          {/* Operating Hours & Newsletter */}
          <div>
            <h3 className="font-serif text-base font-bold text-white mb-4 tracking-wide">
              Thời Gian Mở Cửa
            </h3>
            <div className="text-xs text-stone-300 space-y-2">
              <p className="font-semibold text-white">Thứ Hai – Chủ Nhật</p>
              <p>07:00 AM – 09:30 PM</p>
              <p className="text-[11px] text-stone-400 pt-1">
                Bánh tươi ra lò các khung giờ: 07:00, 11:30 và 15:30 hàng ngày.
              </p>
            </div>
            <div className="pt-4">
              <Link
                to="/custom-cake-builder"
                className="btn-outline-gold text-xs py-2 px-4 w-full text-center inline-block"
              >
                Tư Vấn Bánh Sinh Nhật
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="border-t border-stone-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© 2026 Maison Douce Bakery. Bản quyền thuộc về Tiệm Bánh Maison Douce.</p>
          <div className="flex items-center space-x-6">
            <Link to="/terms" className="hover:text-bakery-caramel">Điều Khoản Dịch Vụ</Link>
            <Link to="/privacy" className="hover:text-bakery-caramel">Bảo Mật Thông Tin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
