import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowUpRight, Clock } from 'lucide-react';
import apiClient from '../api/client';

function ProcessorDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
       try {
          // In a real app we would filter by processor_id
          const res = await apiClient.get('/orders/');
          setOrders(res.data);
       } catch (err) {
          console.error("Failed to fetch orders", err);
       } finally {
          setLoading(false);
       }
    };
    fetchOrders();
  }, []);

  // Compute metrics
  const activeOrdersCount = orders.filter(o => o.status === 'PENDING' || o.status === 'AGGREGATING').length;
  const inTransitTons = orders.filter(o => o.status === 'IN_TRANSIT').reduce((acc, o) => acc + (o.target_quantity_kg / 1000), 0);
  const deliveredTons = orders.filter(o => o.status === 'DELIVERED').reduce((acc, o) => acc + (o.target_quantity_kg / 1000), 0);

  return (
    <div className="animate-slide-up space-y-8">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="metric-card border-l-4 border-l-primary">
          <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm text-muted font-semibold">Total Sourced (All Time)</p>
                <h3 className="text-2xl font-bold mt-1">{deliveredTons.toFixed(1)} Tons</h3>
             </div>
             <div className="p-2 bg-primary-light rounded-lg text-primary">
                <Package size={24} />
             </div>
          </div>
          <p className="text-xs text-success flex items-center gap-1 font-medium">
             <ArrowUpRight size={14} /> +12% from last month
          </p>
        </div>

        <div className="metric-card border-l-4 border-l-secondary">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-sm text-muted font-semibold">Active Orders</p>
                <h3 className="text-2xl font-bold mt-1">{activeOrdersCount}</h3>
             </div>
             <div className="p-2 bg-yellow-50 rounded-lg text-secondary">
                <Clock size={24} />
             </div>
          </div>
          <p className="text-xs text-muted flex items-center gap-1 font-medium">
             Pending fulfillment
          </p>
        </div>

        <div className="metric-card border-l-4 border-l-blue-500">
          <div className="flex justify-between items-start mb-4">
             <div>
                <p className="text-sm text-muted font-semibold">In Transit</p>
                <h3 className="text-2xl font-bold mt-1">{inTransitTons.toFixed(1)} Tons</h3>
             </div>
             <div className="p-2 bg-blue-50 rounded-lg text-blue-500">
                <Truck size={24} />
             </div>
          </div>
          <p className="text-xs text-muted flex items-center gap-1 font-medium">
             Arriving today
          </p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <h3 className="text-lg font-bold mb-4">Recent Sourcing Activity</h3>
      <div className="table-container shadow-sm border border-border">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Commodity</th>
              <th>Quantity</th>
              <th>Origin Region</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
             {loading && <tr><td colSpan="6" className="text-center py-4 text-muted">Loading orders...</td></tr>}
             {!loading && orders.length === 0 && <tr><td colSpan="6" className="text-center py-4 text-muted">No active orders found.</td></tr>}
             
             {orders.map(order => (
               <tr key={order.id}>
                 <td className="font-semibold text-primary">#ORD-{order.id.toString().padStart(4, '0')}</td>
                 <td>{order.commodity_name} ({order.commodity_grade})</td>
                 <td>{order.target_quantity_kg.toLocaleString()} Kg</td>
                 <td>Multi-origin</td>
                 <td>
                    <span className={`badge ${
                       order.status === 'DELIVERED' ? 'badge-success' : 
                       order.status === 'IN_TRANSIT' ? 'badge-blue' : 'badge-warning'
                    }`}>
                       {order.status.replace('_', ' ')}
                    </span>
                 </td>
                 <td className="text-sm text-muted">{new Date(order.created_at).toLocaleDateString()}</td>
               </tr>
             ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default ProcessorDashboard;
