import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { catalogService } from '../../services/catalogService';
import { ProductCard } from '../../components/product/ProductCard';
import { Search, Sparkles } from 'lucide-react';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['search-products', query],
    queryFn: () => catalogService.getProducts({ q: query, size: 24 }),
    enabled: !!query,
  });

  const { data: suggestions = [] } = useQuery({
    queryKey: ['search-suggestions', searchInput],
    queryFn: () => catalogService.getSearchSuggestions(searchInput),
    enabled: searchInput.trim().length >= 2,
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleSuggestionClick = (suggestedText) => {
    setSearchInput(suggestedText);
    setSearchParams({ q: suggestedText });
  };

  const products = searchResults?.data || [];
  const totalCount = searchResults?.totalElements || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Header Form */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="badge-luxury">Tra Cứu Bánh</span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-bakery-espresso">
          Tìm Kiếm Tuyệt Phẩm Bánh Ngọt
        </h1>

        <form onSubmit={handleSearchSubmit} className="relative mt-4">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm theo tên bánh, nguyên liệu (tiramisu, vani, dâu, phô mai...)"
            className="w-full pl-12 pr-28 py-3.5 bg-white rounded-full border border-stone-300 shadow-soft text-sm focus:outline-none focus:border-bakery-caramel"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 px-5 py-2 bg-bakery-caramel text-white rounded-full text-xs font-semibold hover:bg-bakery-caramel-dark transition"
          >
            Tìm Kiếm
          </button>
        </form>

        {/* Live Suggestions Chips */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-stone-500 font-medium">Gợi ý từ tiệm:</span>
            {suggestions.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSuggestionClick(item)}
                className="text-xs px-3 py-1 rounded-full bg-bakery-cream text-bakery-espresso hover:bg-bakery-caramel hover:text-white transition"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count Banner */}
      <div className="border-b border-stone-200 pb-4 flex items-center justify-between text-sm text-stone-600">
        <span>
          Kết quả tìm kiếm cho: <strong>"{query}"</strong>
        </span>
        <span className="font-semibold text-bakery-espresso">{totalCount} sản phẩm tìm thấy</span>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl h-80" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-base font-semibold text-bakery-espresso">
            Chưa tìm thấy món bánh nào khớp với từ khóa "{query}"
          </p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Quý khách có thể thử tìm kiếm với các từ khóa phổ biến: <em>Fraisier, Tiramisu, Choux, Croissant, Macaron</em>.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
