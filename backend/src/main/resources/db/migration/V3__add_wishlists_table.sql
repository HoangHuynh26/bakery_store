-- ==============================================================================
-- MAISON DOUCE BAKERY - V3 WISHLISTS MIGRATION
-- ==============================================================================

CREATE TABLE IF NOT EXISTS wishlists (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_user_product_wishlist UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_product ON wishlists(product_id);
