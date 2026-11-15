import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  ShieldCheck,
  FileCheck,
  ArrowRightLeft,
  Edit2,
  Check,
  CheckCircle2,
} from 'lucide-react';

export const WorkerProfileView: React.FC = () => {
  const { currentWorkerProfile, workerProfiles, updateWorkerProfile, switchUserMode } =
    useApp();

  const worker = currentWorkerProfile || workerProfiles[0];

  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(worker.headline);
  const [baseFare, setBaseFare] = useState(worker.baseFare);
  const [hourlyRate, setHourlyRate] = useState(worker.hourlyRate);
  const [dailyRate, setDailyRate] = useState(worker.dailyRate || 1800);

  const handleSave = () => {
    updateWorkerProfile(worker.id, {
      headline,
      baseFare: Number(baseFare),
      hourlyRate: Number(hourlyRate),
      dailyRate: Number(dailyRate),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-20 text-xs">
      <div>
        <h1 className="text-base font-bold text-black">Worker Profile</h1>
        <p className="text-[11px] text-slate-500">Service professional settings, rates & verification</p>
      </div>

      {/* Account Type Switcher Card (Worker <-> Customer) */}
      <div className="p-4 bg-[#0D2218] text-white rounded-2xl shadow-sm border border-[#1B4D3E] space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-xs text-white">Active Account: Worker Mode</span>
          </div>
          <span className="text-[10px] bg-white/10 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
            Professional
          </span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Switch to Customer mode to discover home services, book verified technicians, and manage personal bookings.
        </p>
        <button
          onClick={() => switchUserMode('CUSTOMER')}
          className="w-full py-2.5 px-3 bg-white hover:bg-slate-100 text-[#0D2218] font-black rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <ArrowRightLeft className="w-4 h-4 text-[#0D2218]" />
          <span>Switch to Customer Account</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <img
            src={worker.avatarUrl}
            alt={worker.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0D2218] shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-black">{worker.fullName}</h2>
              {worker.verificationStatus === 'APPROVED' && (
                <ShieldCheck className="w-4 h-4 text-emerald-600 fill-emerald-100" />
              )}
            </div>
            <p className="text-slate-600 text-[11px] font-semibold">{worker.primaryCategory}</p>
            <p className="text-slate-400 text-[10px]">{worker.phone} • {worker.email}</p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`p-2 rounded-xl border flex items-center gap-1 font-bold text-xs transition-colors ${
            isEditing
              ? 'bg-[#0D2218] text-white border-[#0D2218]'
              : 'bg-white text-black border-slate-200 hover:bg-slate-50'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Save</span>
            </>
          ) : (
            <>
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit</span>
            </>
          )}
        </button>
      </div>

      {/* Editable Rates (Per Hour & Per Day Fare) & Headline */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-black text-xs">Rates & Display Headline</h3>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-slate-600 mb-1 font-semibold">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[10px]">
                  Base Fare ({APP_CONFIG.currencySymbol})
                </label>
                <input
                  type="number"
                  value={baseFare}
                  onChange={(e) => setBaseFare(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[10px]">
                  Per Hour Fare ({APP_CONFIG.currencySymbol})
                </label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-slate-600 mb-1 font-semibold text-[10px]">
                  Per Day Fare ({APP_CONFIG.currencySymbol})
                </label>
                <input
                  type="number"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-slate-700">
            <p className="text-slate-600 italic">"{worker.headline}"</p>
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Base Diagnostic</span>
                <span className="font-extrabold text-black text-xs">
                  {APP_CONFIG.currencySymbol}{worker.baseFare}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Per Hour Fare</span>
                <span className="font-extrabold text-[#0D2218] text-xs">
                  {APP_CONFIG.currencySymbol}{worker.hourlyRate}/hr
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block uppercase">Per Day Fare</span>
                <span className="font-extrabold text-[#0D2218] text-xs">
                  {APP_CONFIG.currencySymbol}{worker.dailyRate || 1800}/day
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills & Service Areas */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-black text-xs">Skills & Service Areas</h3>
        <div>
          <span className="text-[10px] text-slate-400 block uppercase mb-1">Active Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((s) => (
              <span key={s} className="px-2.5 py-1 bg-slate-100 text-black rounded-lg font-semibold text-[11px]">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] text-slate-400 block uppercase mb-1">Bengaluru Coverage Localities</span>
          <p className="text-slate-700 font-medium">{worker.serviceAreas.join(', ')}</p>
        </div>
      </div>

      {/* Verification Documents Status */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-black text-xs flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-[#0D2218]" />
          <span>Verification Documents</span>
        </h3>
        <div className="space-y-2">
          {worker.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-black text-xs">{doc.type.replace('_', ' ')}</p>
                <p className="font-mono text-[10px] text-slate-500">{doc.fileName}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  doc.verified ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                }`}
              >
                {doc.verified ? 'Verified' : 'Under Review'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
