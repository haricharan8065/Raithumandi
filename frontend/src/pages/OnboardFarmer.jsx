import React, { useState } from 'react';
import { UserPlus, Camera, Upload } from 'lucide-react';
import apiClient from '../api/client';

function OnboardFarmer() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    village: '',
    district: '',
    aadhaar: '',
    upi: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Create User
      const [firstName, ...lastNameParts] = formData.fullName.split(' ');
      const lastName = lastNameParts.join(' ');
      
      const userRes = await apiClient.post('users/', {
        username: formData.phone,
        phone_number: formData.phone,
        first_name: firstName,
        last_name: lastName || '',
        role: 'FARMER'
      });
      
      // 2. Create Farmer Profile
      await apiClient.post('farmers/', {
        user_id: userRes.data.id,
        aadhaar_number: formData.aadhaar,
        upi_id: formData.upi,
        village: formData.village,
        district: formData.district || 'Nizamabad'
      });
      
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Failed to complete onboarding. Please check the details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboard-farmer animate-slide-up">
      <div className="page-header">
        <h2>Onboard New Farmer</h2>
        <p>Complete KYC to enable instant payouts.</p>
      </div>

      <div className="progress-bar">
        <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)}>1. Details</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`} onClick={() => setStep(2)}>2. Banking</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`} onClick={() => setStep(3)}>3. Verify</div>
      </div>

      <div className="card form-container">
        {step === 1 && (
          <form className="animate-slide-up">
            <div className="input-group">
              <label className="input-label">Full Name (as per Aadhaar)</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="input-field" placeholder="E.g., Ram Kumar" required />
            </div>
            <div className="input-group">
              <label className="input-label">Phone Number (WhatsApp Active)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="input-field" placeholder="+91" required />
            </div>
            <div className="flex gap-4">
              <div className="input-group flex-1">
                <label className="input-label">Village / Block</label>
                <input type="text" name="village" value={formData.village} onChange={handleChange} className="input-field" placeholder="Enter village" required />
              </div>
              <div className="input-group flex-1">
                <label className="input-label">District</label>
                <input type="text" name="district" value={formData.district} onChange={handleChange} className="input-field" placeholder="E.g., Nizamabad" required />
              </div>
            </div>
            <button type="button" className="btn btn-primary btn-full mt-4" onClick={() => setStep(2)}>
              Next Step
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="animate-slide-up">
            <div className="input-group">
              <label className="input-label">Aadhaar Number</label>
              <input type="text" name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="input-field" placeholder="1234 5678 9101" required />
            </div>
            <div className="input-group">
              <label className="input-label">UPI ID for Direct Payouts</label>
              <input type="text" name="upi" value={formData.upi} onChange={handleChange} className="input-field" placeholder="username@upi" required />
            </div>
            
            <div className="action-buttons flex gap-2 mt-4">
               <button type="button" className="btn btn-outline flex-1" onClick={() => setStep(1)}>Back</button>
               <button type="button" className="btn btn-primary flex-1" onClick={() => setStep(3)}>Review</button>
            </div>
          </form>
        )}

        {step === 3 && (
          <div className="verify-step animate-slide-up">
             <div className="upload-box">
                <Camera size={32} className="text-muted mb-2" />
                <p>Take photo of Aadhaar Card</p>
                <button className="btn btn-outline mt-2 btn-sm">Capture</button>
             </div>

             <div className="summary-box mt-4 bg-bg p-3 rounded">
                <p><strong>Name:</strong> {formData.fullName}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Aadhaar:</strong> {formData.aadhaar}</p>
                <p><strong>UPI:</strong> {formData.upi}</p>
             </div>

             {error && <div className="text-red-500 mt-4 p-2 bg-red-50 rounded text-sm">{error}</div>}
             {success && <div className="text-green-600 mt-4 p-2 bg-green-50 rounded text-sm font-semibold">Farmer Onboarded Successfully! 🎉</div>}

             <div className="action-buttons flex gap-2 mt-4">
               {!success && <button type="button" className="btn btn-outline flex-1" onClick={() => setStep(2)} disabled={loading}>Back</button>}
               {!success ? (
                   <button type="button" className="btn btn-primary flex-1 bg-success" onClick={handleSubmit} disabled={loading}>
                       {loading ? 'Processing...' : 'Complete KYC'}
                   </button>
               ) : (
                   <button type="button" className="btn btn-primary flex-1" onClick={() => { setStep(1); setFormData({fullName:'', phone:'', village:'', district:'', aadhaar:'', upi:''}); setSuccess(false); }}>
                       Onboard Another
                   </button>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default OnboardFarmer;
