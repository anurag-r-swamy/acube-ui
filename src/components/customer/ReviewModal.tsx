import React, { useState } from 'react';
import { Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, Star, CheckCircle } from 'lucide-react';

interface ReviewModalProps {
  booking: Booking | null;
  onClose: () => void;
}

const REVIEW_TAGS = [
  'Punctual Arrival',
  'Expert Diagnostics',
  'Polite Behavior',
  'Clean Work',
  'Fair & Transparent',
  'Safety Gear Used',
];

export const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose }) => {
  const { currentUser, submitReview } = useApp();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual Arrival', 'Clean Work']);

  if (!booking || !booking.workerId) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReview({
      bookingId: booking.id,
      workerId: booking.workerId!,
      customerId: currentUser.id,
      customerName: currentUser.name,
      rating,
      comment: comment.trim() || 'Prompt, professional, and reliable service.',
      tags: selectedTags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-6 shadow-lifted animate-in slide-in-from-bottom-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Rate & Review Service</h3>
            <p className="text-[11px] text-gray-500">{booking.workerName} • {booking.serviceName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Star selector */}
          <div className="text-center py-2">
            <p className="text-gray-600 mb-2 font-medium">How was your experience?</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= rating ? 'fill-brand-accent text-brand-accent' : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-[11px] font-bold text-brand-dark mt-1 block">
              {rating === 5 && 'Outstanding 5-Star Service!'}
              {rating === 4 && 'Good Service, Satisfied'}
              {rating === 3 && 'Average Experience'}
              {rating <= 2 && 'Needs Improvement'}
            </span>
          </div>

          {/* Compliment Tags */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1.5">What went well?</label>
            <div className="flex flex-wrap gap-1.5">
              {REVIEW_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-brand-dark text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Written feedback */}
          <div>
            <label className="block font-semibold text-gray-700 mb-1">Detailed Feedback</label>
            <textarea
              rows={3}
              placeholder="Share details about the quality of work, cleanliness, and communication..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl shadow transition-all"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

