import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Booking, BookingStatus } from '../../types';
import {
  Calendar,
  Clock,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { ChatModal } from '../customer/ChatModal';

export const WorkerJobs: React.FC = () => {
  const {
    currentUser,
    workerProfiles,
    currentWorkerProfile,
    bookings,
    updateWorkerJobLifecycle,
    showToast,
  } = useApp();

  const worker = currentWorkerProfile || workerProfiles[0];
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED'>('ACTIVE');
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  const myJobs = bookings.filter((b) => b.workerId === worker?.id);

  const upcomingList = myJobs.filter((b) => b.status === 'ACCEPTED');
  const activeList = myJobs.filter(
    (b) => b.status === 'WORKER_ARRIVED' || b.status === 'IN_PROGRESS'
  );
  const completedList = myJobs.filter((b) => b.status === 'COMPLETED');
  const disputedList = myJobs.filter((b) => b.status === 'DISPUTED');

  const displayedList =
    activeTab === 'ACTIVE'
      ? activeList
      : activeTab === 'UPCOMING'
      ? upcomingList
      : activeTab === 'COMPLETED'
      ? completedList
      : disputedList;

  return (
    <div className="space-y-4 pb-24 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Job Management</h1>
          <p className="text-[11px] text-gray-500">Assigned customer service requests</p>
        </div>
        <span className="bg-brand-bg text-brand-dark px-2.5 py-1 rounded-full font-bold text-xs border border-gray-200">
          {myJobs.length} Assigned
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-gray-200 text-center">
        {[
          { key: 'ACTIVE', label: 'In Progress', count: activeList.length },
          { key: 'UPCOMING', label: 'Upcoming', count: upcomingList.length },
          { key: 'COMPLETED', label: 'Completed', count: completedList.length },
          { key: 'DISPUTED', label: 'Disputed', count: disputedList.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-2.5 font-bold text-xs border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-brand-dark text-brand-dark'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Jobs Feed */}
      {displayedList.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center p-6 space-y-2">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
          <h3 className="font-bold text-gray-900 text-sm">No jobs in this category</h3>
          <p className="text-gray-400 text-[11px]">
            Check the Dashboard for newly broadcasted requests.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-gray-400">
                  {job.referenceNumber}
                </span>
                <span className="text-[10px] font-bold bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full uppercase">
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900">{job.serviceName}</h3>
                <p className="text-gray-600 text-[11px] mt-0.5 leading-relaxed">{job.description}</p>
              </div>

              <div className="p-3 bg-brand-bg rounded-xl space-y-1 text-[11px] text-gray-600">
                <p className="font-semibold text-gray-900">Customer: {job.customerName}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span>
                    {job.address?.street}, {job.address?.area}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span>
                    {job.scheduledDate} ({job.scheduledTimeSlot})
                  </span>
                </p>
              </div>

              {/* Status advancement buttons */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-gray-400 block">Net Payout</span>
                  <span className="font-extrabold text-sm text-brand-dark">
                    {APP_CONFIG.currencySymbol}{job.workerPayoutAmount || Math.round(job.totalEstimatedAmount * 0.85)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setChatBooking(job)}
                    className="p-2 rounded-xl bg-brand-bg text-brand-dark font-semibold hover:bg-brand-dark hover:text-white transition-colors"
                    title="Chat with Customer"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  {job.status === 'ACCEPTED' && (
                    <button
                      onClick={() =>
                        updateWorkerJobLifecycle(
                          job.id,
                          'WORKER_ARRIVED',
                          'Worker arrived at customer site in Bengaluru.'
                        )
                      }
                      className="py-1.5 px-3 bg-blue-600 text-white font-bold rounded-xl"
                    >
                      Mark Arrived
                    </button>
                  )}

                  {job.status === 'WORKER_ARRIVED' && (
                    <button
                      onClick={() =>
                        updateWorkerJobLifecycle(
                          job.id,
                          'IN_PROGRESS',
                          'Work started: Disassembled fixture and initiated repair.'
                        )
                      }
                      className="py-1.5 px-3 bg-amber-500 text-brand-charcoal font-bold rounded-xl"
                    >
                      Start Work
                    </button>
                  )}

                  {job.status === 'IN_PROGRESS' && (
                    <button
                      onClick={() =>
                        updateWorkerJobLifecycle(
                          job.id,
                          'COMPLETED',
                          'Technician completed repair. Ready for customer inspection.'
                        )
                      }
                      className="py-1.5 px-3 bg-emerald-600 text-white font-bold rounded-xl flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Finish & Submit</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-modal for Chat */}
      <ChatModal booking={chatBooking} onClose={() => setChatBooking(null)} />
    </div>
  );
};

