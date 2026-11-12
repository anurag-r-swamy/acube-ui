import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Tag, Plus, CheckCircle2 } from 'lucide-react';

export const AdminPromotions: React.FC = () => {
  const { promoCodes, showToast } = useApp();

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Promotions & Discount Campaigns</h1>
          <p className="text-gray-500 text-xs">Manage consumer coupons and incentive campaigns in Bengaluru</p>
        </div>
        <button
          onClick={() => showToast('Coupon code creation simulated.', 'info')}
          className="py-2 px-3.5 bg-brand-dark text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-brand-accent" />
          <span>Create Promo Code</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {promoCodes.map((promo) => (
          <div
            key={promo.id}
            className="p-4 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-extrabold text-sm text-brand-dark bg-brand-bg px-2.5 py-1 rounded-lg border border-gray-200">
                {promo.code}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>

            <div className="space-y-1">
              <p className="font-bold text-gray-900 text-xs">
                {promo.discountPct}% Discount (Max {APP_CONFIG.currencySymbol}{promo.maxDiscount})
              </p>
              <p className="text-gray-500 text-[11px]">
                Min. Booking: {APP_CONFIG.currencySymbol}{promo.minBookingAmount} • Valid until {promo.validUntil}
              </p>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between text-gray-400 text-[11px]">
              <span>Times Redeemed:</span>
              <span className="font-bold text-gray-800">{promo.usageCount} users</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

