import React from 'react';
import { ArrowRight, Wallet, Users, LayoutList } from 'lucide-react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard animate-slide-up">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-surface text-primary">
            <Wallet size={20} />
          </div>
          <div>
            <p className="stat-label">Wallet Balance</p>
            <h3 className="stat-value">₹45,200</h3>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon bg-surface text-secondary">
            <Users size={20} />
          </div>
          <div>
            <p className="stat-label">Farmers Active</p>
            <h3 className="stat-value">124</h3>
          </div>
        </div>
      </div>

      <h3 className="section-title">Quick Actions</h3>
      <div className="action-grid">
        <Link to="/agent/onboard" className="action-card">
          <Users size={28} className="text-primary mb-2" />
          <span className="action-label">Onboard Farmer</span>
        </Link>
        <Link to="/agent/log" className="action-card">
          <LayoutList size={28} className="text-secondary mb-2" />
          <span className="action-label">Log Produce</span>
        </Link>
      </div>

      <h3 className="section-title">Recent Transactions</h3>
      <div className="transaction-list">
        {[
          { id: 1, farmer: 'Ramesh Singh', crop: 'Tomatoes', amount: '₹12,400', date: 'Today, 10:45 AM' },
          { id: 2, farmer: 'Suresh Patel', crop: 'Onions', amount: '₹8,150', date: 'Yesterday' },
          { id: 3, farmer: 'Kavita Devi', crop: 'Wheat', amount: '₹22,000', date: 'Oct 24' },
        ].map(tx => (
          <div key={tx.id} className="transaction-item card">
            <div className="tx-details">
              <h4>{tx.farmer}</h4>
              <p>{tx.crop} • {tx.date}</p>
            </div>
            <div className="tx-amount text-success">
              +{tx.amount}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
