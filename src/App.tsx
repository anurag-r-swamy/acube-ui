import React from 'react';
import { useApp } from './context/AppContext';
import { DemoBanner } from './components/common/DemoBanner';
import { ToastContainer } from './components/common/ToastContainer';
import { CustomerLayout } from './components/customer/CustomerLayout';
import { WorkerLayout } from './components/worker/WorkerLayout';
import { AdminLayout } from './components/admin/AdminLayout';
import { AuthModal } from './components/auth/AuthModal';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { WorkerRegistrationModal } from './components/worker/WorkerRegistrationModal';

export const App: React.FC = () => {
  const {
    currentRoute,
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    isWorkerRegModalOpen,
    setIsWorkerRegModalOpen,
  } = useApp();

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

      {/* Auth & Registration Simulation Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
      />

      {/* Staff Admin Login Simulation Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
      />

      {/* Dedicated Worker & Partner Registration Wizard */}
      <WorkerRegistrationModal
        isOpen={isWorkerRegModalOpen}
        onClose={() => setIsWorkerRegModalOpen(false)}
      />

      {/* Global In-app Toasts */}
      <ToastContainer />
    </div>
  );
};


