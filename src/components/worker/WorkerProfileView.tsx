import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  User,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  FileCheck,
  CreditCard,
  ArrowRightLeft,
  Edit2,
  Check,
} from 'lucide-react';

export const WorkerProfileView: React.FC = () => {
  const { currentWorkerProfile, workerProfiles, updateWorkerProfile, switchUserMode, showToast } =
    useApp();

  const worker = currentWorkerProfile || workerProfiles[0];

  const [isEditing, setIsEditing] = useState(false);
  const [headline, setHeadline] = useState(worker.headline);
  const [baseFare, setBaseFare] = useState(worker.baseFare);
  const [hourlyRate, setHourlyRate] = useState(worker.hourlyRate);

  const handleSave = () => {
    updateWorkerProfile(worker.id, {
      headline,
      baseFare: Number(baseFare),
      hourlyRate: Number(hourlyRate),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 pb-24 text-xs">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-gray-900">Worker Profile</h1>
          <p className="text-[11px] text-gray-500">Service professional settings & rates</p>
        </div>
        <button
          onClick={() => switchUserMode('CUSTOMER')}
          className="flex items-center gap-1.5 py-1.5 px-3 bg-brand-bg text-brand-dark rounded-xl font-bold border border-gray-200 hover:bg-gray-100"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" />
          <span>Switch to Customer Mode</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5">
          <img
            src={worker.avatarUrl}
            alt={worker.fullName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-accent shadow-xs"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold text-gray-900">{worker.fullName}</h2>
              {worker.verificationStatus === 'APPROVED' && (
                <ShieldCheck className="w-4 h-4 text-brand-accent fill-brand-accent/20" />
              )}
            </div>
            <p className="text-gray-500 text-[11px]">{worker.primaryCategory}</p>
            <p className="text-gray-400 text-[10px]">{worker.phone} • {worker.email}</p>
          </div>
        </div>

        <button
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={`p-2 rounded-xl border flex items-center gap-1 font-semibold text-xs transition-colors ${
            isEditing
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
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

      {/* Editable Rates & Headline */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3">
        <h3 className="font-bold text-gray-900 text-xs">Rates & Display Headline</h3>

        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="block text-gray-600 mb-1 font-medium">Headline</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Base Fare ({APP_CONFIG.currencySymbol})</label>
                <input
                  type="number"
                  value={baseFare}
                  onChange={(e) => setBaseFare(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-gray-600 mb-1 font-medium">Hourly Rate ({APP_CONFIG.currencySymbol})</label>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-gray-700">
            <p className="text-gray-600 italic">"{worker.headline}"</p>
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-50">
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Base Diagnostic</span>
                <span className="font-bold text-brand-dark text-sm">
                  {APP_CONFIG.currencySymbol}{worker.baseFare}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-gray-400 block uppercase">Hourly Labor</span>
                <span className="font-bold text-gray-900 text-sm">
                  {APP_CONFIG.currencySymbol}{worker.hourlyRate}/hr
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skills & Service Areas */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3">
        <h3 className="font-bold text-gray-900 text-xs">Skills & Service Areas</h3>
        <div>
          <span className="text-[10px] text-gray-400 block uppercase mb-1">Active Skills</span>
          <div className="flex flex-wrap gap-1.5">
            {worker.skills.map((s) => (
              <span key={s} className="px-2 py-0.5 bg-brand-bg text-gray-800 rounded-md font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-gray-50">
          <span className="text-[10px] text-gray-400 block uppercase mb-1">Bengaluru Coverage</span>
          <p className="text-gray-700">{worker.serviceAreas.join(', ')}</p>
        </div>
      </div>

      {/* Verification Documents Status */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-soft space-y-3">
        <h3 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-emerald-600" />
          <span>Verification Documents</span>
        </h3>
        <div className="space-y-2">
          {worker.documents.map((doc) => (
            <div
              key={doc.id}
              className="p-2.5 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-gray-900 text-xs">{doc.type.replace('_', ' ')}</p>
                <p className="font-mono text-[10px] text-gray-500">{doc.fileName}</p>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  doc.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
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

