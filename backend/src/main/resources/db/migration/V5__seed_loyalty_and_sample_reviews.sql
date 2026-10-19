-- Flyway Migration V5: Seed Authentic Customer Product Reviews

INSERT INTO product_reviews (id, product_id, user_id, rating, comment, is_verified_purchase, is_approved) VALUES
('ea000002-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 5, 'Bánh Fraisier dâu tây Đà Lạt ngon xuất sắc! Kem mousseline béo ngậy chuẩn Pháp, dâu tây tươi mọng nước không bị chua gắt. Cả nhà ai cũng khen.', TRUE, TRUE),
('ea000002-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 5, 'Bánh Opera Valrhona 70% có lớp ganache cực kỳ mịn màng và hương cà phê thơm lừng. Đóng gói hộp rất sang trọng!', TRUE, TRUE),
('ea000002-0000-0000-0000-000000000003', 'b0000005-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 5, 'Tiramisu ngon nhất Sài Gòn mình từng ăn. Lớp phô mai mascarpone mềm tan, bánh sâm banh ngấm cà phê đậm đà.', TRUE, TRUE),
('ea000002-0000-0000-0000-000000000004', 'b0000013-0000-0000-0000-000000000013', '33333333-3333-3333-3333-333333333333', 5, 'Croissant giòn rụm bên ngoài và nhiều lớp tổ ong xốp bên trong, thơm nức mùi bơ Elle & Vire chuẩn tiệm bánh Paris.', TRUE, TRUE);
