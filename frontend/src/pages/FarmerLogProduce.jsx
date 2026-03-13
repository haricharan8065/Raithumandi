import React, { useState, useEffect } from 'react';
import { Camera, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import apiClient from '../api/client';
import { useNavigate } from 'react-router-dom';

function FarmerLogProduce() {
  const [commodities, setCommodities] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCommodities = async () => {
      try {
        const res = await apiClient.get('commodities/');
        setCommodities(res.data);
        if (res.data.length > 0) setSelectedCommodity(res.data[0].id);
      } catch (err) {
        console.error("Failed to load commodities", err);
      }
    };
    fetchCommodities();
  }, []);

  const handleSubmit = async () => {
    if (!selectedCommodity || !quantity) {
      setError("Please specify crop and expected quantity.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await apiClient.post('logs/', {
        farmer: 1, // Hardcoded for demo - Sridhar
        commodity: selectedCommodity,
        agent: 1, // Initially assigned to a default pool agent
        quantity_kg: quantity,
        applied_rate: 0, // Rate will be determined by Agent during grading
        status: 'LOGGED'
      });
      setSuccess(true);
      setTimeout(() => navigate('/farmer'), 2000);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 animate-slide-up h-[80vh]">
        <div className="w-20 h-20 bg-success-light text-success rounded-full flex items-center justify-center">
          <CheckCircle2 size={40} />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold">Request Submitted!</h2>
          <p className="text-muted mt-2">A Village Agent will reach out shortly for quality grading and pickup.</p>
        </div>
        <button onClick={() => navigate('/farmer')} className="btn btn-primary btn-full bg-[#16a34a]">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up">
      <div className="page-header">
        <h2 className="text-2xl font-bold text-text-main">List Your Produce</h2>
        <p className="text-muted">Tell us what's ready for harvest.</p>
      </div>

      <div className="card p-6 space-y-6 border border-border">
        <div className="input-group">
          <label className="input-label">What are you selling?</label>
          <select 
            className="input-field bg-white" 
            value={selectedCommodity} 
            onChange={e => setSelectedCommodity(e.target.value)}
          >
            {commodities.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.grade})</option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label className="input-label">Estimated Quantity (Kg)</label>
          <div className="relative">
            <Scale size={18} className="absolute left-3 top-3 text-muted" />
            <input 
              type="number" 
              className="input-field pl-10" 
              placeholder="E.g., 500" 
              value={quantity}
              onChange={e => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="upload-box bg-bg border-dashed border-2 border-border p-8 rounded-2xl text-center">
           <Camera size={32} className="mx-auto text-muted mb-2" />
           <p className="text-sm font-semibold">Keep photos ready</p>
           <p className="text-xs text-muted">Photos aren't mandatory now, but keep them ready for the agent visit.</p>
        </div>

        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 italic text-sm text-yellow-700">
          Note: Final price will be determined based on the quality grade (Refraction, Moisture, Silt) verified by the agent.
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <button 
          className="btn btn-primary btn-full py-4 bg-[#16a34a]" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Confirm Listing'} <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default FarmerLogProduce;
