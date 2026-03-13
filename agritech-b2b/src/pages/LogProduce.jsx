import React, { useState, useEffect } from 'react';
import { Camera, Scale, Calculator } from 'lucide-react';
import apiClient from '../api/client';

function LogProduce() {
  const [farmers, setFarmers] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerKg, setPricePerKg] = useState('0');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch farmers and commodities on mount
    const fetchData = async () => {
      try {
        const [farmersRes, commoditiesRes] = await Promise.all([
          apiClient.get('/farmers/'),
          apiClient.get('/commodities/')
        ]);
        setFarmers(farmersRes.data);
        setCommodities(commoditiesRes.data);
        
        if (farmersRes.data.length > 0) setSelectedFarmer(farmersRes.data[0].id);
        if (commoditiesRes.data.length > 0) {
           setSelectedCommodity(commoditiesRes.data[0].id);
           setPricePerKg(commoditiesRes.data[0].current_price_per_kg);
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    };
    fetchData();
  }, []);

  const handleCommodityChange = (e) => {
    const id = e.target.value;
    setSelectedCommodity(id);
    const commodity = commodities.find(c => c.id.toString() === id);
    if (commodity) {
       setPricePerKg(commodity.current_price_per_kg);
    }
  };

  const handleDispatch = async () => {
     if (!selectedFarmer || !selectedCommodity || !quantity) {
         setError("Please fill all fields");
         return;
     }
     setLoading(true);
     setError(null);
     try {
         // Agent ID is hardcoded for the prototype unless auth is implemented
         await apiClient.post('/logs/', {
            farmer: selectedFarmer,
            commodity: selectedCommodity,
            agent: 1, // Assumes Admin user exists with ID=1
            quantity_kg: quantity,
            applied_rate: pricePerKg,
            status: 'LOGGED'
         });
         setSuccess(true);
         setQuantity('');
     } catch (err) {
         setError(err.response?.data?.detail || "Failed to log produce.");
     } finally {
         setLoading(false);
     }
  };
  
  const totalPayout = quantity ? parseFloat(quantity) * parseFloat(pricePerKg) : 0;

  return (
    <div className="log-produce animate-slide-up">
      <div className="page-header">
        <h2>Log Incoming Produce</h2>
        <p>Record crop details for direct-to-processor routing.</p>
      </div>

      <div className="card">
         <div className="input-group">
            <label className="input-label">Select Farmer</label>
            <select className="input-field bg-white" value={selectedFarmer} onChange={e => setSelectedFarmer(e.target.value)}>
               {farmers.map(f => (
                  <option key={f.id} value={f.id}>{f.user?.first_name} {f.user?.last_name} ({f.village})</option>
               ))}
               {farmers.length === 0 && <option value="">Loading farmers...</option>}
            </select>
         </div>

         <div className="input-group">
            <label className="input-label">Crop Type</label>
            <select className="input-field bg-white" value={selectedCommodity} onChange={handleCommodityChange}>
               {commodities.map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
               ))}
               {commodities.length === 0 && <option value="">Loading crops...</option>}
            </select>
         </div>

         <div className="flex gap-4">
            <div className="input-group flex-1">
               <label className="input-label">Quantity (Kg)</label>
               <div className="icon-input">
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="0.0" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
               </div>
            </div>
             <div className="input-group flex-1">
               <label className="input-label">Platform Rate (₹/Kg)</label>
               <div className="icon-input">
                  <input type="number" className="input-field bg-bg" value={pricePerKg} readOnly />
               </div>
            </div>
         </div>

         <div className="upload-box my-4">
            <Camera size={32} className="text-muted mb-2" />
            <p>Upload Produce Photo for Processor Verification</p>
         </div>

         <div className="payout-estimate bg-primary-light p-4 rounded-lg mt-4 border border-primary/20">
            <div className="flex justify-between items-center mb-2">
               <span className="text-main font-semibold">Estimated Farmer Payout</span>
               <span className="text-2xl font-bold text-primary">₹{totalPayout.toLocaleString()}</span>
            </div>
            <p className="text-xs text-muted">Amount will be sent instantly to farmer's registered UPI upon processor confirmation.</p>
         </div>

         {error && <div className="text-red-500 mt-4 p-2 bg-red-50 rounded text-sm">{error}</div>}
         {success && <div className="text-green-600 mt-4 p-2 bg-green-50 rounded text-sm font-semibold">Produce logged successfully!</div>}

         <button className="btn btn-primary btn-full mt-4" onClick={handleDispatch} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm & Dispatch'}
         </button>
      </div>
    </div>
  );
}

export default LogProduce;
