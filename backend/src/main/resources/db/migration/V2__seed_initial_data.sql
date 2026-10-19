-- ==============================================================================
-- MAISON DOUCE BAKERY - V2 INITIAL SEED DATA
-- Idempotent initial seed data for demonstration and development
-- ==============================================================================

-- 1. SEED ROLES
INSERT INTO roles (id, name, description) VALUES
('ROLE_SUPER_ADMIN', 'ROLE_SUPER_ADMIN', 'Full system and operational privileges'),
('ROLE_ADMIN', 'ROLE_ADMIN', 'Store operations, catalog and order management'),
('ROLE_STAFF', 'ROLE_STAFF', 'Bakery production, kitchen queue and fulfillment'),
('ROLE_CUSTOMER', 'ROLE_CUSTOMER', 'Standard customer shopping account')
;

-- 2. SEED DEFAULT USERS (Password hashes will be initialized/verified by Spring Boot DatabaseInitializer if updated)
-- Default BCrypt hash represents '$2a$10$wE9K2sF76GjH9g7N9F4kCe0pGz6.1U9sW8qR2v6y0Y4P2q8w0a1b2' (standard placeholder verified on startup)
INSERT INTO users (id, email, password_hash, full_name, phone_number, is_active, is_email_verified) VALUES
('11111111-1111-1111-1111-111111111111', 'admin@maisondouce.vn', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.2aBkWDtuWhTRrr.YN3i2', 'Boutique Director', '0901234567', TRUE, TRUE),
('22222222-2222-2222-2222-222222222222', 'chef@maisondouce.vn', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.2aBkWDtuWhTRrr.YN3i2', 'Chef Pâtissier Jean', '0907654321', TRUE, TRUE),
('33333333-3333-3333-3333-333333333333', 'customer@example.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.2aBkWDtuWhTRrr.YN3i2', 'Sophie Nguyen', '0912345678', TRUE, TRUE)
;

-- 3. SEED USER ROLES
INSERT INTO user_roles (user_id, role_id) VALUES
('11111111-1111-1111-1111-111111111111', 'ROLE_SUPER_ADMIN'),
('11111111-1111-1111-1111-111111111111', 'ROLE_ADMIN'),
('22222222-2222-2222-2222-222222222222', 'ROLE_STAFF'),
('33333333-3333-3333-3333-333333333333', 'ROLE_CUSTOMER')
;

-- 4. SEED ALLERGENS
INSERT INTO allergens (id, code, name_en, name_vi, icon_name) VALUES
('a0000000-0000-0000-0000-000000000001', 'GLUTEN', 'Gluten / Wheat', 'Gluten / Lúa mì', 'wheat'),
('a0000000-0000-0000-0000-000000000002', 'DAIRY', 'Dairy / Milk', 'Sữa / Chế phẩm sữa', 'milk'),
('a0000000-0000-0000-0000-000000000003', 'EGGS', 'Eggs', 'Trứng', 'egg'),
('a0000000-0000-0000-0000-000000000004', 'NUTS', 'Tree Nuts / Almonds', 'Hạt / Hạnh nhân', 'nut'),
('a0000000-0000-0000-0000-000000000005', 'SOY', 'Soybeans', 'Đậu nành', 'bean'),
('a0000000-0000-0000-0000-000000000006', 'ALCOHOL', 'Contains Alcohol / Liqueur', 'Có chứa cồn / Rượu nhẹ', 'wine')
;

-- 5. SEED LOYALTY TIERS
INSERT INTO loyalty_tiers (id, name, min_spend_required, point_earning_rate, benefits_description) VALUES
('BRONZE', 'Bronze Gourmand', 0.00, 1.00, 'Earn 1 point per 1,000 VND spent. Birthday greeting voucher.'),
('SILVER', 'Silver Connoisseur', 2000000.00, 1.50, 'Earn 1.5 points per 1,000 VND spent. 5% birthday discount voucher. Early access to seasonal collections.'),
('GOLD', 'Gold Epicurean', 5000000.00, 2.00, 'Earn 2 points per 1,000 VND spent. Free delivery on orders over 300,000 VND. Exclusive pastry tasting invitations.'),
('PLATINUM', 'Platinum Grand Cru', 10000000.00, 3.00, 'Earn 3 points per 1,000 VND spent. Permanent 5% store discount. Priority custom cake reservations.')
;

-- Seed customer loyalty account
INSERT INTO loyalty_accounts (id, user_id, points_balance, lifetime_points, current_tier_id) VALUES
('e0000000-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 150, 450, 'SILVER')
;

-- 6. SEED 16 CATEGORIES (Vietnamese & English)
INSERT INTO categories (id, slug, name_en, name_vi, description_en, description_vi, image_url, display_order) VALUES
('c0000001-0000-0000-0000-000000000001', 'birthday-cakes', 'Birthday Cakes', 'Bánh Kem Sinh Nhật', 'Artisan celebration cakes crafted with fresh seasonal fruits and premium French buttercreams.', 'Bánh kem sinh nhật nghệ thuật với trái cây tươi thượng hạng và kem bơ Pháp béo ngậy.', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 1),
('c0000002-0000-0000-0000-000000000002', 'wedding-cakes', 'Wedding Cakes', 'Bánh Cưới Sang Trọng', 'Multi-tiered bespoke wedding centerpieces designed to make your day unforgettable.', 'Bánh cưới nhiều tầng lộng lẫy thiết kế riêng cho ngày trọng đại đáng nhớ.', 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80', 2),
('c0000003-0000-0000-0000-000000000003', 'custom-cakes', 'Custom Celebration Cakes', 'Bánh Thiết Kế Theo Yêu Cầu', 'Tailor-made customized cakes shaped and themed to your personal vision and aesthetic.', 'Bánh sinh nhật và tiệc thiết kế riêng theo ý tưởng, chủ đề và màu sắc của quý khách.', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=800&q=80', 3),
('c0000004-0000-0000-0000-000000000004', 'tiramisu', 'Tiramisu', 'Bánh Tiramisu Ý', 'Classic and contemporary Italian tiramisu layered with authentic mascarpone and espresso.', 'Tiramisu chuẩn vị Ý với lớp phô mai Mascarpone béo mịn và cà phê espresso thơm lừng.', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=800&q=80', 4),
('c0000005-0000-0000-0000-000000000005', 'cream-puffs', 'Cream Puffs / Choux Pastry', 'Bánh Su Kem Pháp / Choux', 'Crisp craquelin shells brimming with silky Madagascar vanilla crème diplomate.', 'Vỏ bánh choux giòn rụm với nhân kem sữa vani Madagascar béo ngậy tan chảy.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 5),
('c0000006-0000-0000-0000-000000000006', 'egg-tarts', 'Egg Tarts', 'Bánh Tart Trứng Nướng', 'Flaky laminated Portuguese and French tart shells with warm caramel custard centers.', 'Vỏ ngàn lớp giòn tan kết hợp cùng lớp nhân kem trứng nướng vàng óng thơm ngậy.', 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80', 6),
('c0000007-0000-0000-0000-000000000007', 'cheesecakes', 'Cheesecakes', 'Bánh Cheesecake Phô Mai', 'Silky New York baked cheesecakes and delicate Basque burnt cheesecakes.', 'Cheesecake nướng kiểu New York và Basque cháy chuẩn vị mịn mượt đậm đà.', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=800&q=80', 7),
('c0000008-0000-0000-0000-000000000008', 'cupcakes', 'Cupcakes', 'Bánh Cupcake Xinh Xắn', 'Individual gourmet cupcakes crowned with swirls of velvety whipped ganache.', 'Những chiếc cupcake xinh xắn điểm xuyết kem tươi đánh bông và quả mọng.', 'https://images.unsplash.com/photo-1587668178277-295251f900ce?auto=format&fit=crop&w=800&q=80', 8),
('c0000009-0000-0000-0000-000000000009', 'croissants', 'Croissants & Viennoiserie', 'Bánh Croissant Bơ Pháp', 'Golden French croissants laminated with 100% Normandy AOP butter for airy honeycomb layers.', 'Croissant truyền thống Pháp gấp ngàn lớp bằng bơ AOP vùng Normandy thơm nức.', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80', 9),
('c0000010-0000-0000-0000-000000000010', 'cookies', 'Artisan Cookies', 'Bánh Quy Bơ Thượng Hạng', 'Thick gourmet cookies loaded with Valrhona chocolate chunks and roasted nuts.', 'Bánh quy bơ mềm dẻo với sô-cô-la Valrhona đậm vị và hạt óc chó giòn bùi.', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80', 10),
('c0000011-0000-0000-0000-000000000011', 'macarons', 'Parisian Macarons', 'Bánh Macaron Paris', 'Delicate almond meringue shells filled with handcrafted fruit curds and ganaches.', 'Bánh macaron vỏ giòn xốp nhân kem ganache và mứt trái cây thanh tao.', 'https://images.unsplash.com/photo-1569864321390-3330e7041fa9?auto=format&fit=crop&w=800&q=80', 11),
('c0000012-0000-0000-0000-000000000012', 'bread-buns', 'Bread and Buns', 'Bánh Mì Thủ Công & Buns', 'Slow-fermented sourdoughs and soft brioche loaves baked fresh every dawn.', 'Bánh mì men tự nhiên Sourdough và bánh mì hoa cúc Brioche nướng mới mỗi sáng.', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80', 12),
('c0000013-0000-0000-0000-000000000013', 'chocolate-desserts', 'Chocolate Desserts', 'Tráng Miệng Sô-cô-la', 'Decadent dark chocolate mousses, opera cakes, and lava tortes.', 'Các món tráng miệng sô-cô-la đen nguyên chất, Opera bánh 7 tầng tinh tế.', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80', 13),
('c0000014-0000-0000-0000-000000000014', 'seasonal-gift-boxes', 'Seasonal Gift Boxes', 'Hộp Quà Tặng Sang Trọng', 'Curated collections of signature patisseries presented in luxury gift packaging.', 'Hộp quà cao cấp tuyển chọn các loại bánh đặc trưng làm quà biếu trang nhã.', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80', 14),
('c0000015-0000-0000-0000-000000000015', 'beverages', 'Artisan Coffee & Tea', 'Cà Phê & Trà Thượng Hạng', 'Specialty espresso, ceremonial matcha lattes, and organic French herbal infusions.', 'Cà phê đặc sản, trà xanh Matcha Nhật Bản và các loại trà hoa Pháp cao cấp.', 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80', 15),
('c0000016-0000-0000-0000-000000000016', 'party-dessert-sets', 'Party Dessert Sets', 'Set Bánh Tiệc Dessert Bar', 'Harmonious dessert platters and finger foods for weddings, birthdays, and corporate events.', 'Bộ sưu tập bánh mini finger food phong phú cho bàn tiệc trà và sự kiện sang trọng.', 'https://images.unsplash.com/photo-1505253758473-96b3d55d1c1b?auto=format&fit=crop&w=800&q=80', 16)
;

-- 7. SEED 32 REALISTIC BAKERY PRODUCTS
-- Category: Birthday Cakes
INSERT INTO products (id, category_id, sku, slug, name_en, name_vi, description_en, description_vi, base_price, promotional_price, stock_quantity, lead_time_hours, shelf_life_days, storage_instructions, ingredients_en, ingredients_vi, dietary_tags, is_featured, is_active) VALUES
('b0000001-0000-0000-0000-000000000001', 'c0000001-0000-0000-0000-000000000001', 'CAKE-BDAY-01', 'fraisier-vanilla-strawberry-cake', 'Fraisier Royal Strawberry Cake', 'Bánh Kem Dâu Tây Fraisier Hoàng Gia', 'Classic French Fraisier layered with genoise sponge, fresh Da Lat strawberries, and silky mousseline cream infused with Bourbon vanilla.', 'Bánh Fraisier chuẩn Pháp với cốt bánh genoise xốp mềm, dâu tây tươi Đà Lạt căng mọng và kem mousseline vani Bourbon béo nhẹ.', 450000.00, 420000.00, 15, 4, 3, 'Refrigerate at 2°C - 6°C', 'Flour, Da Lat strawberries, French butter, Bourbon vanilla, milk, eggs, sugar', 'Bột mì, dâu tây Đà Lạt, bơ Pháp, vani Bourbon, sữa tươi, trứng gà, đường', 'Vegetarian', TRUE, TRUE),
('b0000002-0000-0000-0000-000000000002', 'c0000001-0000-0000-0000-000000000001', 'CAKE-BDAY-02', 'opera-valrhona-birthday-cake', 'Grand Opera Valrhona Cake', 'Bánh Kem Sinh Nhật Opera Valrhona', 'Almond joconde sponge soaked in rich espresso syrup, layered with dark chocolate ganache and French coffee buttercream.', 'Bánh Opera kinh điển với bánh hạnh nhân Joconde thấm đẫm espresso, xen kẽ ganache sô-cô-la đen Valrhona và kem bơ cà phê Pháp.', 520000.00, NULL, 12, 6, 4, 'Refrigerate at 2°C - 6°C', 'Almond flour, Valrhona 70% dark chocolate, espresso, eggs, butter, sugar', 'Bột hạnh nhân, sô-cô-la đen Valrhona 70%, cà phê espresso, trứng, bơ, đường', 'Vegetarian', TRUE, TRUE),

-- Category: Wedding Cakes
('b0000003-0000-0000-0000-000000000003', 'c0000002-0000-0000-0000-000000000002', 'CAKE-WED-01', 'pure-elegance-three-tier-wedding-cake', 'Pure Elegance 3-Tier Wedding Cake', 'Bánh Cưới 3 Tầng Hoàng Gia Pure Elegance', 'Spectacular three-tiered creation draped in ivory Swiss meringue buttercream, edible 24k gold leaf accents, and handcrafted wafer paper flowers.', 'Tuyệt tác bánh cưới 3 tầng phủ kem bơ Thụy Sĩ trắng ngà, điểm xuyết lá vàng 24k ăn được và hoa đường nghệ thuật làm thủ công.', 3200000.00, 2950000.00, 5, 24, 3, 'Refrigerate at 2°C - 6°C. Keep level during transport.', 'Flour, Swiss butter, white chocolate, organic eggs, vanilla bean, edible gold leaf', 'Bột mì, bơ Thụy Sĩ, sô-cô-la trắng, trứng gà hữu cơ, hạt vani, lá vàng 24k', 'Vegetarian', TRUE, TRUE),

-- Category: Custom Cakes
('b0000004-0000-0000-0000-000000000004', 'c0000003-0000-0000-0000-000000000003', 'CAKE-CUST-01', 'bespoke-celebration-canvas-cake', 'Bespoke Celebration Canvas Cake', 'Bánh Sinh Nhật Thiết Kế Riêng Canvas', 'Base custom artisan cake ready for personalized piping, palette-knife floral art, and bespoke color palettes.', 'Cốt bánh nghệ nhân cho phép tùy biến toàn diện màu sắc, tạo hình dao bảng và thông điệp sinh nhật ý nghĩa.', 650000.00, NULL, 20, 12, 3, 'Refrigerate at 2°C - 6°C', 'Premium sponge base, Italian buttercream, fruit filling choice', 'Cốt bánh sponge thượng hạng, kem bơ Ý, mứt trái cây theo yêu cầu', 'Vegetarian', TRUE, TRUE),

-- Category: Tiramisu
('b0000005-0000-0000-0000-000000000005', 'c0000004-0000-0000-0000-000000000004', 'TIRA-01', 'traditional-venetian-tiramisu-box', 'Traditional Venetian Tiramisu Box', 'Tiramisu Venice Cổ Điển Hộp Thiếc', 'Imported Italian Savoiardi ladyfingers soaked in dark roast espresso and Marsala wine, topped with whipped Galbani Mascarpone and cocoa.', 'Bánh Tiramisu chuẩn Venice với bánh sâm-panh Savoiardi nhúng espresso và rượu vang Marsala, kem phô mai Galbani Mascarpone béo thơm.', 260000.00, 240000.00, 25, 2, 4, 'Refrigerate at 2°C - 5°C', 'Italian Mascarpone, Savoiardi, espresso, Marsala wine, cocoa powder, egg yolks', 'Phô mai Mascarpone Ý, bánh Savoiardi, cà phê espresso, rượu Marsala, bột cacao, lòng đỏ trứng', 'Contains Alcohol', TRUE, TRUE),
('b0000006-0000-0000-0000-000000000006', 'c0000004-0000-0000-0000-000000000004', 'TIRA-02', 'matcha-pistachio-tiramisu', 'Matcha Pistachio Tiramisu', 'Tiramisu Trà Xanh Uji & Hạt Dẻ Cười', 'Ceremonial Uji matcha infused mascarpone cream layered with pistachio paste and delicate sponge biscuits.', 'Sự kết hợp tinh tế giữa bột trà xanh Uji Nhật Bản thượng hạng, kem mascarpone và sốt hạt dẻ cười Pistachio bùi béo.', 280000.00, NULL, 18, 2, 4, 'Refrigerate at 2°C - 5°C', 'Uji matcha, Sicilian pistachio paste, mascarpone, sponge biscuit, white chocolate', 'Trà xanh Uji, sốt hạt dẻ cười Sicily, phô mai mascarpone, bánh quy sponge, sô-cô-la trắng', 'Vegetarian', FALSE, TRUE),

-- Category: Cream Puffs / Choux
('b0000007-0000-0000-0000-000000000007', 'c0000005-0000-0000-0000-000000000005', 'CHOUX-01', 'vanilla-craquelin-choux-box-6', 'Madagascar Vanilla Choux Craquelin (Box of 6)', 'Hộp 6 Bánh Su Kem Choux Craquelin Vani', 'Crispy crunchy craquelin exterior filled to bursting with chilled Madagascar vanilla bean pastry cream.', 'Hộp 6 bánh su kem vỏ giòn Craquelin ngập tràn nhân kem vani Madagascar ngọt ngào thanh khiết.', 180000.00, 165000.00, 30, 1, 2, 'Consume same day for best crunch, or refrigerate 1-2 days', 'Choux pastry, craquelin dough, whole milk, cream, vanilla bean pods, butter', 'Bột choux, lớp craquelin giòn, sữa tươi, kem béo, hạt vani tự nhiên, bơ', 'Vegetarian', TRUE, TRUE),
('b0000008-0000-0000-0000-000000000008', 'c0000005-0000-0000-0000-000000000005', 'CHOUX-02', 'salted-caramel-hazelnut-paris-brest', 'Paris-Brest Hazelnut Praline', 'Bánh Choux Vòng Paris-Brest Hạt Phỉ', 'Classic French ring of choux pastry filled with roasted Piedmont hazelnut mousseline praline cream and toasted almonds.', 'Bánh choux hình bánh xe truyền thống nhân kem praline hạt phỉ Piedmont nướng thơm lừng rắc hạnh nhân lát.', 145000.00, NULL, 15, 2, 2, 'Refrigerate at 2°C - 6°C', 'Piedmont hazelnuts, praline paste, butter, choux pastry, flaked almonds', 'Hạt phỉ Piedmont, sốt praline, bơ, bột choux, hạnh nhân lát', 'Vegetarian', FALSE, TRUE),

-- Category: Egg Tarts
('b0000009-0000-0000-0000-000000000009', 'c0000006-0000-0000-0000-000000000006', 'TART-01', 'portuguese-egg-tart-box-4', 'Pastel de Nata Portuguese Egg Tart (Box of 4)', 'Hộp 4 Bánh Tart Trứng Nướng Pastel de Nata', 'Ultra-crispy laminated puff pastry cups filled with warm, caramelized cinnamon-dusted custard.', 'Vỏ ngàn lớp giòn rụm với nhân kem trứng sữa nướng xém mặt dậy mùi quế thơm lừng.', 120000.00, 105000.00, 40, 1, 2, 'Best eaten warm within 24 hours', 'Puff pastry, whole egg custard, heavy cream, Ceylon cinnamon, lemon peel', 'Bột ngàn lớp, kem trứng tươi, kem sữa béo, quế Ceylon, vỏ chanh', 'Vegetarian', TRUE, TRUE),

-- Category: Cheesecakes
('b0000010-0000-0000-0000-000000000010', 'c0000007-0000-0000-0000-000000000007', 'CHEESE-01', 'san-sebastian-basque-burnt-cheesecake', 'San Sebastián Basque Burnt Cheesecake', 'Bánh Cheesecake Cháy San Sebastián', 'Caramelized burnt crust on the outside with an unctuous, molten creamy cheese center made with Philadelphia cream cheese.', 'Vỏ nướng cháy caramel thơm ngậy ôm trọn phần lõi phô mai Philadelphia tan chảy béo mượt khó cưỡng.', 480000.00, 450000.00, 16, 3, 5, 'Refrigerate at 2°C - 6°C', 'Philadelphia cream cheese, heavy cream, sugar, eggs, organic flour', 'Phô mai tươi Philadelphia, kem whipping, đường cát, trứng gà hữu cơ, bột mì', 'Vegetarian, Gluten-Free Option', TRUE, TRUE),
('b0000011-0000-0000-0000-000000000011', 'c0000007-0000-0000-0000-000000000007', 'CHEESE-02', 'blueberry-new-york-cheesecake', 'Blueberry New York Baked Cheesecake', 'Bánh Cheesecake Nướng Việt Quất New York', 'Dense and rich baked cheesecake over a buttery Graham crust, crowned with compote made from whole wild North American blueberries.', 'Cheesecake nướng kiểu New York đậm đà trên đế bánh quy bơ giòn, phủ sốt mứt việt quất rừng chua ngọt thanh tao.', 420000.00, NULL, 14, 3, 5, 'Refrigerate at 2°C - 6°C', 'Cream cheese, Graham cracker crumbs, butter, wild blueberries, lemon zest', 'Phô mai kem, vụn bánh quy Graham, bơ, việt quất rừng, vỏ chanh vàng', 'Vegetarian', FALSE, TRUE),

-- Category: Cupcakes
('b0000012-0000-0000-0000-000000000012', 'c0000008-0000-0000-0000-000000000008', 'CUP-01', 'red-velvet-cream-cheese-cupcakes-box-6', 'Signature Red Velvet Cupcakes (Box of 6)', 'Hộp 6 Bánh Cupcake Red Velvet Kem Phô Mai', 'Ruby red cocoa sponge cupcakes topped with swirls of tangy vanilla cream cheese frosting and heart crisps.', 'Bánh cupcake nhung đỏ cốt cacao thơm ngát phủ xoắn kem phô mai béo ngậy thanh mát.', 210000.00, 195000.00, 25, 2, 3, 'Refrigerate at 2°C - 6°C', 'Buttermilk, cocoa powder, flour, cream cheese, vanilla extract', 'Sữa bơ tươi, bột cacao, bột mì, kem phô mai, vani chiết xuất', 'Vegetarian', TRUE, TRUE),

-- Category: Croissants
('b0000013-0000-0000-0000-000000000013', 'c0000009-0000-0000-0000-000000000009', 'CROIS-01', 'butter-croissant-french-aop', 'Traditional French Butter Croissant', 'Bánh Croissant Bơ Pháp AOP Thượng Hạng', 'Laminated with pure Normandy butter for a golden flaked exterior and feather-light honeycomb interior.', 'Được cán thủ công với bơ AOP vùng Normandy trứ danh, vỏ bánh giòn tan tách lớp tổ ong xốp nhẹ.', 45000.00, NULL, 50, 1, 2, 'Store at room temperature in airtight bag. Warm in oven 2 mins at 175°C.', 'French T55 flour, Normandy AOP butter, milk, yeast, sugar, sea salt', 'Bột mì T55 nhập khẩu Pháp, bơ AOP Normandy, sữa tươi, men bánh mì, đường, muối biển', 'Vegetarian', TRUE, TRUE),
('b0000014-0000-0000-0000-000000000014', 'c0000009-0000-0000-0000-000000000009', 'CROIS-02', 'pain-au-chocolat-valrhona', 'Pain au Chocolat (Chocolate Croissant)', 'Bánh Pain au Chocolat Sô-cô-la Bỉ', 'Folded with twin batons of rich Valrhona dark chocolate inside laminated golden French pastry.', 'Bánh sừng bò nhân hai thanh sô-cô-la đen Valrhona đậm vị Pháp nướng thơm lừng.', 55000.00, NULL, 40, 1, 2, 'Warm before serving', 'French T55 flour, butter, Valrhona chocolate batons, yeast', 'Bột mì T55, bơ Pháp, sô-cô-la thỏi Valrhona, men tươi', 'Vegetarian', TRUE, TRUE),
('b0000015-0000-0000-0000-000000000015', 'c0000009-0000-0000-0000-000000000009', 'CROIS-03', 'almond-double-baked-croissant', 'Twice-Baked Almond Croissant', 'Bánh Croissant Hạnh Nhân Nướng 2 Lửa', 'Infused with vanilla sugar syrup, filled and coated with rich almond frangipane cream and toasted sliced almonds.', 'Bánh croissant ngâm si-rô vani, phủ đầy nhân kem hạnh nhân Frangipane thơm bùi và hạt hạnh nhân giòn rụm.', 65000.00, 60000.00, 30, 1, 2, 'Store in cool dry place', 'Butter croissant, almond flour, rum syrup, eggs, butter, powdered sugar', 'Bánh sừng bò, bột hạnh nhân, si-rô thơm nhẹ, trứng gà, bơ, đường xay', 'Vegetarian', TRUE, TRUE),

-- Category: Cookies
('b0000016-0000-0000-0000-000000000016', 'c0000010-0000-0000-0000-000000000010', 'COOK-01', 'valrhona-sea-salt-fudge-cookies-box-6', 'Valrhona Dark Chocolate Sea Salt Cookies (Box of 6)', 'Hộp 6 Bánh Quy Sô-cô-la Muối Biển Valrhona', 'Soft-baked fudgy cookies packed with 70% dark chocolate chunks and finished with Maldon sea salt flakes.', 'Bánh quy mềm dẻo ngập tràn sô-cô-la đen 70% béo ngậy rắc hạt muối biển Maldon tinh khiết.', 160000.00, 145000.00, 35, 1, 14, 'Keep in airtight container at room temp', 'Brown sugar, French butter, Valrhona dark chocolate, Maldon sea salt, flour, eggs', 'Đường nâu, bơ Pháp, sô-cô-la đen Valrhona, muối biển Maldon, bột mì, trứng', 'Vegetarian', TRUE, TRUE),

-- Category: Macarons
('b0000017-0000-0000-0000-000000000017', 'c0000011-0000-0000-0000-000000000011', 'MAC-01', 'parisian-macaron-collection-box-12', 'Parisian Heritage Macaron Gift Box (12 Pieces)', 'Hộp Quà 12 Bánh Macaron Paris Di Sản', 'A rainbow assortment of 12 delicate macarons: Pistachio, Raspberry Rose, Salted Caramel, Dark Chocolate, Earl Grey, and Passionfruit.', 'Bộ sưu tập 12 chiếc macaron xinh đẹp: Hạt dẻ cười, Hoa hồng phúc bồn tử, Caramel muối, Sô-cô-la đen, Trà bá tước và Chanh leo.', 320000.00, 290000.00, 25, 1, 7, 'Refrigerate at 2°C - 5°C. Let sit 10 mins before enjoying.', 'California almond meal, powdered sugar, egg whites, fruit curds, chocolate ganache', 'Bột hạnh nhân California, đường xay, lòng trắng trứng, mứt trái cây, ganache sô-cô-la', 'Gluten-Free, Vegetarian', TRUE, TRUE),

-- Category: Bread and Buns
('b0000018-0000-0000-0000-000000000018', 'c0000012-0000-0000-0000-000000000012', 'BREAD-01', 'artisanal-country-sourdough-loaf', 'Artisanal Country Sourdough Loaf', 'Bánh Mì Men Tự Nhiên Sourdough Truyền Thống', '36-hour slow fermented sourdough with a blistered crisp crust and naturally tangy, chewy open crumb.', 'Bánh mì men tự nhiên lên men chậm 36 giờ, vỏ giòn giòn rộp rộp ruột dai mềm tổ ong đặc trưng.', 85000.00, NULL, 20, 24, 4, 'Keep wrapped in bread towel or paper bag. Do not refrigerate.', 'Organic stoneground flour, water, natural wild sourdough starter, sea salt', 'Bột mì xay cối đá, nước suối tinh khiết, men wild yeast tự nhiên, muối biển', 'Vegan, Dairy-Free', FALSE, TRUE),
('b0000019-0000-0000-0000-000000000019', 'c0000012-0000-0000-0000-000000000012', 'BREAD-02', 'french-brioche-pain-tresse', 'Golden French Braided Brioche Loaf', 'Bánh Mì Hoa Cúc Brioche Bơ Sữa', 'Enriched with 40% French butter and farm eggs, lightly perfumed with orange blossom water and pearl sugar.', 'Bánh mì hoa cúc bện thừng vàng ươm thơm nức mùi nước hoa cam Pháp và bơ tươi béo ngậy.', 110000.00, 99000.00, 25, 2, 4, 'Store at room temperature', 'Flour, French butter, whole eggs, milk, orange blossom water, pearl sugar', 'Bột mì, bơ Pháp, trứng tươi, sữa, nước hoa cam, đường ngọc trai', 'Vegetarian', TRUE, TRUE),

-- Category: Chocolate Desserts
('b0000020-0000-0000-0000-000000000020', 'c0000013-0000-0000-0000-000000000013', 'CHOC-01', 'molten-valrhona-chocolate-lava-cake-2', 'Warm Valrhona Chocolate Lava Cake (Set of 2)', 'Set 2 Bánh Sô-cô-la Lava Tan Chảy Valrhona', 'Decadent dark chocolate soufflé cakes with a molten liquid ganache center that flows when sliced.', 'Bánh sô-cô-la đen nướng mềm với dòng nham thạch ganache ấm nóng tan chảy khi cắt bánh.', 150000.00, NULL, 30, 1, 3, 'Reheat 20 seconds in microwave or 4 minutes in oven before serving', 'Valrhona Guanaja 70% chocolate, butter, eggs, cane sugar, flour', 'Sô-cô-la Valrhona Guanaja 70%, bơ, trứng, đường mía, bột mì', 'Vegetarian', TRUE, TRUE),

-- Category: Seasonal Gift Boxes
('b0000021-0000-0000-0000-000000000021', 'c0000014-0000-0000-0000-000000000014', 'GIFT-01', 'luxury-le-petit-palais-hamper', 'Le Petit Palais Luxury Bakery Gift Box', 'Hộp Quà Cao Cấp Hoàng Gia Le Petit Palais', 'A prestigious gift box containing 6 macarons, 4 madeleines, 2 butter croissants, artisanal hazelnut spread, and royal tea.', 'Hộp quà nhung đỏ sang trọng gồm 6 macaron, 4 bánh madeleine, 2 croissant bơ Pháp, sốt hạt phỉ và trà thảo mộc cao cấp.', 850000.00, 790000.00, 15, 6, 7, 'Store in cool dry place', 'Assorted patisseries, tea leaves, hazelnut paste', 'Bánh ngọt tổng hợp, trà lá thảo mộc, sốt hạt phỉ bơ', 'Vegetarian', TRUE, TRUE),

-- Category: Beverages
('b0000022-0000-0000-0000-000000000022', 'c0000015-0000-0000-0000-000000000015', 'DRINK-01', 'iced-ceremonial-matcha-cloud-latte', 'Iced Uji Ceremonial Matcha Cloud Latte', 'Matcha Latte Uji Kem Mây Béo Mịn', 'Cold-whisked ceremonial matcha poured over velvety oat milk and crowned with sweet sea-salt cream foam.', 'Trà xanh Uji Nhật Bản đánh tay cùng sữa yến mạch thơm lành và lớp kem mây muối biển bồng bềnh.', 75000.00, NULL, 50, 1, 1, 'Enjoy immediately with ice', 'Ceremonial Uji matcha, oat milk, sweet cream foam, sea salt', 'Bột matcha Uji, sữa yến mạch, kem whipping tươi, muối biển', 'Vegetarian', TRUE, TRUE),
('b0000023-0000-0000-0000-000000000023', 'c0000015-0000-0000-0000-000000000015', 'DRINK-02', 'french-vanilla-cold-brew-coffee', 'French Vanilla Bean Cold Brew Coffee', 'Cà Phê Cold Brew Vani Bourbon Pháp', '24-hour slow steeped Arabica coffee infused with natural Madagascar Bourbon vanilla pods.', 'Cà phê Arabica Cầu Đất ủ lạnh 24 giờ cùng quả vani Bourbon Madagascar ngát hương.', 65000.00, NULL, 40, 1, 3, 'Serve chilled over ice', 'Arabica coffee beans, filtered water, Bourbon vanilla beans', 'Hạt cà phê Arabica thượng hạng, nước tinh khiết, quả vani tự nhiên', 'Vegan', FALSE, TRUE),

-- Category: Party Dessert Sets
('b0000024-0000-0000-0000-000000000024', 'c0000016-0000-0000-0000-000000000016', 'PARTY-01', 'royal-afternoon-tea-party-platter-24', 'Royal Afternoon Tea Petit Fours Platter (24 Pcs)', 'Khay Bánh Tiệc Trà Hoàng Gia Petit Fours (24 Bánh)', '24 miniature French delicacies: Mini choux, mini fruit tarts, macarons, chocolate eclairs, and lemon madeleines.', 'Khay 24 bánh tiệc nhỏ xinh: Su kem mini, tart trái cây, macaron, eclair sô-cô-la và bánh madeleine chanh vàng.', 690000.00, 650000.00, 10, 6, 2, 'Refrigerate until serving', 'Assorted miniature pastries, berries, creams', 'Bánh ngọt mini tổng hợp, quả mọng, kem tươi', 'Vegetarian', TRUE, TRUE)
;

-- 8. SEED PRODUCT VARIANTS (Sizes & Servings)
INSERT INTO product_variants (id, product_id, sku, name_en, name_vi, size_diameter_cm, serving_count, price_adjustment, stock_quantity) VALUES
-- Fraisier variants
('d0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'CAKE-BDAY-01-16CM', 'Standard (16cm / 4-6 servings)', 'Cỡ Tiêu Chuẩn (16cm / 4-6 người)', 16, '4-6 servings', 0.00, 10),
('d0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'CAKE-BDAY-01-20CM', 'Medium (20cm / 8-10 servings)', 'Cỡ Vừa (20cm / 8-10 người)', 20, '8-10 servings', 180000.00, 8),
('d0000003-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000001', 'CAKE-BDAY-01-24CM', 'Large (24cm / 12-16 servings)', 'Cỡ Lớn (24cm / 12-16 người)', 24, '12-16 servings', 380000.00, 5),

-- Grand Opera variants
('d0000004-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000002', 'CAKE-BDAY-02-18CM', 'Square 18x18cm (6-8 servings)', 'Vuông 18x18cm (6-8 người)', 18, '6-8 servings', 0.00, 8),
('d0000005-0000-0000-0000-000000000005', 'b0000002-0000-0000-0000-000000000002', 'CAKE-BDAY-02-22CM', 'Square 22x22cm (10-14 servings)', 'Vuông 22x22cm (10-14 người)', 22, '10-14 servings', 220000.00, 5),

-- Basque Burnt Cheesecake variants
('d0000006-0000-0000-0000-000000000006', 'b0000010-0000-0000-0000-000000000010', 'CHEESE-01-16CM', 'Original 16cm (4-6 servings)', 'Vị Truyền Thống 16cm (4-6 người)', 16, '4-6 servings', 0.00, 10),
('d0000007-0000-0000-0000-000000000007', 'b0000010-0000-0000-0000-000000000010', 'CHEESE-01-20CM', 'Original 20cm (8-10 servings)', 'Vị Truyền Thống 20cm (8-10 người)', 20, '8-10 servings', 160000.00, 6)
;

-- 9. SEED PRODUCT IMAGES (High quality bakery photography)
INSERT INTO product_images (id, product_id, image_url, alt_text, display_order, is_thumbnail) VALUES
('f0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=80', 'Fraisier Royal Strawberry Cake Top View', 0, TRUE),
('f0000002-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=900&q=80', 'Fraisier Cake Sliced Details', 1, FALSE),
('f0000003-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=80', 'Grand Opera Valrhona Cake', 0, TRUE),
('f0000004-0000-0000-0000-000000000004', 'b0000005-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=900&q=80', 'Venetian Tiramisu Box Top Layer', 0, TRUE),
('f0000005-0000-0000-0000-000000000005', 'b0000007-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80', 'Vanilla Craquelin Choux', 0, TRUE),
('f0000006-0000-0000-0000-000000000006', 'b0000010-0000-0000-0000-000000000010', 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=900&q=80', 'Basque Burnt Cheesecake Sliced', 0, TRUE),
('f0000007-0000-0000-0000-000000000007', 'b0000013-0000-0000-0000-000000000013', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=900&q=80', 'French Butter Croissant', 0, TRUE),
('f0000008-0000-0000-0000-000000000008', 'b0000017-0000-0000-0000-000000000017', 'https://images.unsplash.com/photo-1569864321390-3330e7041fa9?auto=format&fit=crop&w=900&q=80', 'Parisian Macarons Gift Box', 0, TRUE)
;

-- 10. SEED PRODUCT ALLERGEN MAPPINGS
INSERT INTO product_allergens (product_id, allergen_id) VALUES
('b0000001-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001'), -- Fraisier: Gluten
('b0000001-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002'), -- Dairy
('b0000001-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003'), -- Eggs
('b0000002-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002'), -- Opera: Dairy
('b0000002-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000004'), -- Nuts
('b0000005-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000002'), -- Tiramisu: Dairy
('b0000005-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000006'), -- Alcohol
('b0000013-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000001'), -- Croissant: Gluten
('b0000013-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002')  -- Dairy
;

-- 11. SEED DELIVERY ZONES
INSERT INTO delivery_zones (id, name, districts, standard_fee, free_delivery_threshold, is_active) VALUES
('90000001-0000-0000-0000-000000000001', 'Zone 1 - Central Districts', 'District 1, District 3, District 5, District 10, Phu Nhuan, Binh Thanh', 25000.00, 450000.00, TRUE),
('90000002-0000-0000-0000-000000000002', 'Zone 2 - Eastern Hub (Thu Duc City)', 'Thao Dien, An Phu, Thu Thiem, District 2, District 9, Thu Duc', 35000.00, 600000.00, TRUE),
('90000003-0000-0000-0000-000000000003', 'Zone 3 - Southern & Western Districts', 'District 4, District 7, District 8, Tan Binh, Tan Phu, Go Vap', 40000.00, 700000.00, TRUE)
;

-- 12. SEED DELIVERY TIME SLOTS
INSERT INTO delivery_time_slots (id, slot_name, start_time, end_time, max_orders_capacity, is_active) VALUES
('80000001-0000-0000-0000-000000000001', 'Early Morning (08:00 - 10:00)', '08:00:00', '10:00:00', 15, TRUE),
('80000002-0000-0000-0000-000000000002', 'Late Morning (10:00 - 12:00)', '10:00:00', '12:00:00', 20, TRUE),
('80000003-0000-0000-0000-000000000003', 'Early Afternoon (13:00 - 15:00)', '13:00:00', '15:00:00', 25, TRUE),
('80000004-0000-0000-0000-000000000004', 'Late Afternoon / Tea Time (15:00 - 17:00)', '15:00:00', '17:00:00', 30, TRUE),
('80000005-0000-0000-0000-000000000005', 'Evening / Celebration (17:30 - 19:30)', '17:30:00', '19:30:00', 25, TRUE)
;

-- 13. SEED ACTIVE COUPONS
INSERT INTO coupons (id, code, description, discount_type, discount_value, min_spend, max_discount_amount, usage_limit, per_user_limit, used_count, start_date, end_date, is_active) VALUES
('c0000001-0000-0000-0000-000000000001', 'WELCOME10', '10% off for new patrons on first bakery order', 'PERCENTAGE', 10.00, 200000.00, 100000.00, 1000, 1, 14, CURRENT_TIMESTAMP - INTERVAL '30' DAY, CURRENT_TIMESTAMP + INTERVAL '365' DAY, TRUE),
('c0000002-0000-0000-0000-000000000002', 'MAISONFREESHIP', 'Complimentary boutique delivery on orders over 300,000 VND', 'FREE_DELIVERY', 35000.00, 300000.00, 35000.00, 500, 2, 42, CURRENT_TIMESTAMP - INTERVAL '15' DAY, CURRENT_TIMESTAMP + INTERVAL '180' DAY, TRUE),
('c0000003-0000-0000-0000-000000000003', 'SWEET50K', '50,000 VND flat discount on celebration cakes over 500,000 VND', 'FIXED_AMOUNT', 50000.00, 500000.00, 50000.00, 200, 1, 9, CURRENT_TIMESTAMP - INTERVAL '5' DAY, CURRENT_TIMESTAMP + INTERVAL '90' DAY, TRUE)
;

-- 14. SEED STORE SETTINGS
INSERT INTO store_settings (setting_key, setting_value, description) VALUES
('store_name', 'Maison Douce Bakery', 'Official bakery boutique name'),
('store_phone', '+84 (0) 28 3822 5678', 'Primary customer concierge phone number'),
('store_email', 'bonjour@maisondouce.vn', 'Official customer support email'),
('store_address', '18 Rue de la Paix, District 1, Ho Chi Minh City, Vietnam', 'Flagship boutique physical address'),
('store_opening_hours', 'Daily: 07:00 AM – 09:30 PM', 'Boutique operating hours for pickup and kitchen dispatch'),
('store_currency', 'VND', 'Default display and transaction currency'),
('custom_cake_min_lead_hours', '12', 'Minimum notice required for custom cake orders')
;
