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

// Landing Page
import LandingPage from './pages/LandingPage';

function NavigationBar() {
  const location = useLocation();
  
  return (
    <nav className="bottom-nav">
      <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
        <Home size={24} />
        <span>Home</span>
      </Link>
      <Link to="/onboard" className={`nav-item ${location.pathname === '/onboard' ? 'active' : ''}`}>
        <Users size={24} />
        <span>Farmers</span>
      </Link>
      <Link to="/log" className={`nav-item ${location.pathname === '/log' ? 'active' : ''}`}>
        <Leaf size={24} />
        <span>Produce</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <div className="profile-info">
            <div className="avatar">A</div>
            <div>
              <p className="greeting">Welcome back,</p>
              <h2 className="agent-name">Agent Rajesh</h2>
            </div>
          </div>
        </header>
        
        <main className="main-content">
          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

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
          </Routes>
        </main>

        {/* Only show mobile navigation if IN the agent app routes */}
        {location.pathname.startsWith('/agent') ? <NavigationBar /> : null}
      </div>
    </Router>
  );
}

export default App;
