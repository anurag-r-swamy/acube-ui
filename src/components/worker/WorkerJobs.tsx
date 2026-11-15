import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Booking } from '../../types';
import {
  Calendar,
  MapPin,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import { ChatModal } from '../customer/ChatModal';

export const WorkerJobs: React.FC = () => {
  const {
    workerProfiles,
    currentWorkerProfile,
    bookings,
    updateWorkerJobLifecycle,
  } = useApp();

  const worker = currentWorkerProfile || workerProfiles[0];
  const [activeTab, setActiveTab] = useState<'IN_PROGRESS' | 'COMPLETED'>('IN_PROGRESS');
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  const myJobs = bookings.filter((b) => b.workerId === worker?.id);

  // In Progress includes newly accepted, arrived, or actively being worked on
  const inProgressList = myJobs.filter(
    (b) =>
      b.status === 'ACCEPTED' ||
      b.status === 'WORKER_ARRIVED' ||
      b.status === 'IN_PROGRESS' ||
      b.status === 'REQUESTED'
  );

  const completedList = myJobs.filter((b) => b.status === 'COMPLETED');

  const displayedList = activeTab === 'IN_PROGRESS' ? inProgressList : completedList;

  return (
    <div className="space-y-4 pb-20 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-black">Jobs Management</h1>
          <p className="text-[11px] text-slate-500">Track current and completed customer orders</p>
        </div>
        <span className="bg-[#0D2218] text-white px-2.5 py-1 rounded-full font-bold text-[11px]">
          {myJobs.length} Assigned
        </span>
      </div>

      {/* Exactly 2 Tabs: In Progress & Completed */}
      <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-xl text-center">
        <button
          onClick={() => setActiveTab('IN_PROGRESS')}
          className={`py-2 font-bold text-xs rounded-lg transition-all ${
            activeTab === 'IN_PROGRESS'
              ? 'bg-[#0D2218] text-white shadow-xs'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          In Progress ({inProgressList.length})
        </button>

        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`py-2 font-bold text-xs rounded-lg transition-all ${
            activeTab === 'COMPLETED'
              ? 'bg-[#0D2218] text-white shadow-xs'
              : 'text-slate-600 hover:text-black'
          }`}
        >
          Completed ({completedList.length})
        </button>
      </div>

      {/* Jobs Feed */}
      {displayedList.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center p-6 space-y-2">
          <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-black text-sm">
            No {activeTab === 'IN_PROGRESS' ? 'in-progress' : 'completed'} jobs
          </h3>
          <p className="text-slate-400 text-[11px]">
            {activeTab === 'IN_PROGRESS'
              ? 'Accept newly broadcasted requests from your Dashboard.'
              : 'Completed customer jobs will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] font-bold text-slate-400">
                  {job.referenceNumber}
                </span>
                <span className="text-[10px] font-bold bg-[#0D2218] text-white px-2 py-0.5 rounded-full uppercase">
                  {job.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-black">{job.serviceName}</h3>
                <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{job.description}</p>
              </div>

              <div className="p-3 bg-[#FBFBFA] rounded-xl border border-slate-100 space-y-1 text-[11px] text-slate-600">
                <p className="font-semibold text-black">Customer: {job.customerName}</p>
                <p className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0D2218] shrink-0" />
                  <span>
                    {job.address?.street}, {job.address?.area}
                  </span>
                </p>
                <p className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#0D2218] shrink-0" />
                  <span>
                    {job.scheduledDate} ({job.scheduledTimeSlot})
                  </span>
                </p>
              </div>

              {/* Status advancement buttons */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 block">Net Payout</span>
                  <span className="font-extrabold text-sm text-[#0D2218]">
                    {APP_CONFIG.currencySymbol}
                    {job.workerPayoutAmount || Math.round(job.totalEstimatedAmount * 0.85)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setChatBooking(job)}
                    className="p-2 rounded-xl bg-slate-100 text-black font-semibold hover:bg-slate-200 transition-colors"
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
                      className="py-1.5 px-3 bg-[#0D2218] hover:bg-black text-white font-bold rounded-xl transition-colors shadow-xs"
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
                      className="py-1.5 px-3 bg-black text-white font-bold rounded-xl hover:bg-slate-800"
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
                      className="py-1.5 px-3 bg-[#0D2218] hover:bg-black text-white font-bold rounded-xl flex items-center gap-1 shadow-xs"
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
