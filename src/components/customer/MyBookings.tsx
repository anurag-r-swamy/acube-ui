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
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Star,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { ChatModal } from './ChatModal';
import { ReviewModal } from './ReviewModal';
import { DisputeModal } from './DisputeModal';

export const MyBookings: React.FC = () => {
  const {
    currentUser,
    bookings,
    cancelBooking,
    confirmBookingCompletion,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ACTIVE');
  const [selectedBookingForDetail, setSelectedBookingForDetail] = useState<Booking | null>(null);
  const [chatBooking, setChatBooking] = useState<Booking | null>(null);
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [disputeBooking, setDisputeBooking] = useState<Booking | null>(null);
  const [showCancelDialog, setShowCancelDialog] = useState<boolean>(false);
  const [cancelReason, setCancelReason] = useState<string>('Change of plans');

  // Customer's bookings
  const myBookings = bookings.filter((b) => b.customerId === currentUser.id);

  const activeBookings = myBookings.filter(
    (b) =>
      b.status === 'REQUESTED' ||
      b.status === 'ACCEPTED' ||
      b.status === 'WORKER_ARRIVED' ||
      b.status === 'IN_PROGRESS' ||
      b.status === 'DISPUTED'
  );

  const completedBookings = myBookings.filter((b) => b.status === 'COMPLETED');
  const cancelledBookings = myBookings.filter((b) => b.status === 'CANCELLED');

  const displayedList =
    activeTab === 'ACTIVE'
      ? activeBookings
      : activeTab === 'COMPLETED'
      ? completedBookings
      : cancelledBookings;

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            In Progress
          </span>
        );
      case 'WORKER_ARRIVED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
            Worker Arrived
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
            Confirmed / Upcoming
          </span>
        );
      case 'REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
            Broadcast Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Completed
          </span>
        );
      case 'DISPUTED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3 text-red-600" />
            Dispute In Review
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    cancelBooking(booking.id, cancelReason, `Customer (${currentUser.name})`);
    setShowCancelDialog(false);
    setSelectedBookingForDetail(null);
  };

  return (
    <div className="space-y-4 pb-24 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">My Bookings</h1>
          <p className="text-[11px] text-gray-500">Live service tracking and order history</p>
        </div>
        <span className="bg-brand-bg text-brand-dark px-2.5 py-1 rounded-full font-bold text-xs border border-gray-200">
          {myBookings.length} Total
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('ACTIVE')}
          className={`flex-1 py-2.5 text-center font-bold text-xs border-b-2 transition-all ${
            activeTab === 'ACTIVE'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Active ({activeBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('COMPLETED')}
          className={`flex-1 py-2.5 text-center font-bold text-xs border-b-2 transition-all ${
            activeTab === 'COMPLETED'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Completed ({completedBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('CANCELLED')}
          className={`flex-1 py-2.5 text-center font-bold text-xs border-b-2 transition-all ${
            activeTab === 'CANCELLED'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Cancelled ({cancelledBookings.length})
        </button>
      </div>

      {/* Bookings List */}
      {displayedList.length === 0 ? (
        <div className="py-12 bg-white rounded-2xl border border-gray-100 text-center p-6 space-y-2">
          <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-1" />
          <h3 className="font-bold text-gray-900 text-sm">No {activeTab.toLowerCase()} bookings</h3>
          <p className="text-gray-500 text-[11px]">
            {activeTab === 'ACTIVE'
              ? 'You have no pending or scheduled jobs at the moment.'
              : 'No bookings found in this section.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayedList.map((booking) => (
            <div
              key={booking.id}
              className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-medium transition-all space-y-3"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-gray-50">
                <span className="font-mono text-[11px] font-bold text-gray-500">
                  {booking.referenceNumber}
                </span>
                {getStatusBadge(booking.status)}
              </div>

              {/* Service & Worker Summary */}
              <div
                onClick={() => setSelectedBookingForDetail(booking)}
                className="cursor-pointer space-y-1"
              >
                <h3 className="font-bold text-sm text-gray-900 hover:text-brand-dark">
                  {booking.serviceName}
                </h3>
                <p className="text-gray-500 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-accent shrink-0" />
                  <span>
                    {booking.scheduledDate} • {booking.scheduledTimeSlot}
                  </span>
                </p>
                <p className="text-gray-500 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate">{booking.address?.area || booking.serviceArea}</span>
                </p>
              </div>

              {/* Worker Details (if assigned) */}
              {booking.workerName ? (
                <div className="flex items-center justify-between p-2.5 bg-brand-bg rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        booking.workerAvatar ||
                        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
                      }
                      alt={booking.workerName}
                      className="w-8 h-8 rounded-full object-cover border border-white shadow-xs"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-xs">{booking.workerName}</p>
                      <p className="text-[10px] text-gray-500">Verified Pro</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setChatBooking(booking)}
                      className="p-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-xs flex items-center gap-1"
                      title="Chat with Worker"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-brand-dark" />
                      <span className="text-[10px] font-medium hidden sm:inline">Chat</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 bg-gray-50 rounded-xl text-gray-500 text-[11px]">
                  Broadcasting to qualified professionals in {booking.serviceArea}...
                </div>
              )}

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-extrabold text-sm text-brand-dark">
                  {APP_CONFIG.currencySymbol}{booking.totalEstimatedAmount}
                </span>

                <div className="flex items-center gap-2">
                  {booking.status === 'COMPLETED' && !booking.hasCustomerReviewed && (
                    <button
                      onClick={() => setReviewBooking(booking)}
                      className="py-1 px-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-[11px] shadow-xs flex items-center gap-1"
                    >
                      <Star className="w-3 h-3 fill-white" />
                      <span>Rate Pro</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedBookingForDetail(booking)}
                    className="py-1 px-3 bg-brand-dark text-white font-semibold rounded-lg text-[11px] flex items-center gap-1 hover:bg-brand-darker"
                  >
                    <span>View Details</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Deep-Dive Drawer/Modal */}
      {selectedBookingForDetail && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-mono text-gray-400">
                  {selectedBookingForDetail.referenceNumber}
                </span>
                <h3 className="font-bold text-sm text-gray-900">
                  {selectedBookingForDetail.serviceName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingForDetail(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
              {/* Status Badge & Actions */}
              <div className="p-3 bg-brand-bg rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-400 block uppercase font-semibold">
                    Current Status
                  </span>
                  <div className="mt-0.5">{getStatusBadge(selectedBookingForDetail.status)}</div>
                </div>

                {selectedBookingForDetail.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => {
                      confirmBookingCompletion(selectedBookingForDetail.id);
                      setSelectedBookingForDetail((prev) =>
                        prev ? { ...prev, status: 'COMPLETED' } : null
                      );
                    }}
                    className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm text-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Work Done</span>
                  </button>
                )}
              </div>

              {/* Worker Card in Detail */}
              {selectedBookingForDetail.workerName && (
                <div className="p-3.5 bg-white border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedBookingForDetail.workerAvatar}
                      alt={selectedBookingForDetail.workerName}
                      className="w-11 h-11 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">
                        {selectedBookingForDetail.workerName}
                      </h4>
                      <p className="text-[11px] text-gray-500">Assigned Professional</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setChatBooking(selectedBookingForDetail)}
                      className="p-2 bg-brand-bg hover:bg-brand-dark hover:text-white rounded-xl text-brand-dark font-semibold text-xs flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Service Address */}
              <div className="p-3 bg-gray-50 rounded-xl space-y-1">
                <span className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Service Address</span>
                </span>
                <p className="text-gray-600">
                  {selectedBookingForDetail.address?.street}, {selectedBookingForDetail.address?.area},{' '}
                  {selectedBookingForDetail.address?.city} - {selectedBookingForDetail.address?.pincode}
                </p>
              </div>

              {/* Description & Attachments */}
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Problem Description</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-xl leading-relaxed">
                  {selectedBookingForDetail.description}
                </p>
                {selectedBookingForDetail.attachments &&
                  selectedBookingForDetail.attachments.length > 0 && (
                    <div className="mt-2 flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-brand-dark" />
                      <span className="text-[11px] text-gray-700 font-semibold">
                        Attachment: {selectedBookingForDetail.attachments[0].name}
                      </span>
                    </div>
                  )}
              </div>

              {/* Event Timeline */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Audit Event Timeline</h4>
                <div className="space-y-3 relative pl-4 border-l-2 border-brand-accent/30">
                  {selectedBookingForDetail.timeline.map((event) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-brand-accent border-2 border-white"></div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                        <span className="font-semibold text-brand-dark">{event.actor}</span>
                        <span>{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="font-semibold text-gray-800 text-[11px] mt-0.5">{event.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Info */}
              <div className="p-3 bg-brand-bg rounded-xl space-y-1.5 border border-gray-100">
                <div className="flex justify-between font-medium">
                  <span className="text-gray-500">Payment Status:</span>
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {selectedBookingForDetail.paymentStatus} ({selectedBookingForDetail.paymentMethod})
                  </span>
                </div>
                <div className="flex justify-between font-bold text-sm text-brand-dark pt-1 border-t border-gray-200">
                  <span>Total Amount Paid</span>
                  <span>{APP_CONFIG.currencySymbol}{selectedBookingForDetail.totalEstimatedAmount}</span>
                </div>
                <p className="text-[10px] text-gray-400">
                  *Demonstration payment held in simulated escrow until work is confirmed.
                </p>
              </div>

              {/* Secondary Actions: Cancel or Dispute */}
              <div className="pt-2 flex flex-wrap gap-2">
                {selectedBookingForDetail.status !== 'CANCELLED' &&
                  selectedBookingForDetail.status !== 'COMPLETED' && (
                    <button
                      onClick={() => setShowCancelDialog(true)}
                      className="flex-1 py-2.5 px-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold"
                    >
                      Cancel Booking
                    </button>
                  )}

                <button
                  onClick={() => setDisputeBooking(selectedBookingForDetail)}
                  className="flex-1 py-2.5 px-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold flex items-center justify-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-red-500" />
                  <span>Report Dispute</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && selectedBookingForDetail && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-sm w-full bg-white rounded-2xl p-5 space-y-3 shadow-lifted">
            <h4 className="font-bold text-gray-900 text-sm">Cancel Booking Confirmation</h4>
            <p className="text-gray-600 text-xs">
              Are you sure you want to cancel booking #{selectedBookingForDetail.referenceNumber}?
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Reason for Cancellation
              </label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
              >
                <option value="Change of plans">Change of plans</option>
                <option value="Issue resolved myself">Issue resolved myself</option>
                <option value="Selected wrong service">Selected wrong service</option>
                <option value="Emergency reschedule">Emergency reschedule</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelDialog(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-lg font-semibold"
              >
                Keep Booking
              </button>
              <button
                onClick={() => handleCancelBooking(selectedBookingForDetail)}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-modals for Chat, Review, and Dispute */}
      <ChatModal booking={chatBooking} onClose={() => setChatBooking(null)} />
      <ReviewModal booking={reviewBooking} onClose={() => setReviewBooking(null)} />
      <DisputeModal booking={disputeBooking} onClose={() => setDisputeBooking(null)} />
    </div>
  );
};

