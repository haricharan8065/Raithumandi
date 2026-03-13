import React, { useState, useEffect } from 'react';
import { Wallet, Package, Clock, CheckCircle, ArrowRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

function FarmerDashboard() {
  const [stats, setStats] = useState({
    walletBalance: 12450,
    activeRequests: 2,
    completedSales: 45000
  });
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // In a real app, we'd filter by authenticated farmer ID
        const res = await apiClient.get('logs/');
        setRequests(res.data.slice(0, 5)); // Just show recent ones
      } catch (err) {
        console.error("Failed to load requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="farmer-dashboard p-6 space-y-6 animate-slide-up">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card bg-success text-white p-4 flex flex-col justify-between h-32">
          <Wallet size={24} className="opacity-80" />
          <div>
            <p className="text-xs opacity-80 uppercase font-bold tracking-wider">Earnings</p>
            <p className="text-2xl font-bold">₹{stats.walletBalance.toLocaleString()}</p>
          </div>
        </div>
        <div className="card bg-surface p-4 flex flex-col justify-between h-32 border border-border">
          <Package size={24} className="text-primary" />
          <div>
            <p className="text-xs text-muted uppercase font-bold tracking-wider">Requests</p>
            <p className="text-2xl font-bold text-text-main">{stats.activeRequests}</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link to="/farmer/sell" className="btn btn-primary btn-full py-4 text-lg bg-[#16a34a] hover:bg-[#15803d]">
        <PlusCircle size={20} className="mr-2" /> List New Produce
      </Link>

      {/* Request Queue */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Your Recent Requests
        </h3>
        
        {loading ? (
          <p className="text-muted text-center py-8">Loading your requests...</p>
        ) : (
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="card p-4 border border-border flex items-center justify-between hover:border-primary transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg rounded-lg flex items-center justify-center text-2xl">
                    {req.commodity_name?.includes('Rice') ? '🌾' : '🍅'}
                  </div>
                  <div>
                    <h4 className="font-bold text-text-main">{req.commodity_name || 'Produce'}</h4>
                    <p className="text-sm text-muted">{req.quantity_kg} Kg • {new Date(req.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                    req.status === 'LOGGED' ? 'bg-blue-100 text-blue-600' : 
                    req.status === 'GRADED' ? 'bg-yellow-100 text-yellow-600' : 'bg-success-light text-success'
                  }`}>
                    {req.status}
                  </span>
                  <p className="text-sm font-bold text-text-main mt-1">₹{parseFloat(req.applied_rate * req.quantity_kg).toLocaleString()}</p>
                </div>
              </div>
            ))}
            
            {requests.length === 0 && (
              <div className="text-center py-12 bg-bg rounded-2xl border border-dashed border-border">
                <Package size={40} className="text-muted mx-auto mb-3 opacity-20" />
                <p className="text-muted">No produce listed yet. Click button above to start.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="bg-primary-light/20 p-4 rounded-2xl border border-primary/10">
        <p className="text-sm text-text-main font-semibold mb-1">How it works:</p>
        <ul className="text-xs text-muted space-y-2 list-disc pl-4">
          <li>Declare your produce and quantity.</li>
          <li>A Village Agent will be assigned to your request.</li>
          <li>Agent visits your farm for quality grading.</li>
          <li>Get paid instantly once grading is confirmed!</li>
        </ul>
      </div>
    </div>
  );
}

export default FarmerDashboard;
