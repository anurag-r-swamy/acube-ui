import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { WorkerProfile, WorkerVerificationStatus } from '../../types';
import {
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  ExternalLink,
  RotateCcw,
  User,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AdminVerification: React.FC = () => {
  const { workerProfiles, updateWorkerVerification, currentUser, showToast } = useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedWorker, setSelectedWorker] = useState<WorkerProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Action Dialog state
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | 'RESUBMIT' | null>(null);
  const [decisionReason, setDecisionReason] = useState('');

  // Check role permission
  const canDecide =
    currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DISPUTES_VERIFICATION';

  const filteredList = workerProfiles
    .filter((w) => {
      if (filterStatus === 'ALL') return true;
      return w.verificationStatus === filterStatus;
    })
    .filter((w) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        w.fullName.toLowerCase().includes(q) ||
        w.primaryCategory.toLowerCase().includes(q) ||
        w.phone.includes(q)
      );
    });

  const handleConfirmDecision = () => {
    if (!selectedWorker || !actionType) return;

    if ((actionType === 'REJECT' || actionType === 'RESUBMIT') && !decisionReason.trim()) {
      showToast('A reason is mandatory for rejection or resubmission request.', 'error');
      return;
    }

    const nextStatus: WorkerVerificationStatus =
      actionType === 'APPROVE'
        ? 'APPROVED'
        : actionType === 'RESUBMIT'
        ? 'RESUBMISSION_REQUIRED'
        : 'REJECTED';

    updateWorkerVerification(
      selectedWorker.id,
      nextStatus,
      decisionReason.trim() || 'Verified all required DigiLocker credentials and trade certificate.'
    );

    setSelectedWorker((prev) => (prev ? { ...prev, verificationStatus: nextStatus } : null));
    setActionType(null);
    setDecisionReason('');
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Worker Verification Queue</h1>
          <p className="text-gray-500 text-xs">
            Authenticate trade licenses, DigiLocker identity proofs, and Bengaluru residency
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-amber-100 text-amber-800 font-bold px-2.5 py-1 rounded-full text-xs">
            {workerProfiles.filter((w) => w.verificationStatus === 'PENDING_REVIEW').length} Pending Review
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Applications' },
            { key: 'PENDING_REVIEW', label: 'Pending Review' },
            { key: 'APPROVED', label: 'Approved' },
            { key: 'RESUBMISSION_REQUIRED', label: 'Resubmission Req.' },
            { key: 'REJECTED', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterStatus(tab.key)}
              className={`py-1.5 px-3 rounded-xl font-bold transition-all ${
                filterStatus === tab.key
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
            placeholder="Search worker by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Worker / Professional</th>
              <th className="py-3 px-4">Primary Category</th>
              <th className="py-3 px-4">Documents Uploaded</th>
              <th className="py-3 px-4">Submitted Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredList.map((w) => (
              <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={w.avatarUrl}
                      alt={w.fullName}
                      className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{w.fullName}</h4>
                      <p className="text-[11px] text-gray-500">{w.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-medium text-gray-800">{w.primaryCategory}</td>
                <td className="py-3.5 px-4">
                  <span className="font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[11px]">
                    {w.documents.length} File(s)
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                  {w.verificationSubmittedAt
                    ? new Date(w.verificationSubmittedAt).toLocaleDateString()
                    : 'N/A'}
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2.5 py-1 rounded-full ${
                      w.verificationStatus === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : w.verificationStatus === 'PENDING_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : w.verificationStatus === 'RESUBMISSION_REQUIRED'
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {w.verificationStatus.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedWorker(w)}
                    className="py-1.5 px-3 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-xl text-xs transition-colors"
                  >
                    Review Dossier →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Worker Document Review Drawer / Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lifted max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <img
                  src={selectedWorker.avatarUrl}
                  alt={selectedWorker.fullName}
                  className="w-12 h-12 rounded-2xl object-cover"
                />
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    Verification Dossier: {selectedWorker.fullName}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    {selectedWorker.primaryCategory} • {selectedWorker.phone}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-full"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Status Header */}
              <div className="p-3.5 bg-brand-bg rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase font-semibold">
                    Current Application Status
                  </span>
                  <p className="font-bold text-sm text-brand-dark mt-0.5">
                    {selectedWorker.verificationStatus.replace('_', ' ')}
                  </p>
                </div>
                {selectedWorker.verificationReviewedBy && (
                  <span className="text-[11px] text-gray-500">
                    Reviewed by: <strong>{selectedWorker.verificationReviewedBy}</strong>
                  </span>
                )}
              </div>

              {/* Bio & Skills */}
              <div className="space-y-2">
                <h4 className="font-bold text-gray-900">Trade Profile Summary</h4>
                <p className="text-gray-600 leading-relaxed bg-gray-50 p-3 rounded-xl">
                  {selectedWorker.about}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWorker.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-white border border-gray-200 rounded text-gray-700 font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents Inspection List */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-accent" />
                  <span>Submitted Identification & Certification Documents</span>
                </h4>

                <div className="space-y-2">
                  {selectedWorker.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-brand-dark" />
                          <span className="font-bold text-gray-900">
                            {doc.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-gray-400">
                          Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-[11px]">
                        <span className="font-mono text-gray-700 font-medium">{doc.fileName}</span>
                        <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          Simulated PDF (Safe Demo)
                        </span>
                      </div>

                      {doc.notes && (
                        <p className="text-[11px] text-gray-500 italic">Note: {doc.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Banking & Settlement Target */}
              <div className="p-3.5 bg-gray-50 rounded-xl space-y-1">
                <h4 className="font-bold text-gray-900">Bank Account for Weekly Settlements</h4>
                <p className="text-gray-600">
                  {selectedWorker.bankDetails?.bankName} • Account:{' '}
                  {selectedWorker.bankDetails?.accountNumberMasked} • IFSC:{' '}
                  {selectedWorker.bankDetails?.ifscCode}
                </p>
              </div>

              {/* Decision Section */}
              {canDecide ? (
                <div className="p-4 bg-brand-bg rounded-2xl border border-gray-200 space-y-3">
                  <h4 className="font-bold text-gray-900">Take Verification Decision</h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setActionType('APPROVE');
                        setDecisionReason('All submitted documents verified and approved.');
                      }}
                      className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      ✓ Approve Worker Profile
                    </button>
                    <button
                      onClick={() => {
                        setActionType('RESUBMIT');
                        setDecisionReason('');
                      }}
                      className="py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xs"
                    >
                      Request Resubmission
                    </button>
                    <button
                      onClick={() => {
                        setActionType('REJECT');
                        setDecisionReason('');
                      }}
                      className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Reject Application
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                  <strong>Read-Only Notice:</strong> Your current admin role ({currentUser.role}) does not have permission to execute verification decisions. Switch to Super Admin or Disputes & Verification.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirmation & Reason Modal for Verification Decision */}
      {actionType && selectedWorker && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-5 space-y-3 shadow-lifted text-xs">
            <h3 className="font-bold text-gray-900 text-sm">
              Confirm {actionType.replace('_', ' ')} Decision for {selectedWorker.fullName}
            </h3>
            <p className="text-gray-600">
              This action will update the worker profile status and log an entry into the privileged audit log.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Official Verification Reason / Notes {actionType !== 'APPROVE' && '(Required)'}
              </label>
              <textarea
                rows={3}
                required={actionType !== 'APPROVE'}
                placeholder={
                  actionType === 'RESUBMIT'
                    ? 'e.g. Uploaded trade certificate scan was illegible. Please submit a clearer scan with visible reg number.'
                    : actionType === 'REJECT'
                    ? 'e.g. Failed background check criteria or invalid credentials.'
                    : 'Notes on document authentication...'
                }
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActionType(null)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`flex-1 py-2 text-white rounded-xl font-bold ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : actionType === 'RESUBMIT'
                    ? 'bg-orange-500 hover:bg-orange-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

