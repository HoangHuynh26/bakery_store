-- Flyway Migration V4: Enhance custom_cake_requests and seed initial bakery ingredients

ALTER TABLE custom_cake_requests ADD COLUMN IF NOT EXISTS customer_name VARCHAR(150);
ALTER TABLE custom_cake_requests ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);
ALTER TABLE custom_cake_requests ADD COLUMN IF NOT EXISTS customer_email VARCHAR(100);

-- Seed Essential Artisan Ingredients for Bakery Production
INSERT INTO ingredients (id, code, name, unit, current_stock, minimum_threshold, cost_per_unit)
VALUES
    ('ea000001-0000-0000-0000-000000000001', 'ING-BUTTER-FR', 'Bơ Lạc Pháp Elle & Vire 82% Béo', 'kg', 45.500, 10.000, 240000.00),
    ('ea000001-0000-0000-0000-000000000002', 'ING-CREAM-ANCH', 'Kem Sữa Tươi Whipping Anchor New Zealand', 'liter', 60.000, 15.000, 155000.00),
    ('ea000001-0000-0000-0000-000000000003', 'ING-FLOUR-T55', 'Bột Mì Thượng Hạng Grands Moulins De Paris T55', 'kg', 120.000, 25.000, 48000.00),
    ('ea000001-0000-0000-0000-000000000004', 'ING-CHOC-VAL70', 'Sô-cô-la Đen Valrhona Guanaja 70%', 'kg', 28.200, 8.000, 680000.00),
    ('ea000001-0000-0000-0000-000000000005', 'ING-VANILLA-MD', 'Quả Vani Madagascar Hạng A Nguyên Trái', 'piece', 150.000, 30.000, 35000.00),
    ('ea000001-0000-0000-0000-000000000006', 'ING-STRAW-DL', 'Dâu Tây Đà Lạt Tươi Loại 1', 'kg', 18.000, 5.000, 180000.00),
    ('ea000001-0000-0000-0000-000000000007', 'ING-EGGS-ORG', 'Trứng Gà Tươi Hữu Cơ Tiệt Trùng', 'piece', 500.000, 100.000, 4500.00),
    ('ea000001-0000-0000-0000-000000000008', 'ING-ALMOND-US', 'Bột Hạnh Nhân Blue Diamond Mỹ', 'kg', 35.000, 8.000, 320000.00),
    ('ea000001-0000-0000-0000-000000000009', 'ING-MATCHA-UJI', 'Bột Trà Xanh Matcha Uji Kyoto Hạng Nghi Lễ', 'kg', 6.500, 2.000, 1850000.00),
    ('ea000001-0000-0000-0000-000000000010', 'ING-MASCARPONE', 'Phô Mai Mascarpone Galbani Ý', 'kg', 24.000, 6.000, 260000.00);
