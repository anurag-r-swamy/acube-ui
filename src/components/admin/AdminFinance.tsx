import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { PaymentTransaction, SettlementRecord, CommissionRule } from '../../types';
import {
  CreditCard,
  DollarSign,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Filter,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';

export const AdminFinance: React.FC = () => {
  const {
    transactions,
    settlements,
    commissionRules,
    updateCategoryCommission,
    issueSimulatedRefund,
    releaseSimulatedSettlement,
    currentUser,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'TRANSACTIONS' | 'COMMISSIONS' | 'SETTLEMENTS'>('TRANSACTIONS');
  const [searchQuery, setSearchQuery] = useState('');

  // Refund modal state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedTxnForRefund, setSelectedTxnForRefund] = useState<PaymentTransaction | null>(null);
  const [refundReason, setRefundReason] = useState('Cancellation within policy guidelines');

  // Edit commission modal state
  const [editingRule, setEditingRule] = useState<CommissionRule | null>(null);
  const [newCommissionPct, setNewCommissionPct] = useState<number>(15);

  const canExecuteFinanceActions =
    currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'ACCOUNTS_FINANCE';

  const filteredTransactions = transactions.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.transactionRef.toLowerCase().includes(q) ||
      t.bookingRef.toLowerCase().includes(q) ||
      t.customerName.toLowerCase().includes(q) ||
      (t.workerName && t.workerName.toLowerCase().includes(q))
    );
  });

  const handleConfirmRefund = () => {
    if (!selectedTxnForRefund || !refundReason.trim()) return;

    issueSimulatedRefund(selectedTxnForRefund.id, refundReason.trim());
    setShowRefundModal(false);
    setSelectedTxnForRefund(null);
    setRefundReason('Cancellation within policy guidelines');
  };

  const handleSaveCommission = () => {
    if (!editingRule) return;
    updateCategoryCommission(editingRule.id, newCommissionPct);
    setEditingRule(null);
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Finance, Ledger & Settlements</h1>
          <p className="text-gray-500 text-xs">
            Simulated payment transactions, commission rules, customer refunds, and partner weekly payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full text-xs">
            {transactions.length} Transactions Recorded
          </span>
        </div>
      </div>

      {/* Provisional Commission Disclaimer Alert */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <p className="font-bold">Provisional & Illustrative Financial Rules</p>
          <p className="text-amber-800">
            Commission percentages, platform processing fees (₹49), and payout reconciliation schedules shown here are demonstrative prototypes. No real banking or card clearing networks are integrated.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`py-3 px-5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'TRANSACTIONS'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Customer Transactions Ledger ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('SETTLEMENTS')}
          className={`py-3 px-5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'SETTLEMENTS'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Partner Payout Settlements ({settlements.length})
        </button>
        <button
          onClick={() => setActiveTab('COMMISSIONS')}
          className={`py-3 px-5 font-bold text-xs border-b-2 transition-all ${
            activeTab === 'COMMISSIONS'
              ? 'border-brand-dark text-brand-dark'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          Provisional Commission Rules ({commissionRules.length})
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS LEDGER */}
      {activeTab === 'TRANSACTIONS' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
            <span className="text-gray-500 font-medium">
              Showing simulated card/UPI charges and escrow releases
            </span>
            <div className="relative min-w-[220px]">
              <input
                type="text"
                placeholder="Search transaction or booking..."
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
                  <th className="py-3 px-4">Txn Ref</th>
                  <th className="py-3 px-4">Booking</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Gross Charge</th>
                  <th className="py-3 px-4">Platform Comm.</th>
                  <th className="py-3 px-4">Worker Payout</th>
                  <th className="py-3 px-4">Method / Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                      {txn.transactionRef}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-gray-600">{txn.bookingRef}</td>
                    <td className="py-3.5 px-4 font-medium text-gray-900">{txn.customerName}</td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">
                      {APP_CONFIG.currencySymbol}{txn.amount}
                    </td>
                    <td className="py-3.5 px-4 text-amber-700 font-semibold">
                      {APP_CONFIG.currencySymbol}{txn.commissionAmount}
                    </td>
                    <td className="py-3.5 px-4 text-emerald-700 font-semibold">
                      {APP_CONFIG.currencySymbol}{txn.workerPayoutAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                          {txn.paymentMethod}
                        </span>
                        <span
                          className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                            txn.isRefunded
                              ? 'bg-red-100 text-red-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {txn.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {!txn.isRefunded && canExecuteFinanceActions && (
                        <button
                          onClick={() => {
                            setSelectedTxnForRefund(txn);
                            setShowRefundModal(true);
                          }}
                          className="py-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-semibold"
                        >
                          Issue Refund
                        </button>
                      )}
                      {txn.isRefunded && (
                        <span className="text-[10px] text-gray-400 italic">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: SETTLEMENTS */}
      {activeTab === 'SETTLEMENTS' && (
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
            <p className="text-gray-600">
              Weekly partner payouts aggregated after commission deductions.
            </p>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Automated Monday Payout Engine (Simulated)
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
                  <th className="py-3 px-4">Settlement Batch</th>
                  <th className="py-3 px-4">Partner Name</th>
                  <th className="py-3 px-4">Period</th>
                  <th className="py-3 px-4">Gross Value</th>
                  <th className="py-3 px-4">Comm. Deducted</th>
                  <th className="py-3 px-4">Net Payout</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Trigger</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {settlements.map((setl) => (
                  <tr key={setl.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                      {setl.settlementRef}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-gray-900">{setl.workerName}</td>
                    <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                      {setl.periodStart} - {setl.periodEnd}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {APP_CONFIG.currencySymbol}{setl.grossBookingsAmount}
                    </td>
                    <td className="py-3.5 px-4 text-red-600 font-semibold">
                      - {APP_CONFIG.currencySymbol}{setl.totalCommissionDeducted}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-700">
                      {APP_CONFIG.currencySymbol}{setl.netPayoutAmount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          setl.status === 'PAID'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {setl.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {setl.status === 'PENDING' && canExecuteFinanceActions && (
                        <button
                          onClick={() => releaseSimulatedSettlement(setl.id)}
                          className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                        >
                          Release Payout
                        </button>
                      )}
                      {setl.status === 'PAID' && (
                        <span className="text-[10px] font-mono text-gray-400">
                          {setl.bankReference?.slice(0, 15)}...
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSION RULES */}
      {activeTab === 'COMMISSIONS' && (
        <div className="space-y-4">
          <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-soft">
            <h3 className="font-bold text-sm text-gray-900 mb-1">
              Active Category Commission Schedule
            </h3>
            <p className="text-gray-500 text-[11px]">
              Every commission rule must carry a clear provisional demo tag. Super Admin and Accounts & Finance roles can configure rates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commissionRules.map((rule) => (
              <div
                key={rule.id}
                className="p-4 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900">{rule.categoryName}</h4>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                    Provisional Example
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-brand-dark">{rule.percentage}%</span>
                  <span className="text-[11px] text-gray-400">of diagnostic & labor fare</span>
                </div>

                <p className="text-[11px] text-gray-600 leading-relaxed bg-brand-bg p-2.5 rounded-xl">
                  {rule.notes}
                </p>

                <div className="flex items-center justify-between pt-1 text-[11px] text-gray-400 border-t border-gray-100">
                  <span>Effective: {rule.effectiveFrom}</span>
                  {canExecuteFinanceActions && (
                    <button
                      onClick={() => {
                        setEditingRule(rule);
                        setNewCommissionPct(rule.percentage);
                      }}
                      className="text-brand-dark font-bold hover:underline"
                    >
                      Adjust Rate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issue Refund Modal */}
      {showRefundModal && selectedTxnForRefund && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-5 space-y-3 shadow-lifted text-xs">
            <h3 className="font-bold text-gray-900 text-sm">
              Confirm Simulated Refund for {selectedTxnForRefund.transactionRef}
            </h3>
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-900 text-[11px]">
              <p className="font-bold mb-0.5">Finance Policy Gate</p>
              Simulated refund of <strong>{APP_CONFIG.currencySymbol}{selectedTxnForRefund.amount}</strong> will be marked on Booking #{selectedTxnForRefund.bookingRef} and logged in the privileged audit log.
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Mandatory Refund Reason</label>
              <textarea
                rows={3}
                required
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowRefundModal(false)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Commission Modal */}
      {editingRule && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-sm w-full bg-white rounded-2xl p-5 space-y-3 shadow-lifted text-xs">
            <h3 className="font-bold text-gray-900 text-sm">
              Adjust Commission: {editingRule.categoryName}
            </h3>
            <p className="text-gray-500">
              Modifies the provisional baseline rate. Logs an audit entry.
            </p>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Percentage (%)</label>
              <input
                type="number"
                min={5}
                max={30}
                value={newCommissionPct}
                onChange={(e) => setNewCommissionPct(Number(e.target.value))}
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-center text-sm"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setEditingRule(null)}
                className="flex-1 py-2 border border-gray-200 text-gray-700 rounded-xl font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCommission}
                className="flex-1 py-2 bg-brand-dark text-white rounded-xl font-bold"
              >
                Save Rate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

