// frontend/src/pages/ProductsPage.jsx
// 125Customs Product Listing - Amazon/Alibaba Redesign
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { productsAPI } from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState('all');
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const productsRes = await productsAPI.getAll();
      setProducts(productsRes.products || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (products.length > 0) {
      let filtered = [...products];

      // Filter by audience (B2B/B2C)
      if (activeFilter === 'b2b') {
        filtered = filtered.filter(p => p.audienceType === 'b2b' || p.audienceType === 'both');
      } else if (activeFilter === 'b2c') {
        filtered = filtered.filter(p => p.audienceType === 'b2c' || p.audienceType === 'both');
      }

      // Filter by category (if in URL)
      const categoryFilter = searchParams.get('category');
      if (categoryFilter) {
        filtered = filtered.filter(p => p.category === categoryFilter);
      }

      // Filter by price range
      if (priceRange !== 'all') {
        switch (priceRange) {
          case 'under1k':
            filtered = filtered.filter(p => p.basePrice < 1000);
            break;
          case '1k-5k':
            filtered = filtered.filter(p => p.basePrice >= 1000 && p.basePrice <= 5000);
            break;
          case '5k-20k':
            filtered = filtered.filter(p => p.basePrice > 5000 && p.basePrice <= 20000);
            break;
          case 'over20k':
            filtered = filtered.filter(p => p.basePrice > 20000);
            break;
        }
      }

      // Sort products
      switch (sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.basePrice - b.basePrice);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.basePrice - a.basePrice);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
      }

      setFilteredProducts(filtered);
    }
  }, [products, activeFilter, searchParams, sortBy, priceRange]);

  // Category filters - must match Product.category values exactly (they're
  // plain strings with no enum constraint in the schema, so these have to be
  // kept in sync by hand). Previously used underscores (asset_tags) while
  // real product data uses hyphens (asset-tags) - every filter except
  // "Trophies" was silently returning zero results.
  const categoryFilters = [
    { id: 'all', name: 'All Products', icon: '📦' },
    { id: 'asset-tags', name: 'Asset Tags', icon: '🏷️' },
    { id: 'equipment-labels', name: 'Equipment Labels', icon: '🏭' },
    { id: 'pet-tags', name: 'Pet ID Tags', icon: '🐕' },
    { id: 'keychains', name: 'Keychains', icon: '🔑' },
    { id: 'trophies', name: 'Trophies & Awards', icon: '🏆' },
    { id: 'signs', name: 'Signage & Plaques', icon: '📋' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {activeFilter === 'b2b' ? 'Industrial & B2B Products' : 
             activeFilter === 'b2c' ? 'Gifts & Personalized Products' : 
             'All Products'}
          </h1>
          <p className="text-gray-600">
            {activeFilter === 'b2b' 
              ? 'Asset tags, industrial labels, compliance plates - built to last.'
              : activeFilter === 'b2c'
              ? 'Pet tags, engraved gifts, custom keepsakes - made to order.'
              : 'Browse our full catalog of laser-engraved products.'}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Amazon Style */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-4">
              <h2 className="font-bold text-lg mb-4">Filters</h2>
              
              {/* Audience Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Who's This For?</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Products', icon: '📦' },
                    { id: 'b2b', label: 'For Business (B2B)', icon: '🏢' },
                    { id: 'b2c', label: 'For Gifts (B2C)', icon: '🎁' }
                  ].map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => {
                        setActiveFilter(filter.id);
                        if (filter.id === 'all') {
                          setSearchParams({});
                        } else {
                          setSearchParams({ audience: filter.id });
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 ${
                        activeFilter === filter.id ? 'bg-red-600 text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <span>{filter.icon}</span>
                      <span>{filter.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Category</h3>
                <div className="space-y-1">
                  {categoryFilters.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        if (cat.id === 'all') {
                          setSearchParams({});
                        } else {
                          setSearchParams({ category: cat.id });
                        }
                      }}
                      className="w-full text-left px-3 py-1.5 rounded text-sm hover:bg-gray-100 flex items-center gap-2"
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Price Range (KES)</h3>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under1k', label: 'Under 1,000' },
                    { id: '1k-5k', label: '1,000 - 5,000' },
                    { id: '5k-20k', label: '5,000 - 20,000' },
                    { id: 'over20k', label: 'Over 20,000' }
                  ].map((range) => (
                    <label key={range.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input 
                        type="radio" 
                        name="priceRange" 
                        checked={priceRange === range.id}
                        onChange={() => setPriceRange(range.id)}
                        className="accent-red-600" 
                      />
                      <span>{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Bulk Order CTA */}
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Need 50+ units?</p>
                <p className="text-xs text-gray-600 mb-3">
                  Get volume discounts (5-15% off) with our B2B pricing.
                </p>
                <Link
                  to="/quote-request"
                  className="block w-full bg-red-600 text-white text-center font-medium py-2 px-4 rounded hover:bg-red-700 transition-colors text-sm"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          </aside>

          {/* Product Grid - Amazon/Alibaba Style */}
          <main className="flex-1">
            {/* Sort Bar */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-sm text-gray-600">
                <span className="font-bold text-gray-900">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name: A-Z</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* Product Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group"
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 relative">
                    {/* Badge */}
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-10">
                        {product.badge}
                      </span>
                    )}

                    {/* Product Image */}
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center group-hover:bg-gray-50 transition-colors overflow-hidden">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/300x300?text=Product'}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          const initial = (product.name || '?').trim().charAt(0).toUpperCase();
                          const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300"><rect width="300" height="300" fill="#8B4513"/><text x="150" y="165" font-size="96" fill="#ffffff" text-anchor="middle" font-family="sans-serif">${initial}</text></svg>`;
                          e.target.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
                        }}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                      {/* Audience Badge */}
                      <Badge 
                        variant={product.audienceType === 'b2b' ? 'blue' : 'green'}
                        size="sm"
                      >
                        {product.audienceType === 'b2b' ? 'B2B' : 'B2C'}
                      </Badge>

                      {/* Product Name */}
                      <h3 className="font-medium text-sm leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between pt-2">
                        <span className="font-bold text-lg text-red-600">
                          KES {product.basePrice.toLocaleString()}
                        </span>
                        
                        {/* Quick Add to Cart (hover) */}
                        <span className="text-sm text-red-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          View Details →
                        </span>
                      </div>

                      {/* B2B Trust Signal */}
                      {product.audienceType === 'b2b' && (
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <span>✓</span> Bulk pricing available
                        </p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                <p className="text-gray-600 mb-4">No products found in this category yet.</p>
                <p className="text-sm text-gray-500 mb-6">
                  We're constantly adding new products. Contact us on WhatsApp for custom requests.
                </p>
                <Button
                  as="a"
                  href="https://wa.me/254700000000"
                  target="_blank"
                  variant="outline"
                  className="border-red-600 text-red-600"
                >
                  Chat with Us
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
