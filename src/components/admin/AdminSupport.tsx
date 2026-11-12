import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Headphones, Search, MessageSquare, CheckCircle2, User } from 'lucide-react';

export const AdminSupport: React.FC = () => {
  const { showToast } = useApp();

  const [tickets, setTickets] = useState([
    {
      id: 'TCK-201',
      customer: 'Priya Sharma',
      subject: 'Clarification regarding AC coolant gas charges',
      status: 'OPEN',
      priority: 'MEDIUM',
      created: '2 hours ago',
      assigned: 'Kavita Nair',
    },
    {
      id: 'TCK-198',
      customer: 'Sunil Rao',
      subject: 'Rescheduling electrical fan installation slot',
      status: 'RESOLVED',
      priority: 'LOW',
      created: 'Yesterday',
      assigned: 'Kavita Nair',
    },
    {
      id: 'TCK-194',
      customer: 'Deepak Joshi',
      subject: 'Refund timeline inquiry after cancelled job',
      status: 'RESOLVED',
      priority: 'HIGH',
      created: '3 days ago',
      assigned: 'Suresh Patel',
    },
  ]);

  return (
    <div className="space-y-5 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-gray-900">Customer Support Desk</h1>
          <p className="text-gray-500 text-xs">Manage general service inquiries, scheduling help, and ticket routing</p>
        </div>
        <span className="bg-brand-bg text-brand-dark font-bold px-2.5 py-1 rounded-full border border-gray-200">
          {tickets.filter((t) => t.status === 'OPEN').length} Open Inquiries
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider bg-gray-50/50">
              <th className="py-3 px-4">Ticket Ref</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Agent</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {tickets.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">{t.id}</td>
                <td className="py-3.5 px-4 font-bold text-gray-900">{t.customer}</td>
                <td className="py-3.5 px-4 text-gray-700">{t.subject}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      t.priority === 'HIGH'
                        ? 'bg-red-100 text-red-800'
                        : t.priority === 'MEDIUM'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                      t.status === 'OPEN' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-gray-600">{t.assigned}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => showToast(`Ticket ${t.id} reply simulation.`, 'info')}
                    className="py-1 px-2.5 bg-brand-bg hover:bg-brand-dark hover:text-white text-brand-dark font-semibold rounded-lg"
                  >
                    Reply
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

