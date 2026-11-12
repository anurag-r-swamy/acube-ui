import React from 'react';
import { useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { WorkerLayout } from './components/worker/WorkerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

export const App: React.FC = () => {
  const { currentRoute, currentUser } = useApp();

  // Route selector
  const isCustomerRoute = currentRoute.startsWith('/customer');
  const isWorkerRoute = currentRoute.startsWith('/worker');
  const isAdminRoute = currentRoute.startsWith('/admin');

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col font-sans">
      {/* Top Demo Personas & Controls Switcher */}
      <DemoBanner />

      {/* Main View Router */}
      <div className="flex-1">
        {isAdminRoute ? (
          <AdminLayout />
        ) : isWorkerRoute ? (
          <WorkerLayout />
        ) : (
          <CustomerLayout />
        )}
      </div>

      {/* Global In-app Toasts */}
      <ToastContainer />
    </div>
  );
};

