import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Briefcase, PackageSearch, Truck, BarChart3, Bell } from 'lucide-react';
import '../index.css';
import './processor.css';

function ProcessorLayout() {
  const location = useLocation();

  return (
    <div className="processor-dashboard-container bg-bg min-h-screen flex">
      {/* Sidebar Navigation */}
      <aside className="sidebar bg-surface w-64 border-r border-border flex flex-col pt-6 pb-6 shadow-sm">
        <div className="px-6 mb-8">
          <h2 className="text-xl font-bold text-primary flex items-center gap-2">
            <Briefcase size={24} />
            RaithuMandi
          </h2>
          <p className="text-xs text-muted mt-1">Processor Portal</p>
        </div>

        <nav className="flex flex-col gap-2 px-4 flex-1">
          <Link 
            to="/processor" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/processor' ? 'bg-primary-light text-primary font-semibold' : 'text-text-main hover:bg-gray-50'}`}
          >
            <BarChart3 size={20} />
            Overview
          </Link>
          <Link 
            to="/processor/order" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/processor/order' ? 'bg-primary-light text-primary font-semibold' : 'text-text-main hover:bg-gray-50'}`}
          >
            <PackageSearch size={20} />
            Place Order
          </Link>
          <Link 
            to="/processor/shipments" 
            className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${location.pathname === '/processor/shipments' ? 'bg-primary-light text-primary font-semibold' : 'text-text-main hover:bg-gray-50'}`}
          >
            <Truck size={20} />
            Shipments
          </Link>
        </nav>

        <div className="px-6 mt-auto">
           <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg border border-border">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                 IF
              </div>
              <div>
                 <p className="text-sm font-semibold">ITC Foods Ltd</p>
                 <p className="text-xs text-muted">Procurement</p>
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-8">
           <h1 className="text-lg font-semibold text-text-main">
              {location.pathname === '/processor' && 'Dashboard Overview'}
              {location.pathname === '/processor/order' && 'Marketplace Catalog'}
              {location.pathname === '/processor/shipments' && 'Incoming Shipments'}
           </h1>
           <div className="flex items-center gap-4">
              <button className="p-2 text-muted hover:text-primary transition-colors relative">
                 <Bell size={20} />
                 <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
              </button>
           </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default ProcessorLayout;
