import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { Settings, Bell, Send, ShieldCheck, Info } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { sendSimulatedNotification, showToast } = useApp();
  const [broadcastTitle, setBroadcastTitle] = useState('Festive Weekend Demand Spike');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'High request volume expected in Indiranagar & Koramangala. Partner surge allowance active.'
  );

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;
    sendSimulatedNotification(broadcastTitle.trim(), broadcastMessage.trim());
  };

  return (
    <div className="space-y-6 text-xs max-w-3xl">
      <div>
        <h1 className="text-base font-bold text-gray-900">Platform Settings & Branding Configuration</h1>
        <p className="text-gray-500 text-xs">
          Central app identity placeholders, regional defaults, and broadcast notification simulations
        </p>
      </div>

      {/* Central Identity Specification Info Card */}
      <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-3">
        <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-brand-dark" />
          <span>Brand Identity Hierarchy (Per Brief)</span>
        </h3>
        <div className="space-y-2 text-gray-600">
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Parent Corporate Entity:</span>
            <span className="font-bold text-gray-900">{APP_CONFIG.parentCompany}</span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Consumer App Placeholder:</span>
            <span className="font-mono font-bold text-brand-dark bg-brand-bg px-2 py-0.5 rounded">
              [{APP_CONFIG.appDisplayNamePlaceholder}]
            </span>
          </div>
          <div className="flex justify-between py-1.5 border-b border-gray-100">
            <span className="text-gray-500">Initial Metro Target:</span>
            <span className="font-semibold text-gray-900">{APP_CONFIG.cityDefault}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-gray-500">Currency Standard:</span>
            <span className="font-semibold text-gray-900">
              {APP_CONFIG.currencyCode} ({APP_CONFIG.currencySymbol})
            </span>
          </div>
        </div>
        <p className="text-[11px] text-gray-400 italic">
          *As instructed in the brief: The consumer-facing app name is undecided. ACubeX is parent company branding only.
        </p>
      </div>

      {/* Broadcast Notification Simulation Form */}
      <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-4">
        <div>
          <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-accent" />
            <span>Simulate System Notification Broadcast</span>
          </h3>
          <p className="text-gray-500 text-[11px] mt-0.5">
            Dispatches a high-priority in-app notification to all active demo user inboxes
          </p>
        </div>

        <form onSubmit={handleSendBroadcast} className="space-y-3">
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Broadcast Subject</label>
            <input
              type="text"
              required
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700 mb-1">Broadcast Message Body</label>
            <textarea
              rows={3}
              required
              value={broadcastMessage}
              onChange={(e) => setBroadcastMessage(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            />
          </div>

          <button
            type="submit"
            className="py-2.5 px-4 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Send className="w-3.5 h-3.5 text-brand-accent" />
            <span>Dispatch Broadcast to All Personas</span>
          </button>
        </form>
      </div>
    </div>
  );
};

