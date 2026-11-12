import React from 'react';
import { WorkerProfile } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  Calendar,
  MessageSquare,
  FileCheck,
} from 'lucide-react';
import { APP_CONFIG } from '../../config/branding';

interface ProviderProfileModalProps {
  worker: WorkerProfile | null;
  onClose: () => void;
  onBookNow: (worker: WorkerProfile) => void;
}

export const ProviderProfileModal: React.FC<ProviderProfileModalProps> = ({
  worker,
  onClose,
  onBookNow,
}) => {
  const { reviews } = useApp();

  if (!worker) return null;

  const workerReviews = reviews.filter((r) => r.workerId === worker.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
        {/* Header Cover & Close */}
        <div className="relative bg-gradient-to-r from-brand-dark to-brand-light p-6 text-white rounded-t-3xl sm:rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={worker.avatarUrl}
                alt={worker.fullName}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-white/80 shadow-md"
              />
              {worker.verificationStatus === 'APPROVED' && (
                <div
                  className="absolute -bottom-1 -right-1 bg-brand-accent text-white p-1 rounded-full shadow"
                  title="Identity & Trade Skills Verified"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold">{worker.fullName}</h2>
                {worker.verificationStatus === 'APPROVED' && (
                  <span className="text-[10px] bg-emerald-500/30 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full font-semibold">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-white/80 mt-0.5">{worker.headline}</p>

              <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                <div className="flex items-center gap-1 font-semibold text-brand-accent">
                  <Star className="w-3.5 h-3.5 fill-brand-accent" />
                  <span>{worker.rating.toFixed(1)}</span>
                  <span className="text-white/60 font-normal">({worker.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-white/80">
                  <Briefcase className="w-3.5 h-3.5 text-white/60" />
                  <span>{worker.completedJobsCount} jobs completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-700">
          {/* Key Rates & Experience Grid */}
          <div className="grid grid-cols-3 gap-2.5 p-3 bg-brand-bg rounded-xl border border-gray-100 text-center">
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Experience</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">{worker.experienceYears}+ Years</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Base Rate</p>
              <p className="font-bold text-brand-dark text-sm mt-0.5">
                {APP_CONFIG.currencySymbol}{worker.baseFare}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 uppercase tracking-wider">Hourly Rate</p>
              <p className="font-bold text-gray-900 text-sm mt-0.5">
                {APP_CONFIG.currencySymbol}{worker.hourlyRate}/hr
              </p>
            </div>
          </div>

          {/* About */}
          <div>
            <h3 className="font-bold text-gray-900 text-xs mb-1.5 flex items-center gap-1.5">
              <span>About the Professional</span>
            </h3>
            <p className="text-gray-600 leading-relaxed">{worker.about}</p>
          </div>

          {/* Skills Badges */}
          <div>
            <h3 className="font-bold text-gray-900 text-xs mb-2">Specializations & Skills</h3>
            <div className="flex flex-wrap gap-1.5">
              {worker.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-gray-800 font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Verification Proofs */}
          <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
            <h3 className="font-bold text-emerald-950 text-xs mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Platform Verification Checks Passed</span>
            </h3>
            <div className="space-y-1.5 text-xs text-emerald-900">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Government ID (Aadhaar/PAN) authenticated via DigiLocker</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Trade skills and competency certification confirmed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Local address and identity verified for Bengaluru</span>
              </div>
            </div>
          </div>

          {/* Service Areas & Languages */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                <span>Coverage Areas</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">{worker.serviceAreas.join(', ')}</p>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-xs mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-brand-accent" />
                <span>Languages</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">{worker.languages.join(', ')}</p>
            </div>
          </div>

          {/* Customer Reviews */}
          <div>
            <h3 className="font-bold text-gray-900 text-xs mb-2 flex items-center justify-between">
              <span>Customer Reviews ({workerReviews.length})</span>
            </h3>
            {workerReviews.length === 0 ? (
              <p className="text-gray-400 italic">No reviews yet for this professional.</p>
            ) : (
              <div className="space-y-2.5">
                {workerReviews.map((rev) => (
                  <div key={rev.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-900">{rev.customerName}</span>
                      <div className="flex items-center gap-0.5 text-brand-accent">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < rev.rating ? 'fill-brand-accent' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-600">{rev.comment}</p>
                    {rev.tags && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {rev.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600"
                          >
                            ✓ {t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] text-gray-500">Starting from</p>
            <p className="text-base font-bold text-brand-dark">
              {APP_CONFIG.currencySymbol}{worker.baseFare}
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onBookNow(worker);
            }}
            className="flex-1 py-3 px-5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4 text-brand-accent" />
            <span>Book {worker.fullName.split(' ')[0]} Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

