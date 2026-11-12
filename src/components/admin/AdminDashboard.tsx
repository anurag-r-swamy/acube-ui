import React from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { AdminSection } from './AdminLayout';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Users,
  HardHat,
  CreditCard,
  ArrowRight,
  Clock,
  CheckCircle2,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigateTo: (section: AdminSection) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigateTo }) => {
  const {
    bookings,
    workerProfiles,
    disputes,
    transactions,
    currentUser,
  } = useApp();

  const totalGMV = transactions.reduce((acc, t) => acc + (t.isRefunded ? 0 : t.amount), 0);
  const totalPlatformCommissions = transactions.reduce(
    (acc, t) => acc + (t.isRefunded ? 0 : t.commissionAmount),
    0
  );

  const pendingVerifications = workerProfiles.filter(
    (w) => w.verificationStatus === 'PENDING_REVIEW'
  );
  const openDisputes = disputes.filter(
    (d) => d.status === 'OPEN' || d.status === 'IN_REVIEW'
  );
  const inProgressBookings = bookings.filter(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED'
  );

  return (
    <div className="space-y-6 text-xs">
      {/* Welcome & System Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-soft">
        <div>
          <h1 className="text-base font-bold text-gray-900">
            Operations & Quality Overview — Bengaluru
          </h1>
          <p className="text-gray-500 text-xs">
            Viewing as <strong className="text-brand-dark">{currentUser.name}</strong> ({currentUser.role.replace('_', ' ')})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Simulated State Engine Active
          </span>
        </div>
      </div>

      {/* Urgent Action Needed Alert Strip (if verifications or disputes pending) */}
      {(pendingVerifications.length > 0 || openDisputes.length > 0) && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-amber-950">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Attention Required at Quality & Verification Desk</p>
              <p className="text-[11px] text-amber-800">
                {pendingVerifications.length} worker verification application(s) awaiting document review •{' '}
                {openDisputes.length} active complaint/dispute case(s) requiring assignment.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {pendingVerifications.length > 0 && (
              <button
                onClick={() => onNavigateTo('VERIFICATION')}
                className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                Review Verifications ({pendingVerifications.length})
              </button>
            )}
            {openDisputes.length > 0 && (
              <button
                onClick={() => onNavigateTo('DISPUTES')}
                className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs shadow-xs"
              >
                Review Disputes ({openDisputes.length})
              </button>
            )}
          </div>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Gross Bookings (GMV)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">
            {APP_CONFIG.currencySymbol}{totalGMV.toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            Provisional Comm: {APP_CONFIG.currencySymbol}{totalPlatformCommissions.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Card 2 */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Active Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-gray-900">{inProgressBookings.length}</p>
          <p className="text-[11px] text-blue-600 font-medium">
            Total bookings on platform: {bookings.length}
          </p>
        </div>

        {/* Card 3 */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Verification Queue</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-amber-600">
            {pendingVerifications.length}
          </p>
          <p className="text-[11px] text-gray-500">
            {workerProfiles.filter((w) => w.verificationStatus === 'APPROVED').length} Approved pros in Bengaluru
          </p>
        </div>

        {/* Card 4 */}
        <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="font-bold text-[11px] uppercase tracking-wider">Open Disputes</span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-red-600">{openDisputes.length}</p>
          <p className="text-[11px] text-gray-500">Escrow hold on disputed payouts</p>
        </div>
      </div>

      {/* Main 2-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Live Bookings Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-soft p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-sm text-gray-900">Live Booking Activity</h2>
              <p className="text-gray-500 text-[11px]">Real-time status updates across Bengaluru zones</p>
            </div>
            <button
              onClick={() => onNavigateTo('BOOKINGS')}
              className="text-xs font-semibold text-brand-dark hover:underline flex items-center gap-1"
            >
              <span>View All Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                  <th className="py-2.5 px-3">Reference</th>
                  <th className="py-2.5 px-3">Service</th>
                  <th className="py-2.5 px-3">Customer & Worker</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs">
                {bookings.slice(0, 5).map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-3 px-3 font-mono font-bold text-brand-dark">
                      {booking.referenceNumber}
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-gray-900">{booking.serviceName}</p>
                      <p className="text-[10px] text-gray-500">{booking.serviceArea}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-gray-900">{booking.customerName}</p>
                      <p className="text-[10px] text-gray-500">
                        {booking.workerName ? `Pro: ${booking.workerName}` : 'Broadcasting...'}
                      </p>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-[10px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full">
                        {booking.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      {APP_CONFIG.currencySymbol}{booking.totalEstimatedAmount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Operational Shortcuts & Role Helper */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft p-5 space-y-3">
            <h3 className="font-bold text-sm text-gray-900">Fast Operations Jump</h3>
            <div className="space-y-2">
              <button
                onClick={() => onNavigateTo('VERIFICATION')}
                className="w-full p-2.5 bg-brand-bg hover:bg-gray-100 rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-dark" />
                  <span className="font-semibold text-gray-800">Verification Desk</span>
                </div>
                <span className="font-bold text-brand-dark">{pendingVerifications.length}</span>
              </button>

              <button
                onClick={() => onNavigateTo('DISPUTES')}
                className="w-full p-2.5 bg-brand-bg hover:bg-gray-100 rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                  <span className="font-semibold text-gray-800">Disputes Queue</span>
                </div>
                <span className="font-bold text-red-600">{openDisputes.length}</span>
              </button>

              <button
                onClick={() => onNavigateTo('FINANCE')}
                className="w-full p-2.5 bg-brand-bg hover:bg-gray-100 rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-gray-800">Finance & Settlements</span>
                </div>
                <span className="font-bold text-emerald-600">Ledger →</span>
              </button>

              <button
                onClick={() => onNavigateTo('CATEGORIES')}
                className="w-full p-2.5 bg-brand-bg hover:bg-gray-100 rounded-xl text-left flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-gray-800">Manage Categories</span>
                </div>
                <span className="font-bold text-gray-500">6 Active</span>
              </button>
            </div>
          </div>

          {/* Role UI Permissions Matrix Preview */}
          <div className="p-4 bg-brand-dark text-white rounded-2xl shadow-lifted space-y-2">
            <span className="text-[10px] text-brand-accent uppercase font-bold tracking-wider">
              Role Permission Boundary
            </span>
            <h4 className="font-bold text-sm">Signed in as {currentUser.role.replace('_', ' ')}</h4>
            <p className="text-white/80 text-[11px] leading-relaxed">
              Use the top banner to switch between Super Admin, Disputes, Finance, and Operations roles to evaluate route guards and action restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

