import React, { useState } from 'react';
import { UserPlus, MapPin, ClipboardCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

function AgentRegistration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    village: '',
    district: '',
    experience: 'NO_EXP',
    motivation: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real app, this would be an API call
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg p-8">
        <div className="card max-w-md w-full text-center space-y-6 animate-slide-up">
          <div className="w-20 h-20 bg-success-light text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold">Application Received!</h2>
          <p className="text-muted">
            Thank you for applying to be a RaithuMandi Village Agent. Our regional coordinator will reach out to you within 48 hours for a physical verification and training session.
          </p>
          <Link to="/" className="btn btn-primary btn-full">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-text-main mb-3">Become a RaithuMandi Agent</h1>
          <p className="text-muted max-w-lg mx-auto">
            Empower your village, digitize the supply chain, and earn per-transaction commissions.
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="input-label">Full Name</label>
                <input 
                  type="text" 
                  name="fullName" 
                  className="input-field" 
                  placeholder="As per Aadhaar" 
                  required 
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  className="input-field" 
                  placeholder="+91" 
                  required 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="input-group">
                <label className="input-label">Village / Block</label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                  <input 
                    type="text" 
                    name="village" 
                    className="input-field pl-10" 
                    placeholder="E.g., Balkonda" 
                    required 
                    value={formData.village}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">District</label>
                <input 
                  type="text" 
                  name="district" 
                  className="input-field" 
                  placeholder="E.g., Nizamabad" 
                  required 
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Prior Agriculture Experience</label>
              <select 
                name="experience" 
                className="input-field bg-white"
                value={formData.experience}
                onChange={handleChange}
              >
                <option value="NO_EXP">No direct experience</option>
                <option value="FARMER">I am a farmer myself</option>
                <option value="TRADER">Previous experience in Mandis</option>
                <option value="NGO">Work with agricultural NGOs/SHGs</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Why do you want to join RaithuMandi?</label>
              <textarea 
                name="motivation" 
                className="input-field min-h-[100px] py-3" 
                placeholder="Tell us about how you can help farmers in your area..."
                value={formData.motivation}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="bg-primary-light/30 border border-primary/10 p-4 rounded-xl space-y-2">
               <div className="flex items-center gap-2 text-primary font-semibold">
                  <ClipboardCheck size={20} />
                  <span>Next Steps</span>
               </div>
               <p className="text-sm text-text-main opacity-80">
                  After submission, you will be invited to our regional hub for a KYC check and training on using the Agent validation queue.
               </p>
            </div>

            <button type="submit" className="btn btn-primary btn-full py-4 text-lg">
              Submit Application <ArrowRight size={20} className="ml-2" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AgentRegistration;
