import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AuditLogEntry } from '../../types';
import { History, Search, ShieldCheck, Clock, Filter } from 'lucide-react';

export const AdminAuditLog: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterAction, setFilterAction] = useState<string>('ALL');

  const filteredLogs = auditLogs
    .filter((log) => (filterAction === 'ALL' ? true : log.action.includes(filterAction)))
    .filter((log) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        log.actorName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.targetType.toLowerCase().includes(q)
      );
    });

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Privileged Action Audit Log</h1>
          <p className="text-gray-500 text-xs">
            Immutable system audit trail recording simulated approvals, refunds, payouts, and setting mutations
          </p>
        </div>
        <span className="bg-brand-bg text-brand-dark font-bold px-2.5 py-1 rounded-full border border-gray-200">
          {auditLogs.length} Events Logged
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {[
            { key: 'ALL', label: 'All Actions' },
            { key: 'VERIFICATION', label: 'Verifications' },
            { key: 'REFUND', label: 'Refunds' },
            { key: 'SETTLEMENT', label: 'Settlements' },
            { key: 'DISPUTE', label: 'Disputes' },
            { key: 'COMMISSION', label: 'Commissions' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilterAction(tab.key)}
              className={`py-1.5 px-3 rounded-xl font-bold transition-all ${
                filterAction === tab.key
                  ? 'bg-brand-dark text-white'
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
            placeholder="Search audit trail..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-1.5 pl-8 pr-3 bg-gray-50 border border-gray-200 rounded-xl text-xs"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Timestamp</th>
              <th className="py-3 px-4">Staff Actor</th>
              <th className="py-3 px-4">Action Type</th>
              <th className="py-3 px-4">Target Type</th>
              <th className="py-3 px-4">Audit Details</th>
              <th className="py-3 px-4">Mock IP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-bold text-gray-900">{log.actorName}</p>
                  <p className="text-[10px] text-brand-dark font-medium">{log.actorRole}</p>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-mono text-[10px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded font-bold">
                    {log.action}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-600 font-medium">{log.targetType}</td>
                <td className="py-3.5 px-4 text-gray-800 leading-relaxed max-w-md">
                  {log.details}
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-400 text-[10px]">
                  {log.ipAddressDemo}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

