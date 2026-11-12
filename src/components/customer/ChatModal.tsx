import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
  Send,
  Paperclip,
  Phone,
  ShieldAlert,
  CheckCheck,
  User,
  Clock,
  FileText,
} from 'lucide-react';

interface ChatModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ booking, onClose }) => {
  const { currentUser, chatMessages, sendChatMessage, showToast } = useApp();
  const [inputText, setInputText] = useState('');
  const [showCallModal, setShowCallModal] = useState(false);

  if (!booking) return null;

  const relevantMessages = chatMessages.filter((m) => m.bookingId === booking.id);
  const otherPartyName =
    currentUser.id === booking.customerId
      ? booking.workerName || 'Assigned Worker'
      : booking.customerName;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(booking.id, inputText.trim());
    setInputText('');

    // Simulate automatic polite response after 1.5 seconds if sent by customer
    if (currentUser.id === booking.customerId && booking.workerName) {
      setTimeout(() => {
        sendChatMessage(
          booking.id,
          `Got it, ma'am! I have noted your message and am attending to it.`
        );
      }, 1500);
    }
  };

  const handleSimulateCall = () => {
    setShowCallModal(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
        <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl h-[85vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="flex items-center justify-between p-3.5 bg-brand-dark text-white rounded-t-3xl sm:rounded-t-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center font-bold text-brand-accent text-sm">
                {otherPartyName.slice(0, 1)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-white leading-tight">{otherPartyName}</h3>
                <p className="text-[10px] text-white/70">
                  Ref: {booking.referenceNumber} • {booking.serviceName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSimulateCall}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Simulate Voice Call"
              >
                <Phone className="w-4 h-4 text-emerald-300" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-bg text-xs">
            <div className="text-center">
              <span className="bg-white border border-gray-200 text-gray-500 text-[10px] px-2.5 py-1 rounded-full shadow-sm">
                In-app Chat for Booking {booking.referenceNumber}
              </span>
            </div>

            {relevantMessages.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p>No messages yet.</p>
                <p className="text-[11px] mt-1">Start the conversation with {otherPartyName}.</p>
              </div>
            ) : (
              relevantMessages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm ${
                        isMe
                          ? 'bg-brand-dark text-white rounded-br-xs'
                          : 'bg-white text-gray-900 border border-gray-200 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>
                      {msg.attachmentName && (
                        <div className="mt-1.5 p-1.5 bg-black/10 rounded flex items-center gap-1 text-[10px]">
                          <FileText className="w-3.5 h-3.5 text-brand-accent" />
                          <span className="truncate">{msg.attachmentName}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400 mt-0.5 px-1 flex items-center gap-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {isMe && <CheckCheck className="w-3 h-3 text-emerald-600 inline" />}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-3 border-t border-gray-100 bg-white flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                sendChatMessage(
                  booking.id,
                  'Attached: location_landmark.jpg (Simulated photo upload)',
                  'location_landmark.jpg'
                );
                showToast('Mock photo uploaded to chat.', 'info');
              }}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
              title="Attach Mock Image"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              placeholder={`Message ${otherPartyName}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 py-2 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-dark"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 bg-brand-dark hover:bg-brand-darker disabled:opacity-40 text-white rounded-xl shadow transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Simulated Phone Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/75 p-4">
          <div className="max-w-xs w-full bg-brand-charcoal text-white rounded-3xl p-6 text-center space-y-4 shadow-lifted">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto animate-pulse">
              <Phone className="w-8 h-8" />
            </div>

            <div>
              <h4 className="font-bold text-base">{otherPartyName}</h4>
              <p className="text-xs text-white/60 mt-0.5">Simulated Masked Proxy Call</p>
            </div>

            <div className="p-3 bg-white/10 rounded-xl text-[11px] text-white/80 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-brand-accent mx-auto mb-1" />
              <strong>Demo call simulation:</strong> Customer and provider phone numbers are masked for privacy. No actual telephony call is placed.
            </div>

            <button
              onClick={() => setShowCallModal(false)}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-xs"
            >
              End Call Simulation
            </button>
          </div>
        </div>
      )}
    </>
  );
};

