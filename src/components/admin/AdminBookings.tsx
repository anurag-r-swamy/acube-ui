import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Booking, BookingStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';

export const AdminBookings: React.FC = () => {
  const { bookings, cancelBooking, currentUser, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings
    .filter((b) => (statusFilter === 'ALL' ? true : b.status === statusFilter))
    .filter((b) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        b.referenceNumber.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        (b.workerName && b.workerName.toLowerCase().includes(q)) ||
        b.serviceArea.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Live Booking Monitor</h1>
          <p className="text-gray-500 text-xs">
            Monitor real-time fulfillment across all Bengaluru service categories
          </p>
        </div>

        <span className="bg-brand-bg text-brand-dark font-bold px-2.5 py-1 rounded-full text-xs border border-gray-200">
          {bookings.length} Total Bookings
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Statuses' },
            { key: 'IN_PROGRESS', label: 'In Progress' },
            { key: 'ACCEPTED', label: 'Accepted' },
            { key: 'REQUESTED', label: 'Requested' },
            { key: 'COMPLETED', label: 'Completed' },
            { key: 'DISPUTED', label: 'Disputed' },
            { key: 'CANCELLED', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key)}
              className={`py-1.5 px-3 rounded-xl font-bold transition-all ${
                statusFilter === tab.key
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[220px]">
          <input
            type="text"
            placeholder="Search booking ref, customer, worker..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Service & Area</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Assigned Worker</th>
              <th className="py-3 px-4">Scheduled Slot</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                  {b.referenceNumber}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-bold text-gray-900">{b.serviceName}</p>
                  <p className="text-[10px] text-gray-400">{b.serviceArea}</p>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-medium text-gray-900">{b.customerName}</p>
                  <p className="text-[10px] text-gray-400">{b.customerPhone}</p>
                </td>
                <td className="py-3.5 px-4">
                  {b.workerName ? (
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-gray-900">{b.workerName}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                      Broadcast Pending
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-gray-600 text-[11px]">
                  {b.scheduledDate} ({b.scheduledTimeSlot})
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      b.status === 'COMPLETED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'IN_PROGRESS'
                        ? 'bg-amber-100 text-amber-800'
                        : b.status === 'DISPUTED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-brand-bg text-brand-dark'
                    }`}
                  >
                    {b.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                  {APP_CONFIG.currencySymbol}{b.totalEstimatedAmount}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="py-1 px-2.5 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-lg text-xs"
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Booking Detail Modal Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lifted max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <span className="font-mono text-[10px] text-gray-400">
                  {selectedBooking.referenceNumber}
                </span>
                <h3 className="font-bold text-base text-gray-900">
                  {selectedBooking.serviceName}
                </h3>
              </div>
              <button onClick={() => setSelectedBooking(null)} className="text-gray-400 p-1">
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-2xl">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Customer Details
                  </span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedBooking.customerName}
                  </p>
                  <p className="text-gray-500">{selectedBooking.customerPhone}</p>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Assigned Worker
                  </span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedBooking.workerName || 'Not yet assigned (Broadcasting)'}
                  </p>
                  <p className="text-gray-500">{selectedBooking.workerPhone || 'N/A'}</p>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-1">Service Location & Address</h4>
                <p className="p-3 bg-brand-bg rounded-xl text-gray-700">
                  {selectedBooking.address?.street}, {selectedBooking.address?.area},{' '}
                  {selectedBooking.address?.city} - {selectedBooking.address?.pincode}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-2">Audit Event Timeline</h4>
                <div className="space-y-2 border-l-2 border-brand-accent/40 pl-3">
                  {selectedBooking.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="flex justify-between text-[10px] text-gray-400">
                        <span className="font-bold text-brand-dark">{event.actor}</span>
                        <span>{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-800 font-medium text-[11px] mt-0.5">{event.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1">
                <div className="flex justify-between text-gray-500">
                  <span>Base Fare:</span>
                  <span>{APP_CONFIG.currencySymbol}{selectedBooking.estimatedBaseFare}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Platform Fee:</span>
                  <span>{APP_CONFIG.currencySymbol}{selectedBooking.platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Platform Commission ({selectedBooking.commissionPct}%):</span>
                  <span>{APP_CONFIG.currencySymbol}{selectedBooking.commissionAmount}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-brand-dark pt-1 border-t">
                  <span>Total Booking Amount:</span>
                  <span>{APP_CONFIG.currencySymbol}{selectedBooking.totalEstimatedAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

