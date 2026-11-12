import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { ServiceCategory } from '../../types';
import { CategoryIcon } from '../common/Icons';
import { FolderTree, Plus, Check, X, Edit2, Power } from 'lucide-react';

export const AdminCategories: React.FC = () => {
  const { categories, toggleCategoryStatus, showToast } = useApp();
  const [selectedCat, setSelectedCat] = useState<ServiceCategory | null>(null);

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Service Categories & Subcategories</h1>
          <p className="text-gray-500 text-xs">Manage marketplace service catalog, base starting fares, and active states</p>
        </div>
        <button
          onClick={() => showToast('Category creation simulated in prototype state.', 'info')}
          className="py-2 px-3.5 bg-brand-dark hover:bg-brand-darker text-white font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4 text-brand-accent" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-4 bg-white rounded-2xl border border-gray-200 shadow-soft space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-brand-bg text-brand-dark flex items-center justify-center">
                  <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                </div>
                <button
                  onClick={() => toggleCategoryStatus(cat.id)}
                  className={`flex items-center gap-1 py-1 px-2.5 rounded-full text-[10px] font-bold transition-colors ${
                    cat.isActive
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                  title="Toggle Category Status"
                >
                  <Power className="w-3 h-3" />
                  <span>{cat.isActive ? 'Active' : 'Inactive'}</span>
                </button>
              </div>

              <div>
                <h3 className="font-bold text-sm text-gray-900">{cat.name}</h3>
                <p className="text-gray-500 text-[11px] mt-0.5 line-clamp-2">{cat.description}</p>
              </div>

              <div className="pt-2 border-t border-gray-100 space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">
                  Common Subcategories ({cat.subcategories.length})
                </span>
                <div className="space-y-1">
                  {cat.subcategories.slice(0, 3).map((sub) => (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between text-[11px] p-1.5 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-800 truncate">{sub.name}</span>
                      <span className="font-bold text-brand-dark shrink-0">
                        From {APP_CONFIG.currencySymbol}{sub.startingPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded">
                Comm: {cat.baseCommissionPct}%
              </span>
              <button
                onClick={() => setSelectedCat(cat)}
                className="text-brand-dark font-bold hover:underline"
              >
                Inspect Services →
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl p-5 shadow-lifted space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-gray-900 text-sm">
                Category Services: {selectedCat.name}
              </h3>
              <button onClick={() => setSelectedCat(null)} className="text-gray-400">✕</button>
            </div>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {selectedCat.subcategories.map((sub) => (
                <div key={sub.id} className="p-3 bg-gray-50 rounded-xl space-y-1">
                  <div className="flex justify-between font-bold text-gray-900">
                    <span>{sub.name}</span>
                    <span className="text-brand-dark">{APP_CONFIG.currencySymbol}{sub.startingPrice}</span>
                  </div>
                  <p className="text-gray-500 text-[11px]">{sub.description}</p>
                  <p className="text-[10px] text-gray-400">Est. duration: {sub.estimatedDuration}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCat(null)}
              className="w-full py-2 bg-brand-dark text-white rounded-xl font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

