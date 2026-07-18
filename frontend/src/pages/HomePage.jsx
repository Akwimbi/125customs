// frontend/src/pages/HomePage.jsx
// 125Customs Home Page - Amazon/Alibaba-style Redesign
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useProductStore from '../stores/productStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

function HomePage() {
  const { products, loading, error } = useProductStore();
  const [mounted, setMounted] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    setMounted(true);
    const fetchProducts = async () => {
      try {
        await productStore.getState().fetchProducts();
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  // Use mock data only if not mounted yet or if loading and no products
  const displayProducts = !mounted ? [] : (loading && (!products || products.length === 0) ? [] : products);
  
  // Fallback to mock data if we have no products at all (initial load or error)
  const finalProducts = displayProducts.length > 0 ? displayProducts : [
    // These are just for initial layout - will be replaced by real data
    {
      id: 1,
      name: 'Industrial Asset Tag - Stainless Steel',
      price: 350,
      image: 'https://via.placeholder.com/300x300?text=Asset+Tag',
      rating: 4.8,
      reviews: 124,
      audience: 'b2b',
      badge: 'BESTSELLER'
    },
    {
      id: 2,
      name: 'Pet ID Tag - Brass (Custom Engraved)',
      price: 800,
      image: 'https://via.placeholder.com/300x300?text=Pet+Tag',
      rating: 4.9,
      reviews: 89,
      audience: 'b2c',
      badge: 'TOP RATED'
    },
    {
      id: 3,
      name: 'Trophy - Custom Engraved (Gold/Silver)',
      price: 2500,
      image: 'https://via.placeholder.com/300x300?text=Trophy',
      rating: 4.7,
      reviews: 56,
      audience: 'b2c',
      badge: 'NEW'
    }
  ];

  // Mock data for now (will connect to backend later)
  // const mockProducts = [  // REMOVED - using real data now
  //   {
  //     id: 1,
  //     name: 'Industrial Asset Tag - Stainless Steel',
  //     price: 350,
  //     image: 'https://via.placeholder.com/300x300?text=Asset+Tag',
  //     rating: 4.8,
  //     reviews: 124,
  //     audience: 'b2b',
  //     badge: 'BESTSELLER'
  //   },
  //   {
  //     id: 2,
  //     name: 'Pet ID Tag - Brass (Custom Engraved)',
  //     price: 800,
  //     image: 'https://via.placeholder.com/300x300?text=Pet+Tag',
  //     rating: 4.9,
  //     reviews: 89,
  //     audience: 'b2c',
  //     badge: 'TOP RATED'
  //   },
  //   {
  //     id: 3,
  //     name: 'Trophy - Custom Engraved (Gold/Silver)',
  //     price: 2500,
  //     image: 'https://via.placeholder.com/300x300?text=Trophy',
  //     rating: 4.7,
  //     reviews: 56,
  //     audience: 'b2c',
  //     badge: 'NEW'
  //   }
  // ];

  // Auto-rotate hero carousel
  const [currentSlide, setCurrentSlide] = useState(0);
  
  useEffect(() => {
    if (mounted) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % 3);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [mounted]);

  const heroSlides = [
    {
      title: 'Precision Laser Engraving',
      subtitle: 'Industrial-grade asset tagging & custom gifts',
      cta: 'Shop B2B',
      link: '/products?audience=b2b',
      bgColor: 'from-red-600 to-red-800'
    },
    {
      title: 'Personalized Gifts That Last',
      subtitle: 'Pet tags, keychains, trophies & more',
      cta: 'Shop B2C',
      link: '/products?audience=b2c',
      bgColor: 'from-blue-600 to-blue-800'
    },
    {
      title: 'Bulk Orders? Get a Quote',
      subtitle: 'Discounted pricing for 50+ units',
      cta: 'Request Quote',
      link: '/quote-request',
      bgColor: 'from-green-600 to-green-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Section */}
      <section className={`bg-gradient-to-r ${heroSlides[currentSlide].bgColor} text-white py-20 relative overflow-hidden`}>
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex gap-4">
              <Button
                as={Link}
                to={heroSlides[currentSlide].link}
                variant="primary"
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100"
              >
                {heroSlides[currentSlide].cta}
              </Button>
              <Button
                as={Link}
                to="/products"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                Browse All
              </Button>
            </div>
          </div>
        </div>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all $
                {index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'}
              }
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Categories Mega Menu Style */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-8 justify-center md:justify-start">
            {['Asset Tags', 'Pet Tags', 'Trophies', 'Keychains', 'Signs', 'Gifts'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-flex items-center justify-center group-hover:bg-red-50 transition-colors">
                  <span className="text-2xl">🏷️</span>
                </div>
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Today's Deals - Amazon Style */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold mb-6">Today's Deals</h2>
            <Link to="/products" className="text-red-600 hover:underline font-medium">
              See all deals →
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {finalProducts.slice(0, 6).map((product) => (
              <Card key={product.id} className="group cursor-pointer">
                <Link to={`/products/${product.id}`}>
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2 group-hover:text-red-600 transition-colors">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-red-600">
                        KES {product.price.toLocaleString()}
                      </span>
                      {product.audience === 'b2b' && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          B2B
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories - Alibaba Style */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* B2B Category */}
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://via.placeholder.com/600x400?text=Industrial+Tags"
                alt="B2B Industrial"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Industrial & B2B</h>
                <p className="mb-4 opacity-90">Asset tags, equipment labels, safety signs</p>
                <Link
                  to="/products?audience=b2b"
                  className="inline-block bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* B2C Category */}
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://via.placeholder.com/600x400?text=Personalized+Gifts"
                alt="B2C Gifts"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Gifts & Personalized</h>
                <p className="mb-4 opacity-90">Pet tags, keychains, trophies, keepsakes</p>
                <Link
                  to="/products?audience=b2c"
                  className="inline-block bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </div>

            {/* Bulk Orders */}
            <div className="relative h-80 rounded-lg overflow-hidden group cursor-pointer">
              <img
                src="https://via.placeholder.com/600x400?text=Bulk+Orders"
                alt="Bulk Orders"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Bulk Orders</h>
                <p className="mb-4 opacity-90">Discounted pricing for 50+ units</p>
                <Link
                  to="/quote-request"
                  className="inline-block bg-white text-black font-bold py-2 px-4 rounded hover:bg-gray-100 transition-colors"
                >
                  Get Quote →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'James M.',
                role: 'Facility Manager',
                review: 'Best asset tags we\'ve ever used. Durable, clear engraving, and fast turnaround.',
                rating: 5
              },
              {
                name: 'Sarah K.',
                role: 'Pet Owner',
                review: 'The pet tag is beautiful and the engraving is so precise. Highly recommend!',
                rating: 5
              },
              {
                name: 'Robert O.',
                role: 'Business Owner',
                review: 'Ordered 500 equipment labels. Quality is top-notch and they delivered on time.',
                rating: 5
              }
            ].map((review, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-lg">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{review.review}"</p>
                <div className="border-t pt-4">
                  <p className="font-bold">{review.name}</p>
                  <p className="text-sm text-gray-600">{review.role}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us - Trust Badges */}
      <section className="py-12 bg-white border-t">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose 125Customs?</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🎯', title: 'Precision Laser Tech', desc: 'State-of-the-art fiber laser for permanent markings' },
              { icon: '⚡', title: '24-48hr Turnaround', desc: 'Rush service available for urgent orders' },
              { icon: '💰', title: 'M-Pesa Payments', desc: 'Pay securely via M-Pesa or card' },
              { icon: '📦', title: 'Pickup Mtaani', desc: 'Convenient pickup locations across Nairobi' }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2>{feature.title}</h3>
                <p className="text-gray-600 text-sm>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 bg-red-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get 10% Off Your First Order</h2>
          <p className="text-xl mb-8 opacity-90">Subscribe to our newsletter for exclusive deals and updates</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <Button variant="primary" className="bg-white text-red-600 hover:bg-gray-100">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
