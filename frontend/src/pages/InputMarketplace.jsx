import React, { useState, useEffect } from 'react';
import { ShoppingBag, Sprout, Beaker, Bug, Wrench, Search, ShoppingCart, Star, Package, Check, ChevronDown } from 'lucide-react';
import apiClient from '../api/client';

function InputMarketplace() {
  const [products, setProducts] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'ALL', label: 'All Products', icon: ShoppingBag },
    { id: 'SEEDS', label: 'Seeds', icon: Sprout },
    { id: 'FERTILIZER', label: 'Fertilizer', icon: Beaker },
    { id: 'PESTICIDE', label: 'Pesticide', icon: Bug },
    { id: 'EQUIPMENT', label: 'Equipment', icon: Wrench },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, farmRes] = await Promise.all([
          apiClient.get('input-products/'),
          apiClient.get('farmers/')
        ]);
        setProducts(prodRes.data);
        setFarmers(farmRes.data);
      } catch (err) {
        console.error("Failed to load marketplace data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
      ));
    } else {
      setCart([...cart, { product, qty: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQty = (productId, newQty) => {
    if (newQty <= 0) { removeFromCart(productId); return; }
    setCart(cart.map(item => 
      item.product.id === productId ? { ...item, qty: newQty } : item
    ));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (parseFloat(item.product.price_per_unit) * item.qty), 0);

  const placeOrder = async () => {
    if (!selectedFarmer || cart.length === 0) return;
    try {
      for (const item of cart) {
        await apiClient.post('input-orders/', {
          farmer: selectedFarmer,
          agent: 1,
          product: item.product.id,
          quantity: item.qty,
          total_price: (parseFloat(item.product.price_per_unit) * item.qty).toFixed(2)
        });
      }
      setOrderSuccess(true);
      setCart([]);
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      console.error("Failed to place order", err);
    }
  };

  const categoryIcons = { SEEDS: '🌱', FERTILIZER: '🧪', PESTICIDE: '🛡️', EQUIPMENT: '🔧' };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1a1a2e' }}>
            <ShoppingBag size={28} style={{ color: '#2d6a4f' }} />
            Input Marketplace
          </h1>
          <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Premium quality seeds, fertilizers & equipment at wholesale prices for farmers.</p>
        </div>

        {/* Cart Button */}
        <button 
          onClick={() => setShowCart(!showCart)}
          style={{ 
            position: 'relative', padding: '0.75rem 1.25rem', background: '#2d6a4f', color: '#fff', 
            borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: '600',
            display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem'
          }}
        >
          <ShoppingCart size={20} />
          Cart
          {cart.length > 0 && (
            <span style={{ 
              position: 'absolute', top: '-6px', right: '-6px', background: '#dc2626', color: '#fff',
              borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: '700'
            }}>{cart.length}</span>
          )}
        </button>
      </div>

      {/* Success Message */}
      {orderSuccess && (
        <div style={{ 
          padding: '1rem 1.5rem', background: '#f0fdf4', border: '1px solid #bbf7d0', 
          borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' 
        }}>
          <Check size={24} style={{ color: '#16a34a' }} />
          <div>
            <p style={{ fontWeight: '700', color: '#16a34a' }}>Order placed successfully!</p>
            <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>The farmer's inputs will be delivered to their village.</p>
          </div>
        </div>
      )}

      {/* Search + Categories Bar */}
      <div style={{ 
        display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', padding: '0.7rem 0.7rem 0.7rem 2.5rem', 
              border: '1px solid #d1d5db', borderRadius: '10px', fontSize: '0.9rem', outline: 'none'
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {categories.map(cat => {
            const CatIcon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{ 
                  padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                  border: selectedCategory === cat.id ? '2px solid #2d6a4f' : '1px solid #d1d5db',
                  background: selectedCategory === cat.id ? '#f0fdf4' : '#fff',
                  color: selectedCategory === cat.id ? '#2d6a4f' : '#6b7280',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', transition: 'all 0.2s'
                }}
              >
                <CatIcon size={14} /> {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showCart ? '1fr 380px' : '1fr', gap: '1.5rem' }}>
        
        {/* Product Grid */}
        <div>
          {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '3rem' }}>Loading products...</p>}
          
          {!loading && filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
              <ShoppingBag size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
              <p style={{ color: '#6b7280' }}>No products found. Try a different category or search term.</p>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
            {filteredProducts.map(product => {
              const inCart = cart.find(item => item.product.id === product.id);
              return (
                <div key={product.id} style={{ 
                  background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb',
                  overflow: 'hidden', transition: 'all 0.2s', cursor: 'pointer',
                  boxShadow: inCart ? '0 0 0 2px #2d6a4f' : '0 1px 3px rgba(0,0,0,0.05)'
                }}>
                  {/* Product Image Placeholder */}
                  <div style={{ 
                    height: '140px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' 
                  }}>
                    <span style={{ fontSize: '3rem' }}>{categoryIcons[product.category] || '📦'}</span>
                    <span style={{ 
                      position: 'absolute', top: '8px', right: '8px', background: '#fff', 
                      padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: '600', color: '#2d6a4f'
                    }}>
                      {product.category}
                    </span>
                  </div>

                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1a1a2e' }}>{product.name}</p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>{product.brand}</p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.5rem' }}>
                      {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= 4 ? '#f59e0b' : 'none'} style={{ color: '#f59e0b' }} />)}
                      <span style={{ fontSize: '0.7rem', color: '#9ca3af', marginLeft: '4px' }}>4.0</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#2d6a4f' }}>₹{product.price_per_unit}</span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>/{product.unit}</span>
                      </div>
                      <button 
                        onClick={() => addToCart(product)}
                        style={{ 
                          padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: '600',
                          background: inCart ? '#dcfce7' : '#2d6a4f', color: inCart ? '#2d6a4f' : '#fff',
                          border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                      >
                        {inCart ? `✓ In Cart (${inCart.qty})` : '+ Add'}
                      </button>
                    </div>

                    <p style={{ fontSize: '0.7rem', color: product.stock_available > 10 ? '#16a34a' : '#f59e0b', marginTop: '0.5rem', fontWeight: '500' }}>
                      {product.stock_available > 10 ? `${product.stock_available} in stock` : `Only ${product.stock_available} left`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cart Sidebar */}
        {showCart && (
          <div style={{ 
            background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', 
            padding: '1.5rem', height: 'fit-content', position: 'sticky', top: '1rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingCart size={20} /> Order Cart
            </h3>

            {/* Farmer Selection */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Ordering for Farmer
              </label>
              <select 
                value={selectedFarmer} 
                onChange={(e) => setSelectedFarmer(e.target.value)}
                style={{ 
                  width: '100%', padding: '0.6rem', border: '1px solid #d1d5db', 
                  borderRadius: '8px', fontSize: '0.85rem', outline: 'none'
                }}
              >
                <option value="">Select a farmer...</option>
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.user?.first_name} {f.user?.last_name} ({f.village})
                  </option>
                ))}
              </select>
            </div>

            {cart.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af', padding: '2rem', fontSize: '0.85rem' }}>
                Cart is empty. Add products from the catalog.
              </p>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                  {cart.map(item => (
                    <div key={item.product.id} style={{ 
                      display: 'flex', alignItems: 'center', gap: '0.75rem', 
                      padding: '0.75rem', background: '#f9fafb', borderRadius: '10px' 
                    }}>
                      <span style={{ fontSize: '1.5rem' }}>{categoryIcons[item.product.category] || '📦'}</span>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{item.product.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>₹{item.product.price_per_unit}/{item.product.unit}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button onClick={() => updateQty(item.product.id, item.qty - 1)} style={{ 
                          width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d1d5db', 
                          background: '#fff', cursor: 'pointer', fontSize: '0.8rem' 
                        }}>-</button>
                        <span style={{ fontWeight: '600', fontSize: '0.9rem', minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.product.id, item.qty + 1)} style={{ 
                          width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #d1d5db', 
                          background: '#fff', cursor: 'pointer', fontSize: '0.8rem' 
                        }}>+</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Subtotal</span>
                    <span style={{ fontWeight: '600' }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ color: '#6b7280', fontSize: '0.85rem' }}>Delivery</span>
                    <span style={{ fontWeight: '600', color: '#16a34a' }}>FREE</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem', paddingTop: '0.5rem', borderTop: '2px solid #1a1a2e' }}>
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>Total</span>
                    <span style={{ fontWeight: '800', fontSize: '1.25rem', color: '#2d6a4f' }}>₹{cartTotal.toLocaleString()}</span>
                  </div>
                  
                  <button 
                    onClick={placeOrder}
                    disabled={!selectedFarmer || cart.length === 0}
                    style={{ 
                      width: '100%', padding: '0.85rem', background: selectedFarmer ? '#2d6a4f' : '#d1d5db', 
                      color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '0.95rem',
                      cursor: selectedFarmer ? 'pointer' : 'not-allowed', transition: 'all 0.2s'
                    }}
                  >
                    <Package size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                    Place Order for Farmer
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default InputMarketplace;
