import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DemoUser } from '../../types';
import { Users, Search, MapPin, Calendar, CheckCircle2 } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { users, bookings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<DemoUser | null>(null);

  const customerUsers = users.filter((u) => u.availableRoles.includes('CUSTOMER'));

  const filteredCustomers = customerUsers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
  });

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Customer Directory</h1>
          <p className="text-gray-500 text-xs">Manage consumer user profiles, saved Bengaluru addresses and booking histories</p>
        </div>
        <span className="bg-brand-bg text-brand-dark font-bold px-2.5 py-1 rounded-full border border-gray-200">
          {customerUsers.length} Customers Registered
        </span>
      </div>

      <div className="p-3 bg-white rounded-2xl border border-gray-200 shadow-soft flex items-center justify-between">
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search by name, email, phone..."
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
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Contact</th>
              <th className="py-3 px-4">Primary Area</th>
              <th className="py-3 px-4">Capabilities</th>
              <th className="py-3 px-4">Joined Date</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCustomers.map((cust) => {
              const custBookings = bookings.filter((b) => b.customerId === cust.id);
              return (
                <tr key={cust.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={cust.avatarUrl}
                        alt={cust.name}
                        className="w-9 h-9 rounded-xl object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-bold text-gray-900 text-xs">{cust.name}</p>
                        <p className="text-[10px] text-gray-400 font-mono">{cust.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <p>{cust.phone}</p>
                    <p className="text-[10px] text-gray-400">{cust.email}</p>
                  </td>
                  <td className="py-3.5 px-4 text-gray-700 font-medium">
                    {cust.addresses[0]?.area || 'Bengaluru'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-[10px] bg-brand-bg text-brand-dark px-2 py-0.5 rounded-full">
                      {cust.availableRoles.join(' + ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-gray-500">
                    {new Date(cust.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setSelectedCustomer(cust)}
                      className="py-1 px-2.5 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-lg"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-w-md w-full bg-white rounded-2xl p-5 shadow-lifted space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-3">
                <img src={selectedCustomer.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm">{selectedCustomer.name}</h3>
                  <p className="text-gray-500 text-[11px]">{selectedCustomer.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>

            <div className="space-y-2 text-xs text-gray-700">
              <h4 className="font-bold text-gray-900">Saved Addresses in Bengaluru</h4>
              {selectedCustomer.addresses.map((a) => (
                <div key={a.id} className="p-2.5 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="font-bold text-gray-900 block">{a.label} ({a.area})</span>
                  <p className="text-[11px] text-gray-600">{a.street}, {a.city} - {a.pincode}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setSelectedCustomer(null)}
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

