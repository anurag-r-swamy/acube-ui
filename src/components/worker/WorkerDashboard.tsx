import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Booking, BookingStatus } from '../../types';
import {
  Power,
  ShieldCheck,
  AlertCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MapPin,
  MessageSquare,
  Phone,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Star,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { ChatModal } from '../customer/ChatModal';

interface WorkerDashboardProps {
  onNavigateToJobs: () => void;
  onNavigateToEarnings: () => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  onNavigateToJobs,
  onNavigateToEarnings,
}) => {
  const {
    currentUser,
    workerProfiles,
    currentWorkerProfile,
    bookings,
    toggleWorkerOnline,
    acceptBookingOpportunity,
    updateWorkerJobLifecycle,
    showToast,
  } = useApp();

  const [chatBooking, setChatBooking] = useState<Booking | null>(null);

  // If current worker profile is not found, fallback to first approved profile for demonstration
  const worker = currentWorkerProfile || workerProfiles[0];

  // Opportunities available: status === 'REQUESTED' and unassigned or in worker's category/locality
  const availableOpportunities = bookings.filter(
    (b) => b.status === 'REQUESTED' && !b.workerId
  );

  // Worker's active / upcoming jobs
  const myAssignedJobs = bookings.filter((b) => b.workerId === worker?.id);
  const activeJob = myAssignedJobs.find(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED'
  );
  const upcomingJobs = myAssignedJobs.filter((b) => b.status === 'ACCEPTED');

  // Today's earnings calculation
  const completedJobs = myAssignedJobs.filter((b) => b.status === 'COMPLETED');
  const totalNetEarnings = completedJobs.reduce(
    (acc, curr) => acc + (curr.workerPayoutAmount || curr.totalEstimatedAmount * 0.85),
    0
  );

  return (
    <div className="space-y-4 pb-24 text-xs">
      {/* Top Profile & Online Toggle Bar */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={worker.avatarUrl}
              alt={worker.fullName}
              className="w-12 h-12 rounded-xl object-cover border border-gray-200"
            />
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                worker.isOnline ? 'bg-emerald-500' : 'bg-gray-400'
              }`}
            ></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-gray-900">{worker.fullName}</h2>
              {worker.verificationStatus === 'APPROVED' && (
                <ShieldCheck className="w-3.5 h-3.5 text-brand-accent fill-brand-accent/20" />
              )}
            </div>
            <p className="text-[11px] text-gray-500">{worker.primaryCategory}</p>
          </div>
        </div>

        {/* Online / Offline Toggle */}
        <button
          onClick={() => toggleWorkerOnline(worker.id)}
          className={`flex items-center gap-1.5 py-2 px-3.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
            worker.isOnline
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{worker.isOnline ? 'Online' : 'Offline'}</span>
        </button>
      </div>

      {/* Verification Status Banner */}
      {worker.verificationStatus === 'PENDING_REVIEW' && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-950">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold">Verification Pending Review</p>
            <p className="text-[11px] text-amber-800">
              Our Bengaluru quality assurance team is authenticating your Aadhaar & trade credentials. Switch to <strong>Vikram Rao (Disputes & Verification)</strong> in Admin to approve this profile.
            </p>
          </div>
        </div>
      )}

      {worker.verificationStatus === 'RESUBMISSION_REQUIRED' && (
        <div className="p-3.5 bg-orange-50 border border-orange-200 rounded-2xl flex items-start gap-3 text-orange-950">
          <AlertCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs">
            <p className="font-bold">Document Resubmission Required</p>
            <p className="text-[11px] text-orange-800">
              {worker.verificationNotes || 'Uploaded trade certificate scan was unclear. Please submit a clearer copy.'}
            </p>
          </div>
        </div>
      )}

      {worker.verificationStatus === 'APPROVED' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center justify-between text-emerald-950">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-bold text-xs">Identity & Trade Verified</span>
          </div>
          <span className="text-[10px] text-emerald-700 bg-white px-2 py-0.5 rounded-full font-semibold border border-emerald-200">
            Active in Bengaluru
          </span>
        </div>
      )}

      {/* Quick KPI Cards Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div
          onClick={onNavigateToEarnings}
          className="p-3 bg-white rounded-xl border border-gray-100 shadow-soft text-center cursor-pointer hover:border-brand-dark/20"
        >
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Net Earned</span>
          <p className="text-sm font-extrabold text-brand-dark mt-0.5">
            {APP_CONFIG.currencySymbol}{totalNetEarnings}
          </p>
        </div>

        <div
          onClick={onNavigateToJobs}
          className="p-3 bg-white rounded-xl border border-gray-100 shadow-soft text-center cursor-pointer hover:border-brand-dark/20"
        >
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Active Jobs</span>
          <p className="text-sm font-extrabold text-brand-dark mt-0.5">
            {activeJob ? 1 : upcomingJobs.length}
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-soft text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Rating</span>
          <p className="text-sm font-extrabold text-brand-accent mt-0.5 flex items-center justify-center gap-0.5">
            <Star className="w-3 h-3 fill-brand-accent" />
            <span>{worker.rating.toFixed(1)}</span>
          </p>
        </div>

        <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-soft text-center">
          <span className="text-[10px] text-gray-400 uppercase font-semibold block">Completed</span>
          <p className="text-sm font-extrabold text-gray-900 mt-0.5">
            {worker.completedJobsCount}
          </p>
        </div>
      </div>

      {/* ACTIVE JOB IN PROGRESS CARD (if exists) */}
      {activeJob && (
        <div className="p-4 bg-gradient-to-r from-brand-dark to-brand-light text-white rounded-2xl shadow-lifted space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] bg-amber-400 text-brand-charcoal font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-charcoal animate-ping"></span>
              Current Job ({activeJob.status.replace('_', ' ')})
            </span>
            <span className="font-mono text-[10px] text-white/70">{activeJob.referenceNumber}</span>
          </div>

          <div>
            <h3 className="font-bold text-sm text-white">{activeJob.serviceName}</h3>
            <p className="text-xs text-white/80 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-accent" />
              <span>{activeJob.address?.street}, {activeJob.address?.area}</span>
            </p>
            <p className="text-[11px] text-white/70 mt-1">Customer: {activeJob.customerName} ({activeJob.customerPhone})</p>
          </div>

          {/* Quick Lifecycle Action Buttons */}
          <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2">
            {activeJob.status === 'ACCEPTED' && (
              <button
                onClick={() =>
                  updateWorkerJobLifecycle(
                    activeJob.id,
                    'WORKER_ARRIVED',
                    'Worker arrived at customer premises in Bengaluru.'
                  )
                }
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs"
              >
                Mark Arrived at Location
              </button>
            )}

            {activeJob.status === 'WORKER_ARRIVED' && (
              <button
                onClick={() =>
                  updateWorkerJobLifecycle(
                    activeJob.id,
                    'IN_PROGRESS',
                    'Work started: Opened panel and initiated repair diagnosis.'
                  )
                }
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-brand-charcoal font-bold rounded-xl text-xs"
              >
                Start Service / In Progress
              </button>
            )}

            {activeJob.status === 'IN_PROGRESS' && (
              <button
                onClick={() =>
                  updateWorkerJobLifecycle(
                    activeJob.id,
                    'COMPLETED',
                    'Technician submitted work completion. Awaiting customer confirmation.'
                  )
                }
                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Submit Job Completion</span>
              </button>
            )}

            <button
              onClick={() => setChatBooking(activeJob)}
              className="py-2 px-3 bg-white/15 hover:bg-white/25 text-white font-semibold rounded-xl text-xs flex items-center gap-1"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat</span>
            </button>
          </div>
        </div>
      )}

      {/* NEW OPPORTUNITIES FEED */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div>
            <h2 className="text-sm font-bold text-gray-900">New Opportunities Broadcast</h2>
            <p className="text-[11px] text-gray-500">
              {worker.isOnline
                ? 'Nearby requests ready to accept'
                : 'You are currently Offline. Turn online to receive requests.'}
            </p>
          </div>
          <span className="text-[11px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full font-bold">
            {availableOpportunities.length} Available
          </span>
        </div>

        {availableOpportunities.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center space-y-1">
            <Clock className="w-6 h-6 text-gray-300 mx-auto" />
            <p className="font-bold text-gray-700">No new job broadcasts right now</p>
            <p className="text-[11px] text-gray-400">
              New customer requests in Bengaluru South & East will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-medium transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 font-bold">
                    {opp.referenceNumber}
                  </span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Broadcasted to Pros
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-gray-900">{opp.serviceName}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-brand-bg p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                    <span>{opp.scheduledDate} ({opp.scheduledTimeSlot})</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{opp.serviceArea}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Est. Payout</span>
                    <span className="font-extrabold text-sm text-brand-dark">
                      {APP_CONFIG.currencySymbol}{opp.workerPayoutAmount || Math.round(opp.totalEstimatedAmount * 0.85)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        showToast('Declined opportunity. Removed from your feed.', 'info')
                      }
                      className="py-1.5 px-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => acceptBookingOpportunity(opp.id, worker.id)}
                      disabled={!worker.isOnline || worker.verificationStatus !== 'APPROVED'}
                      className="py-1.5 px-4 bg-brand-dark hover:bg-brand-darker disabled:opacity-40 text-white rounded-xl font-bold shadow-xs transition-all"
                    >
                      Accept Opportunity
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sub-modal for Chat */}
      <ChatModal booking={chatBooking} onClose={() => setChatBooking(null)} />
    </div>
  );
};

