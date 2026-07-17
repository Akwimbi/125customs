// frontend/src/pages/ProductDetailPage.jsx
// 125Customs Product Detail - HUMAN-MADE (not vibe-coded)
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { productsAPI, cartAPI } from '../services/api';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customText, setCustomText] = useState('');
  const [selectedOptions, setSelectedOptions] = useState({});
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await productsAPI.getById(id);
      if (res.success) {
        setProduct(res.product);
        // Set default options
        if (res.product.options && res.product.options.length > 0) {
          const defaults = {};
          res.product.options.forEach(opt => {
            if (opt.options && opt.options.length > 0) {
              defaults[opt.name] = opt.options[0];
            }
          });
          setSelectedOptions(defaults);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setAdding(true);
    
    try {
      const cartItem = {
        productId: product.id,
        name: product.name,
        price: product.basePrice,
        quantity: quantity,
        customText: customText,
        options: selectedOptions,
        image: product.images ? product.images[0] : null
      };

      await cartAPI.addItem('default', cartItem);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Product not found.</p>
          <Link to="/products" className="text-[#8B4513] hover:underline">Back to Products</Link>
        </div>
      </div>
    );
  }

  // Calculate total price (base + options)
  let totalPrice = product.basePrice;
  // TODO: Add option pricing logic here

  return (
    <div className="min-h-screen py-8 bg-[#FAF8F5]">
      <div className="container-tight mx-auto px-4">
        {/* 
          HUMAN TOUCH: Asymmetric layout (not centered 2-column)
          Image on left (bigger), details on right (compact)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Image - BIG (not square thumbnail) */}
          <div className="aspect-square bg-white rounded-lg shadow-sm overflow-hidden">
            {/* PLACEHOLDER: Product photo (replace with real) */}
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-9xl">
                {product.category === 'asset_tags' ? '🏷️' : 
                 product.category === 'pet_tags' ? '🐕' :
                 product.category === 'trophies' ? '🏆' : '🎁'}
              </span>
              {/* TODO: <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" /> */}
            </div>
          </div>

          {/* Product Details - Compact (not stretched) */}
          <div>
            {/* Breadcrumb (human touch: specific, not generic) */}
            <nav className="mb-4">
              <Link to="/products" className="text-sm text-gray-500 hover:text-[#8B4513]">
                ← Back to {product.audienceType === 'b2b' ? 'Business Products' : 'Gift Products'}
              </Link>
            </nav>

            {/* Category badge */}
            <div className="mb-3">
              <Badge variant={product.audienceType === 'b2b' ? 'blue' : 'green'}>
                {product.audienceType === 'b2b' ? 'B2B - Business Use' : 'B2C - Personal/Gift'}
              </Badge>
              <Badge variant="gray" className="ml-2">{product.category.replace('_', ' ')}</Badge>
            </div>

            {/* Product name - Specific (not "Premium Product") */}
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
              {product.name}
            </h1>

            {/* Price - Clear KES format (not "$99/mo") */}
            <div className="mb-6">
              <span className="font-display text-3xl font-bold text-[#8B4513]">
                KES {totalPrice.toLocaleString()}
              </span>
              {product.audienceType === 'b2b' && (
                <p className="text-sm text-gray-600 mt-1">
                  Bulk discount: 5-15% for 50+ units
                </p>
              )}
            </div>

            {/* Short description - Benefit-driven (not feature list) */}
            <p className="text-gray-700 mb-8 leading-relaxed">
              {product.shortDescription}
            </p>

            {/* 
              HUMAN TOUCH: Customization options (not generic "Select Options")
              Real use case: What would a customer actually choose?
            */}
            {product.hasOptions && product.options && product.options.length > 0 && (
              <div className="mb-8 space-y-4">
                <h3 className="font-medium mb-2">Customize Your Order:</h3>
                
                {product.options.map((option, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {option.name}
                    </label>
                    
                    {option.type === 'select' && (
                      <select
                        value={selectedOptions[option.name] || ''}
                        onChange={(e) => handleOptionChange(option.name, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:border-[#8B4513] focus:outline-none"
                      >
                        <option value="">Choose...</option>
                        {option.options.map((opt, idx) => (
                          <option key={idx} value={opt}>{opt}</option>
                        ))}
                      </select>
                    )}

                    {option.type === 'text' && (
                      <Input
                        type="text"
                        placeholder={option.placeholder || `Enter ${option.name.toLowerCase()}...`}
                        value={customText}
                        onChange={(e) => setCustomText(e.target.value)}
                        helperText={option.helperText || ''}
                      />
                    )}

                    {option.type === 'number' && (
                      <Input
                        type="number"
                        min={option.min || 1}
                        max={option.max || 1000}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Quantity selector (for B2B bulk orders) */}
            {product.audienceType === 'b2b' && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (for bulk pricing)
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="text-xl font-medium w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  💡 Order 50+ for automatic discount
                </p>
              </div>
            )}

            {/* Add to Cart button - SPECIFIC (not "Add to Cart" generic) */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                loading={adding}
                onClick={handleAddToCart}
                className="bg-[#8B4513] hover:bg-[#654321]"
              >
                {product.hasOptions ? 'Add to Cart - KES ' + (totalPrice * quantity).toLocaleString() : 'Buy Now'}
              </Button>

              {/* HUMAN TOUCH: WhatsApp for custom requests (not live chat bot) */}
              <Button
                as="a"
                href={`https://wa.me/254700000000?text=${encodeURIComponent(`Hi! I'm interested in: ${product.name}\n\nCustomization: ${customText || 'None'}\nQuantity: ${quantity}`)}`}
                target="_blank"
                variant="outline"
                size="lg"
                fullWidth
                className="border-[#8B4513] text-[#8B4513]"
              >
                💬 Chat on WhatsApp
              </Button>
            </div>

            {/* 
              HUMAN TOUCH: Specific trust signals (not "Secure Checkout")
              Kenyan context: M-Pesa, Pickup Mtaani
            */}
            <div className="bg-[#F5F0EB] p-4 rounded-lg space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <span>✓</span>
                <span>Pay with M-Pesa or Card (via Paystack)</span>
              </p>
              <p className="flex items-center gap-2">
                <span>✓</span>
                <span>Pick up in Nairobi CBD or deliver via Pickup Mtaani</span>
              </p>
              <p className="flex items-center gap-2">
                <span>✓</span>
                <span>WhatsApp support: +254 700 000 000</span>
              </p>
            </div>

            {/* 
              HUMAN TOUCH: Real product details (not AI-generated "Features")
              What would a customer actually want to know?
            */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="font-display text-lg font-semibold mb-4">Product Details</h3>
              <div className="prose prose-sm max-w-none text-gray-700">
                <p>{product.longDescription || 'No detailed description yet. Contact us for specifics.'}</p>
                
                {/* HUMAN TOUCH: Specific details (not generic list) */}
                {product.material && (
                  <p><strong>Material:</strong> {product.material}</p>
                )}
                {product.dimensions && (
                  <p><strong>Dimensions:</strong> {product.dimensions}</p>
                )}
                {product.durability && (
                  <p><strong>Durability:</strong> {product.durability}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 
          HUMAN TOUCH: Related products (not "You might also like")
          Specific: Same category, not generic recommendations
        */}
        <section className="border-t border-gray-200 pt-12">
          <h2 className="font-display text-2xl font-bold mb-8">Similar {product.category.replace('_', ' ')}</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products
              .filter(p => p.category === product.category && p.id !== product.id)
              .slice(0, 4)
              .map((related) => (
                <Link
                  key={related.id}
                  to={`/products/${related.id}`}
                  className="group"
                >
                  <Card variant="subtle" className="p-4 hover:shadow-md transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                      <span className="text-4xl">
                        {related.category === 'asset_tags' ? '🏷️' : '🎁'}
                      </span>
                    </div>
                    <h3 className="font-medium text-sm mb-1">{related.name}</h3>
                    <span className="font-display text-lg font-bold text-[#8B4513]">
                      KES {related.basePrice.toLocaleString()}
                    </span>
                  </Card>
                </Link>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default ProductDetailPage;
