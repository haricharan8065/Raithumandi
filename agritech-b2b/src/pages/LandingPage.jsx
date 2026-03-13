import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Briefcase, ChevronRight, ShieldCheck, Zap, TrendingUp, QrCode, ShoppingBag } from 'lucide-react';
import './landing.css';

function LandingPage() {
  return (
    <div className="landing-page min-h-screen bg-bg">
      {/* Navigation */}
      <nav className="landing-nav flex items-center justify-between px-8 py-4 bg-surface border-b border-border sticky top-0 z-50">
         <div className="text-2xl font-bold text-primary flex items-center gap-2">
            <Sprout size={28} />
            AgriConnect
         </div>
         <div className="flex gap-4">
            <Link to="/traceability" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <QrCode size={16} /> Traceability
            </Link>
            <Link to="/marketplace" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
               <ShoppingBag size={16} /> Marketplace
            </Link>
            <Link to="/processor" className="btn btn-outline">Processor Login</Link>
            <Link to="/agent" className="btn btn-primary">Agent App</Link>
         </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section relative overflow-hidden bg-primary text-white">
         <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1592982537447-6f2c6a0c02be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
         <div className="max-w-6xl mx-auto px-8 py-24 relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
               <h1 className="text-5xl font-extrabold leading-tight">
                  Direct from Farm. <br /> Straight to Factory.
               </h1>
               <p className="text-lg text-primary-light opacity-90 max-w-lg">
                  The Phygital B2B Agri-Marketplace connecting Indian smallholder farmers directly to major food processors, eliminating middlemen and multiplying margins.
               </p>
               <div className="flex gap-4 pt-4">
                  <button className="btn bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg">
                     Source Produce
                  </button>
                  <button className="btn border border-white/30 hover:bg-white/10 px-8 py-4 text-lg">
                     Become an Agent
                  </button>
               </div>
            </div>

            {/* Hero Stats Card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-sm ml-auto shadow-2xl">
               <div className="space-y-6">
                  <div>
                     <p className="text-primary-light text-sm font-semibold uppercase tracking-wider">Farmer Profit Margin</p>
                     <p className="text-4xl font-bold mt-1 text-white flex items-center gap-2">
                        +35% <TrendingUp size={24} className="text-success-light" />
                     </p>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                     <p className="text-primary-light text-sm font-semibold uppercase tracking-wider">Processor Cost Savings</p>
                     <p className="text-4xl font-bold mt-1 text-white flex items-center gap-2">
                        -12% <TrendingUp size={24} className="text-success-light transform rotate-180" />
                     </p>
                  </div>
               </div>
            </div>

         </div>
      </header>

      {/* Value Proposition Section */}
      <section className="py-24 bg-surface">
         <div className="max-w-6xl mx-auto px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl font-bold text-text-main mb-4">A Transparent "Phygital" Ecosystem</h2>
               <p className="text-muted">We combine local village trust with powerful digital escrow pipelines.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               
               {/* Feature 1 */}
               <div className="p-8 bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-primary-light text-primary rounded-xl flex items-center justify-center mb-6">
                     <ShieldCheck size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Escrow Protected</h3>
                  <p className="text-muted">Processors fund orders upfront into an RBI-regulated escrow. Funds release instantly to farmers upon verified quality delivery.</p>
               </div>

               {/* Feature 2 */}
               <div className="p-8 bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-yellow-50 text-secondary rounded-xl flex items-center justify-center mb-6">
                     <Zap size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Instant UPI Payouts</h3>
                  <p className="text-muted">No more 45-day wait times. Farmers receive immediate digital payouts via UPI the moment their crop passes grading.</p>
               </div>

               {/* Feature 3 */}
               <div className="p-8 bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                     <Sprout size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Village Champions</h3>
                  <p className="text-muted">Instead of expecting farmers to use complex apps, we empower local youth (Agents) to manage logistics and quality grading.</p>
               </div>

               {/* Feature 4 - Traceability */}
               <Link to="/traceability" className="p-8 bg-bg rounded-2xl border border-border hover:shadow-lg transition-shadow cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: '#ecfdf5', color: '#059669' }}>
                     <QrCode size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Farm-to-Fork Traceability</h3>
                  <p className="text-muted">Every batch gets a unique QR code. Track quality checkpoints from harvest → aggregation → transit → delivery with full transparency.</p>
                  <p style={{ color: '#2d6a4f', fontWeight: '600', marginTop: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     Explore → 
                  </p>
               </Link>

               {/* Feature 5 - Input Marketplace */}
               <Link to="/marketplace" className="p-8 bg-bg rounded-2xl border border-border hover:shadow-lg transition-shadow cursor-pointer" style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6" style={{ background: '#fef3c7', color: '#d97706' }}>
                     <ShoppingBag size={28} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">Input Marketplace</h3>
                  <p className="text-muted">Farmers can purchase high-quality seeds, fertilizers, and equipment at wholesale prices through agents. Closing the B2C loop.</p>
                  <p style={{ color: '#d97706', fontWeight: '600', marginTop: '0.75rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                     Shop Now →
                  </p>
               </Link>

            </div>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-text-main text-white py-16 text-center">
         <h2 className="text-3xl font-bold mb-6">Ready to digitize the agricultural supply chain?</h2>
         <div className="flex justify-center gap-4">
            <Link to="/processor" className="btn bg-white text-text-main hover:bg-gray-100">
               Enter Processor Portal <ChevronRight size={20} className="ml-2" />
            </Link>
         </div>
      </section>

    </div>
  );
}

export default LandingPage;
