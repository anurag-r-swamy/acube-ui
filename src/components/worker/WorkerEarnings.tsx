import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { SettlementRecord, PaymentTransaction } from '../../types';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
  Calendar,
  Lock,
} from 'lucide-react';

export const WorkerEarnings: React.FC = () => {
  const {
    currentWorkerProfile,
    workerProfiles,
    settlements,
    transactions,
    bookings,
  } = useApp();

  const worker = currentWorkerProfile || workerProfiles[0];
  const [selectedSettlement, setSelectedSettlement] = useState<SettlementRecord | null>(null);

  // Worker settlements
  const mySettlements = settlements.filter((s) => s.workerId === worker?.id);

  // Completed jobs & gross revenue
  const myCompletedBookings = bookings.filter(
    (b) => b.workerId === worker?.id && b.status === 'COMPLETED'
  );

  const grossEarnings = myCompletedBookings.reduce(
    (acc, b) => acc + (b.finalAmount || b.totalEstimatedAmount),
    0
  );

  // Illustrative commission
  const totalCommission = Math.round(grossEarnings * 0.15);
  const netEarnings = grossEarnings - totalCommission;

  return (
    <div className="space-y-4 pb-24 text-xs">
      <div>
        <h1 className="text-base font-bold text-gray-900">Earnings & Payout Ledger</h1>
        <p className="text-[11px] text-gray-500">Read-only financial records for weekly settlements</p>
      </div>

      {/* Provisional Commission Disclaimer Alert */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-2.5 text-amber-950">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-[11px] leading-relaxed">
          <p className="font-bold">Illustrative & Provisional Commission Model</p>
          <p className="text-amber-800">
            Platform service commissions (shown at ~15% baseline) are illustrative estimates for prototype calculation. Actual commercial fee schedules are governed by formal partner agreements.
          </p>
        </div>
      </div>

      {/* Hero Financial Summary Card */}
      <div className="p-5 bg-gradient-to-r from-brand-dark to-brand-light text-white rounded-2xl shadow-lifted space-y-4">
        <div>
          <span className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">
            Net Earnings (Completed Jobs)
          </span>
          <p className="text-2xl font-extrabold text-white mt-0.5">
            {APP_CONFIG.currencySymbol}{netEarnings.toLocaleString('en-IN')}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
          <div>
            <span className="text-[10px] text-white/60 block">Gross Service Value</span>
            <span className="font-bold text-white text-sm">
              {APP_CONFIG.currencySymbol}{grossEarnings.toLocaleString('en-IN')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-white/60 block">Provisional Commission (15%)</span>
            <span className="font-bold text-amber-300 text-sm">
              - {APP_CONFIG.currencySymbol}{totalCommission.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Payout Bank Account Info */}
      <div className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-soft flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block font-semibold uppercase">
            Settlement Target
          </span>
          <p className="font-bold text-gray-900 text-xs mt-0.5">
            {worker.bankDetails?.bankName} ({worker.bankDetails?.accountNumberMasked})
          </p>
          <p className="text-[10px] text-gray-500 font-mono">UPI: {worker.bankDetails?.upiId}</p>
        </div>
        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
          Verified
        </span>
      </div>

      {/* Settlement Batch History */}
      <div className="space-y-2.5">
        <h2 className="text-sm font-bold text-gray-900">Weekly Settlement Batches</h2>

        {mySettlements.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-gray-100 text-center text-gray-400">
            No settlement batches generated yet.
          </div>
        ) : (
          <div className="space-y-2.5">
            {mySettlements.map((setl) => (
              <div
                key={setl.id}
                onClick={() => setSelectedSettlement(setl)}
                className="p-3.5 bg-white rounded-2xl border border-gray-100 shadow-soft hover:shadow-medium cursor-pointer transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-bold text-gray-700">
                    {setl.settlementRef}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      setl.status === 'PAID'
                        ? 'bg-emerald-100 text-emerald-800'
                        : setl.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {setl.status}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-gray-600">
                  <span>
                    Period: {setl.periodStart} to {setl.periodEnd}
                  </span>
                  <span className="font-extrabold text-brand-dark text-xs">
                    {APP_CONFIG.currencySymbol}{setl.netPayoutAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                {setl.bankReference && (
                  <p className="text-[10px] text-gray-400 font-mono">
                    Ref: {setl.bankReference}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Read-Only Transaction Detail Notice */}
      <div className="p-3 bg-gray-100 rounded-xl flex items-center gap-2 text-gray-500 text-[11px]">
        <Lock className="w-4 h-4 text-gray-400 shrink-0" />
        <span>
          Settlement ledger entries are immutable and finalized by the Accounts & Finance admin desk.
        </span>
      </div>

      {/* Settlement Detail Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-sm w-full bg-white rounded-2xl p-5 shadow-lifted space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Settlement Batch Breakdown</h3>
              <button
                onClick={() => setSelectedSettlement(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Batch Ref:</span>
                <span className="font-mono font-bold text-gray-900">
                  {selectedSettlement.settlementRef}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Gross Bookings:</span>
                <span className="font-semibold text-gray-900">
                  {APP_CONFIG.currencySymbol}{selectedSettlement.grossBookingsAmount}
                </span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Commission Deducted:</span>
                <span className="font-semibold text-red-600">
                  - {APP_CONFIG.currencySymbol}{selectedSettlement.totalCommissionDeducted}
                </span>
              </div>
              <div className="flex justify-between font-bold text-sm text-brand-dark pt-2 border-t">
                <span>Net Released:</span>
                <span>{APP_CONFIG.currencySymbol}{selectedSettlement.netPayoutAmount}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedSettlement(null)}
              className="w-full py-2 bg-brand-dark text-white rounded-xl font-semibold text-xs mt-2"
            >
              Close Ledger Entry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

