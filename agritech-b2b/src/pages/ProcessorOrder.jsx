import React, { useState, useEffect } from 'react';
import { PackagePlus, Info, Receipt } from 'lucide-react';
import apiClient from '../api/client';

function ProcessorOrder() {
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [qty, setQty] = useState('5000');
  const [platformPrice, setPlatformPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCommodities = async () => {
       try {
          const res = await apiClient.get('/commodities/');
          setCommodities(res.data);
          if (res.data.length > 0) {
             const first = res.data[0];
             setSelectedCommodity(first.id);
             setPlatformPrice(parseFloat(first.current_price_per_kg));
          }
       } catch (err) {
          console.error("Failed to load commodities", err);
       }
    };
    fetchCommodities();
  }, []);

  const handleCommodityChange = (e) => {
     const id = e.target.value;
     setSelectedCommodity(id);
     const commodity = commodities.find(c => c.id.toString() === id);
     if (commodity) {
        setPlatformPrice(parseFloat(commodity.current_price_per_kg));
     }
  };

  const submitOrder = async () => {
     setLoading(true);
     setError(null);
     try {
        const estimatedEscrow = parseInt(qty) * platformPrice * 1.08;
        await apiClient.post('/orders/', {
           processor: 1, // Assumes a processor profile with ID=1 exists
           commodity: selectedCommodity,
           target_quantity_kg: parseInt(qty),
           target_delivery_date: '2026-10-30', // Hardcoded for prototype mockup
           status: 'PENDING',
           escrow_amount: estimatedEscrow.toFixed(2)
        });
        setSuccess(true);
     } catch (err) {
        setError(err.response?.data?.detail || "Failed to place order.");
     } finally {
        setLoading(false);
     }
  };
  
  const estimatedTotal = parseInt(qty || 0) * platformPrice;

  return (
    <div className="animate-slide-up max-w-4xl mx-auto">
       <div className="bg-white rounded-lg border border-border overflow-hidden shadow-sm">
          
          <div className="p-6 border-b border-border bg-gray-50 flex items-center justify-between">
             <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                   <PackagePlus className="text-primary" />
                   Create Sourcing Request
                </h2>
                <p className="text-sm text-muted mt-1">Broadcast your demand to Village Agents across our network.</p>
             </div>
             <span className="badge badge-blue text-sm">Escrow Backed</span>
          </div>

          <div className="p-6 flex gap-8">
             {/* Form Section */}
             <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                   <div className="input-group">
                      <label className="input-label text-sm">Commodity required</label>
                      <select 
                        className="input-field bg-white"
                        value={selectedCommodity}
                        onChange={handleCommodityChange}
                      >
                         {commodities.map(c => (
                             <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
                         ))}
                      </select>
                   </div>
                   <div className="input-group">
                      <label className="input-label text-sm">Target Delivery Date</label>
                      <input type="date" className="input-field bg-white" defaultValue="2026-10-30" />
                   </div>
                </div>

                <div className="input-group">
                   <label className="input-label text-sm">Required Quantity (Kg)</label>
                   <input 
                      type="number" 
                      className="input-field bg-white" 
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                   />
                </div>

                <div className="input-group">
                   <label className="input-label text-sm">Quality Parameters (Optional remarks)</label>
                   <textarea className="input-field bg-white min-h-[100px]" placeholder="E.g., Require firm tomatoes suitable for pureeing, moisture content < X%..."></textarea>
                </div>
             </div>

             {/* Order Summary Section */}
             <div className="w-80 bg-gray-50 p-6 rounded-lg border border-border h-fit">
                <h3 className="font-bold flex items-center gap-2 mb-4">
                   <Receipt size={18}/>
                   Order Summary
                </h3>
                
                <div className="space-y-3 text-sm mb-6 border-b border-border pb-4">
                   <div className="flex justify-between">
                      <span className="text-muted">Avg. Platform Rate</span>
                      <span className="font-medium">₹{platformPrice}/kg</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-muted">Requested Qty</span>
                      <span className="font-medium">{parseInt(qty).toLocaleString()} kg</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-muted">Logistics & Handling (Est.)</span>
                      <span className="font-medium">+ 8%</span>
                   </div>
                </div>

                <div className="flex justify-between items-end mb-6">
                   <span className="font-semibold text-text-main">Estimated Total</span>
                   <span className="text-2xl font-bold text-primary">₹{(estimatedTotal * 1.08).toLocaleString()}</span>
                </div>

                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded mb-6 flex gap-2 items-start">
                   <Info size={16} className="shrink-0 mt-0.5" />
                   <p>Funds will be held in escrow and released to farmers/agents only upon successful quality check at your facility.</p>
                </div>

                {error && <div className="text-red-500 mb-4 p-2 bg-red-50 rounded text-sm">{error}</div>}
                {success && <div className="text-green-600 mb-4 p-2 bg-green-50 rounded text-sm font-semibold">Order placed successfully!</div>}

                <button className="btn btn-primary btn-full" onClick={submitOrder} disabled={loading || success}>
                   {loading ? 'Processing...' : (success ? 'Order Broadcasted' : 'Fund Escrow & Broadcast')}
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}

export default ProcessorOrder;
