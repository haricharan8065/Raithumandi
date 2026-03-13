import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Home, Users, Leaf, ArrowRight } from 'lucide-react';
import './index.css';

// Placeholder Components (Village Agent)
import Dashboard from './pages/Dashboard';
import OnboardFarmer from './pages/OnboardFarmer';
import LogProduce from './pages/LogProduce';

// Processor Portal Components
import ProcessorLayout from './pages/ProcessorLayout';
import ProcessorDashboard from './pages/ProcessorDashboard';
import ProcessorOrder from './pages/ProcessorOrder';

// New Feature Pages
import TraceabilityPortal from './pages/TraceabilityPortal';
import InputMarketplace from './pages/InputMarketplace';

// Landing Page
import LandingPage from './pages/LandingPage';
import AgentRegistration from './pages/AgentRegistration';
import FarmerDashboard from './pages/FarmerDashboard';
import FarmerLogProduce from './pages/FarmerLogProduce';

function NavigationBar({ role }) {
  const location = useLocation();
  
  if (role === 'FARMER') {
    return (
      <nav className="bottom-nav" style={{ borderTopColor: '#16a34a' }}>
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </Link>
        <Link to="/farmer" className={`nav-item ${location.pathname === '/farmer' ? 'active' : ''}`}>
          <Users size={24} />
          <span>Status</span>
        </Link>
        <Link to="/farmer/sell" className={`nav-item ${location.pathname === '/farmer/sell' ? 'active' : ''}`}>
          <Leaf size={24} />
          <span>Sell</span>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/agent" className={`nav-item ${location.pathname === '/agent' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Dashboard</span>
      </Link>
      <Link to="/agent/onboard" className={`nav-item ${location.pathname === '/agent/onboard' ? 'active' : ''}`}>
        <Users size={24} />
        <span>Farmers</span>
      </Link>
      <Link to="/agent/log" className={`nav-item ${location.pathname === '/agent/log' ? 'active' : ''}`}>
        <Leaf size={24} />
        <span>Produce</span>
      </Link>
    </nav>
  );
}

function AppContent() {
  const location = useLocation();
  const isAgentRoute = location.pathname.startsWith('/agent');
  const isFarmerRoute = location.pathname.startsWith('/farmer');

  const headerContent = () => {
    if (isAgentRoute) {
      return (
        <header className="app-header">
          <div className="profile-info">
            <div className="avatar">A</div>
            <div>
              <p className="greeting">Welcome back,</p>
              <h2 className="agent-name">Agent Rajesh</h2>
            </div>
          </div>
        </header>
      );
    }
    if (isFarmerRoute) {
      return (
        <header className="app-header" style={{ background: '#16a34a' }}>
          <div className="profile-info">
            <div className="avatar" style={{ color: '#16a34a' }}>F</div>
            <div>
              <p className="greeting" style={{ color: '#ecfdf5' }}>Namaste,</p>
              <h2 className="agent-name" style={{ color: '#fff' }}>Farmer Sridhar</h2>
            </div>
          </div>
        </header>
      );
    }
    return null;
  };

  return (
    <div className="app-container">
      {headerContent()}
      
      <main className="main-content">
        <Routes>
          {/* Agent Onboarding Intake */}
          <Route path="/agent-onboard" element={<AgentRegistration />} />

          {/* Farmer Portal Routes */}
          <Route path="/farmer" element={<FarmerDashboard />} />
          <Route path="/farmer/sell" element={<FarmerLogProduce />} />

          {/* Village Agent App Routes */}
          <Route path="/agent" element={<Dashboard />} />
          <Route path="/agent/onboard" element={<OnboardFarmer />} />
          <Route path="/agent/log" element={<LogProduce />} />

          {/* Processor Portal Routes */}
          <Route path="/processor" element={<ProcessorLayout />}>
             <Route index element={<ProcessorDashboard />} />
             <Route path="order" element={<ProcessorOrder />} />
             <Route path="shipments" element={<div className="p-8"><h2 className="text-xl font-bold">Incoming Shipments</h2><p className="text-muted mt-2">Map view and shipment tracking will be implemented here.</p></div>} />
          </Route>

          {/* Traceability Portal */}
          <Route path="/traceability" element={<TraceabilityPortal />} />

          {/* Input Marketplace */}
          <Route path="/marketplace" element={<InputMarketplace />} />
        </Routes>
      </main>

      {/* Only show mobile navigation if IN the agent app routes */}
      {isAgentRoute ? <NavigationBar role="AGENT" /> : null}
      {isFarmerRoute ? <NavigationBar role="FARMER" /> : null}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
