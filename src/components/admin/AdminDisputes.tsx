import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DisputeCase, DisputeStatus } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Search,
  MessageSquare,
  ShieldAlert,
  Send,
  User,
  AlertOctagon,
} from 'lucide-react';

export const AdminDisputes: React.FC = () => {
  const { disputes, updateDisputeStatus, addDisputeInternalNote, currentUser, showToast } =
    useApp();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newInternalNote, setNewInternalNote] = useState('');

  // Resolution modal state
  const [showResolutionModal, setShowResolutionModal] = useState(false);
  const [targetStatus, setTargetStatus] = useState<DisputeStatus>('RESOLVED');
  const [resolutionSummary, setResolutionSummary] = useState('');

  const canResolve =
    currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'DISPUTES_VERIFICATION';

  const filteredDisputes = disputes
    .filter((d) => (filterStatus === 'ALL' ? true : d.status === filterStatus))
    .filter((d) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.caseRef.toLowerCase().includes(q) ||
        d.openedByName.toLowerCase().includes(q) ||
        d.againstName.toLowerCase().includes(q) ||
        d.reason.toLowerCase().includes(q)
      );
    });

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase || !newInternalNote.trim()) return;

    addDisputeInternalNote(selectedCase.id, newInternalNote.trim());
    setSelectedCase((prev) =>
      prev
        ? {
            ...prev,
            internalNotes: [
              ...prev.internalNotes,
              {
                id: `in-${Date.now()}`,
                authorName: currentUser.name,
                timestamp: new Date().toISOString(),
                text: newInternalNote.trim(),
              },
            ],
          }
        : null
    );
    setNewInternalNote('');
  };

  const handleConfirmResolution = () => {
    if (!selectedCase || !resolutionSummary.trim()) {
      showToast('Resolution summary notes are required.', 'error');
      return;
    }

    updateDisputeStatus(selectedCase.id, targetStatus, resolutionSummary.trim());
    setSelectedCase((prev) =>
      prev
        ? {
            ...prev,
            status: targetStatus,
            resolutionNotes: resolutionSummary.trim(),
            resolvedAt: new Date().toISOString(),
          }
        : null
    );

    setShowResolutionModal(false);
    setResolutionSummary('');
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Complaints & Disputes Desk</h1>
          <p className="text-gray-500 text-xs">
            Review customer & partner incident reports, inspect evidence, and enforce resolutions
          </p>
        </div>

        <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-full text-xs">
          {disputes.filter((d) => d.status === 'OPEN' || d.status === 'IN_REVIEW').length} Active Cases
        </span>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Cases' },
            { key: 'OPEN', label: 'Open' },
            { key: 'IN_REVIEW', label: 'In Review' },
            { key: 'ESCALATED', label: 'Escalated' },
            { key: 'RESOLVED', label: 'Resolved' },
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
            placeholder="Search by case #, customer, pro..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Disputes Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Case Ref</th>
              <th className="py-3 px-4">Booking Ref</th>
              <th className="py-3 px-4">Opened By</th>
              <th className="py-3 px-4">Subject / Reason</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredDisputes.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-red-600">{d.caseRef}</td>
                <td className="py-3.5 px-4 font-mono font-medium text-gray-700">{d.bookingRef}</td>
                <td className="py-3.5 px-4">
                  <p className="font-bold text-gray-900">{d.openedByName}</p>
                  <p className="text-[10px] text-gray-400">{d.openedByRole}</p>
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-semibold text-gray-800">{d.reason}</p>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{d.description}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2.5 py-1 rounded-full ${
                      d.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.status === 'IN_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : d.status === 'ESCALATED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {d.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => setSelectedCase(d)}
                    className="py-1.5 px-3 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-xl text-xs transition-colors"
                  >
                    Investigate →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Case Details Drawer / Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lifted max-h-[90vh] flex flex-col animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900">
                    Dispute Case #{selectedCase.caseRef}
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Booking: {selectedCase.bookingRef} • Opened by {selectedCase.openedByName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              {/* Parties Card */}
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Complainant
                  </span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedCase.openedByName}
                  </p>
                  <span className="text-[10px] text-gray-500">Role: {selectedCase.openedByRole}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold block">
                    Respondent / Against
                  </span>
                  <p className="font-bold text-gray-900 text-sm mt-0.5">
                    {selectedCase.againstName}
                  </p>
                  <span className="text-[10px] text-gray-500">Service Professional</span>
                </div>
              </div>

              {/* Description & Evidence */}
              <div>
                <h4 className="font-bold text-gray-900 mb-1">Incident Report: {selectedCase.reason}</h4>
                <p className="p-3 bg-red-50/50 border border-red-100 rounded-xl text-gray-700 leading-relaxed">
                  {selectedCase.description}
                </p>

                {selectedCase.evidenceAttachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <span className="text-[10px] text-gray-400 font-bold block">
                      Submitted Photos / Evidence
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.evidenceAttachments.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-1.5 p-1.5 bg-white border border-gray-200 rounded-lg text-[11px]"
                        >
                          <FileText className="w-3.5 h-3.5 text-red-500" />
                          <span className="font-mono text-gray-700">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Internal Staff Notes */}
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Staff Investigation Thread & Notes</h4>
                <div className="space-y-2 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                  {selectedCase.internalNotes.map((note) => (
                    <div key={note.id} className="p-2.5 bg-white rounded-xl border border-gray-100">
                      <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                        <span className="font-bold text-brand-dark">{note.authorName}</span>
                        <span>{new Date(note.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{note.text}</p>
                    </div>
                  ))}

                  {/* Add note */}
                  <form onSubmit={handleAddNote} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Add confidential internal note..."
                      value={newInternalNote}
                      onChange={(e) => setNewInternalNote(e.target.value)}
                      className="flex-1 p-2 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-dark"
                    />
                    <button
                      type="submit"
                      disabled={!newInternalNote.trim()}
                      className="py-2 px-3 bg-brand-dark hover:bg-brand-darker disabled:opacity-40 text-white rounded-xl font-bold shadow-xs"
                    >
                      Post Note
                    </button>
                  </form>
                </div>
              </div>

              {/* Resolution Notes (if resolved) */}
              {selectedCase.resolutionNotes && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-950">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Resolution Summary (Recorded)</span>
                  </div>
                  <p className="text-xs leading-relaxed">{selectedCase.resolutionNotes}</p>
                  <p className="text-[10px] text-emerald-700 mt-1">
                    Resolved at: {new Date(selectedCase.resolvedAt || '').toLocaleString()}
                  </p>
                </div>
              )}

              {/* Resolution Action Trigger */}
              {canResolve && selectedCase.status !== 'RESOLVED' && (
                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setTargetStatus('RESOLVED');
                      setShowResolutionModal(true);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    ✓ Resolve & Issue Determination
                  </button>
                  <button
                    onClick={() => {
                      setTargetStatus('ESCALATED');
                      setShowResolutionModal(true);
                    }}
                    className="py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Escalate to Legal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Resolution Decision Modal */}
      {showResolutionModal && selectedCase && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-5 space-y-3 shadow-lifted text-xs">
            <h3 className="font-bold text-gray-900 text-sm">
              Resolve Dispute #{selectedCase.caseRef} ({targetStatus})
            </h3>
            <p className="text-gray-600">
              Provide formal decision text for the resolution report and audit log.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Resolution Summary</label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Case settled: Platform approved ₹300 courtesy coupon for laminate touch-up; worker given formal reminder on offline cash solicitation."
                value={resolutionSummary}
                onChange={(e) => setResolutionSummary(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowResolutionModal(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResolution}
                className="flex-1 py-2 bg-brand-dark hover:bg-brand-darker text-white rounded-xl font-bold"
              >
                Submit Resolution
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

