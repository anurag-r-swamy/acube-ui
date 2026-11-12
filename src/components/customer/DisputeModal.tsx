import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, ShieldAlert, Upload, AlertCircle } from 'lucide-react';

interface DisputeModalProps {
  booking: Booking | null;
  onClose: () => void;
}

const DISPUTE_REASONS = [
  'Property Damage / Veneer Scratch',
  'Worker Demanded Offline Cash Above Quote',
  'Work Incomplete / Poor Workmanship',
  'Worker Did Not Arrive (No Show)',
  'Safety or Behavioral Concern',
  'Billing / Overcharging Dispute',
];

export const DisputeModal: React.FC<DisputeModalProps> = ({ booking, onClose }) => {
  const { currentUser, submitDispute } = useApp();
  const [reason, setReason] = useState(DISPUTE_REASONS[0]);
  const [description, setDescription] = useState('');
  const [mockFileName, setMockFileName] = useState('');

  if (!booking) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    submitDispute({
      bookingId: booking.id,
      bookingRef: booking.referenceNumber,
      openedByUserId: currentUser.id,
      openedByName: currentUser.name,
      openedByRole: currentUser.role === 'WORKER' ? 'WORKER' : 'CUSTOMER',
      againstUserId: booking.workerId || 'unassigned',
      againstName: booking.workerName || 'Service Provider',
      reason,
      description: description.trim(),
      evidenceAttachments: mockFileName ? [mockFileName] : ['customer_incident_photo.jpg'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-lifted animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Raise Formal Complaint / Dispute</h3>
              <p className="text-[11px] text-gray-500">Booking {booking.referenceNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-[11px]">
            <p className="font-semibold mb-0.5">Trust & Quality Protection Policy</p>
            Your case will be routed immediately to our Disputes & Verification team in Bengaluru for review. Any disputed payouts are placed on hold.
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Select Dispute Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-red-500"
            >
              {DISPUTE_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">
              Detailed Description of Incident
            </label>
            <textarea
              rows={4}
              required
              placeholder="Explain clearly what happened, date/time, and what resolution you are requesting..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="p-3 border-2 border-dashed border-gray-200 rounded-xl text-center">
            <label className="cursor-pointer block">
              <Upload className="w-4 h-4 text-gray-400 mx-auto mb-1" />
              <span className="font-medium text-gray-700">Attach photo evidence or bill screenshot</span>
              <p className="text-[10px] text-gray-400">Mock upload — stored in prototype state</p>
              <input
                type="file"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) setMockFileName(e.target.files[0].name);
                }}
              />
            </label>
            {mockFileName && (
              <p className="mt-1 text-emerald-600 font-semibold text-[11px]">✓ {mockFileName}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={!description.trim()}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold rounded-xl shadow transition-all"
          >
            Submit Dispute to Verification Team
          </button>
        </form>
      </div>
    </div>
  );
};

