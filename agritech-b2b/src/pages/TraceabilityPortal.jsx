import React, { useState, useEffect } from 'react';
import { QrCode, MapPin, CheckCircle2, XCircle, Clock, Truck, Package, Leaf, ChevronRight, Search } from 'lucide-react';
import apiClient from '../api/client';

function TraceabilityPortal() {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState('');

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await apiClient.get('/batches/');
        setBatches(res.data);
      } catch (err) {
        console.error("Failed to fetch batches", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, []);

  const filteredBatches = searchId
    ? batches.filter(b => b.batch_id.toLowerCase().includes(searchId.toLowerCase()))
    : batches;

  const statusConfig = {
    CREATED: { color: 'badge-warning', icon: Package, label: 'At Village' },
    QUALITY_CHECKED: { color: 'badge-blue', icon: CheckCircle2, label: 'Quality Verified' },
    IN_TRANSIT: { color: 'badge-blue', icon: Truck, label: 'In Transit' },
    RECEIVED: { color: 'badge-success', icon: CheckCircle2, label: 'Received' },
    REJECTED: { color: 'badge-danger', icon: XCircle, label: 'Rejected' },
  };

  const timelineStages = ['CREATED', 'QUALITY_CHECKED', 'IN_TRANSIT', 'RECEIVED'];

  const getStageIndex = (status) => timelineStages.indexOf(status);

  return (
    <div className="animate-slide-up" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#1a1a2e' }}>
          <QrCode size={28} style={{ color: '#2d6a4f' }} />
          Farm-to-Fork Traceability
        </h1>
        <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>Track every batch from harvest to processor with full quality certification.</p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        display: 'flex', gap: '0.75rem', marginBottom: '2rem', 
        background: '#fff', padding: '1rem', borderRadius: '12px', 
        border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
      }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
          <input 
            type="text" 
            placeholder="Search by Batch ID..." 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ 
              width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', 
              border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '0.9rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selectedBatch ? '1fr 1.2fr' : '1fr', gap: '1.5rem' }}>
        
        {/* Batch List */}
        <div>
          <h3 style={{ fontWeight: '700', marginBottom: '1rem', fontSize: '1rem' }}>
            Active Batches ({filteredBatches.length})
          </h3>

          {loading && <p style={{ color: '#9ca3af', textAlign: 'center', padding: '2rem' }}>Loading batches...</p>}
          
          {!loading && filteredBatches.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', background: '#f9fafb', borderRadius: '12px', border: '1px dashed #d1d5db' }}>
              <QrCode size={48} style={{ color: '#d1d5db', margin: '0 auto 1rem' }} />
              <p style={{ color: '#6b7280' }}>No batches found. Batches are created when produce is logged by agents.</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredBatches.map(batch => {
              const config = statusConfig[batch.status] || statusConfig.CREATED;
              const Icon = config.icon;
              return (
                <div 
                  key={batch.id}
                  onClick={() => setSelectedBatch(batch)}
                  style={{ 
                    padding: '1rem 1.25rem', background: selectedBatch?.id === batch.id ? '#f0fdf4' : '#fff', 
                    borderRadius: '12px', border: selectedBatch?.id === batch.id ? '2px solid #2d6a4f' : '1px solid #e5e7eb',
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '0.9rem', color: '#2d6a4f' }}>
                      Batch #{batch.batch_id.slice(0, 8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '2px' }}>
                      {batch.commodity_name || 'Unknown'} · {batch.quantity_kg || '0'} kg
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} /> {batch.origin_village || 'Unknown Village'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className={`badge ${config.color}`} style={{ fontSize: '0.7rem' }}>
                      <Icon size={12} style={{ marginRight: '4px' }} /> {config.label}
                    </span>
                    <ChevronRight size={16} style={{ color: '#9ca3af' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Batch Detail Panel */}
        {selectedBatch && (
          <div style={{ 
            background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', 
            padding: '1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontWeight: '700', fontSize: '1.1rem' }}>Batch Detail</h3>
                <p style={{ color: '#6b7280', fontSize: '0.8rem', fontFamily: 'monospace' }}>{selectedBatch.batch_id}</p>
              </div>
              <div style={{ 
                background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', 
                padding: '0.75rem 1rem', textAlign: 'center' 
              }}>
                <QrCode size={48} style={{ color: '#2d6a4f' }} />
                <p style={{ fontSize: '0.65rem', color: '#6b7280', marginTop: '0.25rem' }}>Scan QR</p>
              </div>
            </div>

            {/* Info Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Farmer</p>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedBatch.farmer_name || 'N/A'}</p>
              </div>
              <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Commodity</p>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedBatch.commodity_name || 'N/A'}</p>
              </div>
              <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Quality Grade</p>
                <p style={{ fontWeight: '600', fontSize: '0.9rem', color: selectedBatch.quality_grade === 'A' ? '#16a34a' : '#f59e0b' }}>
                  {selectedBatch.quality_grade || 'Pending'}
                </p>
              </div>
              <div style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.7rem', color: '#9ca3af', textTransform: 'uppercase', fontWeight: '600' }}>Moisture</p>
                <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>{selectedBatch.moisture_content || 'N/A'}%</p>
              </div>
            </div>

            {/* Journey Timeline */}
            <h4 style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '1rem' }}>Supply Chain Journey</h4>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '1.5rem' }}>
              {/* Progress bar */}
              <div style={{ 
                position: 'absolute', top: '16px', left: '20px', right: '20px', height: '3px', 
                background: '#e5e7eb', zIndex: 0, borderRadius: '2px' 
              }}>
                <div style={{ 
                  width: `${(getStageIndex(selectedBatch.status) / (timelineStages.length - 1)) * 100}%`, 
                  height: '100%', background: '#2d6a4f', borderRadius: '2px', transition: 'width 0.5s' 
                }} />
              </div>

              {timelineStages.map((stage, i) => {
                const isActive = getStageIndex(selectedBatch.status) >= i;
                const labels = { CREATED: 'Harvested', QUALITY_CHECKED: 'Graded', IN_TRANSIT: 'In Transit', RECEIVED: 'Delivered' };
                const icons = { CREATED: Leaf, QUALITY_CHECKED: CheckCircle2, IN_TRANSIT: Truck, RECEIVED: Package };
                const StageIcon = icons[stage];
                return (
                  <div key={stage} style={{ textAlign: 'center', zIndex: 1, flex: 1 }}>
                    <div style={{ 
                      width: '36px', height: '36px', borderRadius: '50%', margin: '0 auto',
                      background: isActive ? '#2d6a4f' : '#e5e7eb', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.3s'
                    }}>
                      <StageIcon size={16} style={{ color: isActive ? '#fff' : '#9ca3af' }} />
                    </div>
                    <p style={{ fontSize: '0.7rem', marginTop: '0.5rem', fontWeight: isActive ? '600' : '400', color: isActive ? '#1a1a2e' : '#9ca3af' }}>
                      {labels[stage]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Quality Checkpoints */}
            {selectedBatch.checkpoints && selectedBatch.checkpoints.length > 0 && (
              <div>
                <h4 style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.75rem' }}>Quality Checkpoints</h4>
                {selectedBatch.checkpoints.map((cp, i) => (
                  <div key={i} style={{ 
                    display: 'flex', alignItems: 'center', gap: '0.75rem', 
                    padding: '0.75rem', background: cp.passed ? '#f0fdf4' : '#fef2f2', 
                    borderRadius: '8px', marginBottom: '0.5rem' 
                  }}>
                    {cp.passed 
                      ? <CheckCircle2 size={20} style={{ color: '#16a34a' }} />
                      : <XCircle size={20} style={{ color: '#dc2626' }} />
                    }
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: '600', fontSize: '0.85rem' }}>{cp.checkpoint_type.replace('_', ' ')}</p>
                      <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>Inspected by {cp.inspector_name}</p>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: '#9ca3af' }}>{new Date(cp.checked_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default TraceabilityPortal;
