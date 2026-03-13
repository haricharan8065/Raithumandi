import React, { useState, useEffect } from 'react';
import { ArrowRight, Wallet, Users, LayoutList, Clock, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';

function Dashboard() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      try {
        const res = await apiClient.get('logs/');
        // Filter for requests that need validation/grading
        const pending = res.data.filter(item => item.status === 'LOGGED');
        setQueue(pending);
      } catch (err) {
        console.error("Failed to fetch queue", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQueue();
  }, []);

  return (
    <div className="dashboard animate-slide-up space-y-6 p-4">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-surface text-primary">
            <Wallet size={20} />
          </div>
          <div>
            <p className="stat-label">Commisssions</p>
            <h3 className="stat-value">₹45,200</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-surface text-secondary">
            <Users size={20} />
          </div>
          <div>
            <p className="stat-label">Assigned Farmers</p>
            <h3 className="stat-value">124</h3>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-yellow-600" />
          <div>
             <h4 className="font-bold text-yellow-800 text-sm">Action Required</h4>
             <p className="text-xs text-yellow-700">You have {queue.length} farmers waiting for quality check and grading.</p>
          </div>
        </div>
      </div>

      <h3 className="section-title flex items-center gap-2">
        <Clock size={20} className="text-secondary" /> Validation Queue
      </h3>
      
      <div className="space-y-3">
        {loading ? (
             <p className="text-muted text-center py-8">Loading queue...</p>
        ) : (
          queue.map(item => (
            <Link key={item.id} to={`/agent/log?id=${item.id}`} className="card p-4 border border-border flex items-center justify-between hover:border-primary transition-all group">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center text-xl font-bold text-primary group-hover:bg-primary-light transition-colors">
                    {item.farmer_name?.[0] || 'F'}
                 </div>
                 <div>
                    <h4 className="font-bold text-text-main">{item.farmer_name || 'Individual Farmer'}</h4>
                    <p className="text-xs text-muted">Requesting validation for {item.quantity_kg}kg {item.commodity_name}</p>
                 </div>
              </div>
              <ArrowRight size={20} className="text-muted group-hover:text-primary transform group-hover:translate-x-1 transition-all" />
            </Link>
          ))
        )}

        {queue.length === 0 && !loading && (
          <div className="text-center py-12 bg-bg rounded-2xl border border-dashed border-border opacity-50">
             <LayoutList size={40} className="mx-auto mb-2" />
             <p>Queue is empty. New farmer requests will appear here.</p>
          </div>
        )}
      </div>

      <h3 className="section-title">Management</h3>
      <div className="action-grid">
        <Link to="/agent/onboard" className="action-card">
          <Users size={28} className="text-primary mb-2" />
          <span className="action-label">Onboard Farmer</span>
        </Link>
        <Link to="/agent/log" className="action-card">
          <LayoutList size={28} className="text-secondary mb-2" />
          <span className="action-label">Manual Log</span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
