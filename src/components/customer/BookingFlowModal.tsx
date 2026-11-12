import React, { useState } from 'react';
import { WorkerProfile, ServiceCategory, ServiceSubcategory, Booking } from '../../types';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedWorker?: WorkerProfile | null;
  preselectedCategory?: ServiceCategory | null;
  onBookingSuccess: (booking: Booking) => void;
}

type Step = 'DETAILS' | 'SCHEDULE_ADDRESS' | 'SUMMARY' | 'PAYMENT' | 'PROCESSING' | 'SUCCESS' | 'FAILED';

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  preselectedWorker,
  preselectedCategory,
  onBookingSuccess,
}) => {
  const {
    currentUser,
    categories,
    selectedLocation,
    createBooking,
    showToast,
  } = useApp();

  const [step, setStep] = useState<Step>('DETAILS');
  const [selectedCatId, setSelectedCatId] = useState<string>(
    preselectedCategory?.id || preselectedWorker?.primaryCategory || categories[0]?.id || ''
  );
  const [selectedSubId, setSelectedSubId] = useState<string>('');
  const [serviceDescription, setServiceDescription] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('2026-03-05');
  const [selectedSlot, setSelectedSlot] = useState<string>('10:00 AM - 12:00 PM');
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number>(0);
  const [customStreet, setCustomStreet] = useState<string>('');
  const [mockFileName, setMockFileName] = useState<string>('');

  // Payment simulation state
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI');
  const [simulateFailureToggle, setSimulateFailureToggle] = useState<boolean>(false);
  const [createdBookingResult, setCreatedBookingResult] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const currentCategory = categories.find((c) => c.id === selectedCatId) || categories[0];
  const subcategories = currentCategory?.subcategories || [];

  // Calculate pricing
  const baseFare = preselectedWorker ? preselectedWorker.baseFare : 399;
  const platformFee = 49;
  const taxes = Math.round(baseFare * 0.08);
  const totalAmount = baseFare + platformFee + taxes;

  const handleCreateAndPay = () => {
    setStep('PROCESSING');

    setTimeout(() => {
      if (simulateFailureToggle) {
        setStep('FAILED');
        showToast('Simulated payment failure (insufficient test funds / gateway timeout).', 'error');
      } else {
        const address = currentUser.addresses[selectedAddressIndex] || {
          id: 'addr-manual',
          label: 'Service Address',
          street: customStreet || 'Flat 302, Green Glen Layout, 4th Cross',
          area: selectedLocation,
          city: 'Bengaluru',
          pincode: '560034',
        };

        const booking = createBooking({
          workerId: preselectedWorker?.id,
          workerName: preselectedWorker?.fullName,
          workerPhone: preselectedWorker?.phone,
          workerAvatar: preselectedWorker?.avatarUrl,
          categoryId: currentCategory.id,
          categoryName: currentCategory.name,
          subcategoryId: selectedSubId,
          serviceName:
            subcategories.find((s) => s.id === selectedSubId)?.name ||
            `${currentCategory.name} General Service`,
          serviceArea: selectedLocation,
          address,
          scheduledDate: selectedDate,
          scheduledTimeSlot: selectedSlot,
          description: serviceDescription || 'General problem diagnosis and repair needed.',
          attachments: mockFileName ? [{ id: 'mock-att-1', name: mockFileName, type: 'image/jpeg' }] : [],
          estimatedBaseFare: baseFare,
          paymentMethod,
        });

        setCreatedBookingResult(booking);
        setStep('SUCCESS');
      }
    }, 1200);
  };

  const handleFileUploadMock = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMockFileName(e.target.files[0].name);
      showToast(`Attached mock file: ${e.target.files[0].name}`, 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-lifted animate-in slide-in-from-bottom-4">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] font-semibold tracking-wider uppercase text-brand-accent">
              {preselectedWorker ? `Booking with ${preselectedWorker.fullName}` : 'Direct Service Request'}
            </span>
            <h2 className="text-base font-bold text-brand-charcoal">
              {step === 'DETAILS' && '1. Service & Description'}
              {step === 'SCHEDULE_ADDRESS' && '2. Date, Time & Address'}
              {step === 'SUMMARY' && '3. Review & Price Breakdown'}
              {step === 'PAYMENT' && '4. Simulated Checkout'}
              {step === 'PROCESSING' && 'Simulating Gateway Hold...'}
              {step === 'SUCCESS' && 'Booking Confirmed!'}
              {step === 'FAILED' && 'Payment Simulation Failed'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {/* STEP 1: DETAILS */}
          {step === 'DETAILS' && (
            <div className="space-y-4">
              {preselectedWorker && (
                <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-gray-100">
                  <img
                    src={preselectedWorker.avatarUrl}
                    alt={preselectedWorker.fullName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{preselectedWorker.fullName}</h3>
                    <p className="text-[11px] text-gray-500">{preselectedWorker.primaryCategory}</p>
                    <span className="text-brand-dark font-semibold">
                      Base Fare: {APP_CONFIG.currencySymbol}{preselectedWorker.baseFare}
                    </span>
                  </div>
                </div>
              )}

              {/* Category Picker (if not locked to worker) */}
              {!preselectedWorker && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Select Service Category</label>
                  <select
                    value={selectedCatId}
                    onChange={(e) => {
                      setSelectedCatId(e.target.value);
                      setSelectedSubId('');
                    }}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-brand-dark"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Subcategory options */}
              {subcategories.length > 0 && (
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Common Problem / Service</label>
                  <div className="space-y-1.5">
                    {subcategories.map((sub) => (
                      <label
                        key={sub.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ${
                          selectedSubId === sub.id
                            ? 'bg-brand-accent-light border-brand-accent text-brand-dark font-medium'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="subcategory"
                          checked={selectedSubId === sub.id}
                          onChange={() => setSelectedSubId(sub.id)}
                          className="mt-0.5 text-brand-dark focus:ring-brand-dark"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-gray-900">{sub.name}</span>
                            <span className="text-brand-dark font-bold">
                              From {APP_CONFIG.currencySymbol}{sub.startingPrice}
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-500 mt-0.5">{sub.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Problem Description */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Describe what needs repair or servicing
                </label>
                <textarea
                  rows={3}
                  placeholder="e.g. Living room fan regulator is burnt, speed stuck on max; need inspection and new regulator replaced."
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-brand-dark"
                />
              </div>

              {/* Mock Photo Attachment */}
              <div className="p-3 border-2 border-dashed border-gray-200 rounded-xl text-center">
                <label className="cursor-pointer block">
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <span className="font-medium text-brand-dark">Attach photo or bill (optional)</span>
                  <p className="text-[10px] text-gray-400">Mock simulation only — file remains in local state</p>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileUploadMock}
                    accept="image/*,.pdf"
                  />
                </label>
                {mockFileName && (
                  <p className="mt-2 text-emerald-600 font-semibold text-[11px]">
                    ✓ Attached: {mockFileName}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SCHEDULE & ADDRESS */}
          {step === 'SCHEDULE_ADDRESS' && (
            <div className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Choose Service Date</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['2026-03-05', '2026-03-06', '2026-03-07'].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSelectedDate(d)}
                      className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                        selectedDate === d
                          ? 'bg-brand-dark text-white font-semibold border-brand-dark'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="block text-[10px] uppercase opacity-75">
                        {d === '2026-03-05' ? 'Tomorrow' : 'Later'}
                      </span>
                      <span className="font-bold">{d.slice(5)}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Time Slot</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '09:00 AM - 11:00 AM',
                    '11:00 AM - 01:00 PM',
                    '02:00 PM - 04:00 PM',
                    '04:00 PM - 06:00 PM',
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2 rounded-xl border text-left transition-all ${
                        selectedSlot === slot
                          ? 'bg-brand-dark text-white font-semibold border-brand-dark'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Address Selection */}
              <div>
                <label className="block font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-accent" />
                  <span>Service Address in Bengaluru</span>
                </label>
                <div className="space-y-2">
                  {currentUser.addresses.map((addr, idx) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer ${
                        selectedAddressIndex === idx
                          ? 'bg-brand-accent-light border-brand-accent text-brand-dark font-medium'
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address_choice"
                        checked={selectedAddressIndex === idx}
                        onChange={() => setSelectedAddressIndex(idx)}
                        className="mt-0.5 text-brand-dark"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">{addr.label}</span>
                          <span className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                            {addr.area}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600 mt-0.5">
                          {addr.street}, {addr.city} - {addr.pincode}
                        </p>
                      </div>
                    </label>
                  ))}

                  {/* Manual fallback input */}
                  <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="font-semibold text-gray-700 mb-1">Add specific landmark / flat notes</p>
                    <input
                      type="text"
                      placeholder="e.g. Near Sony World Signal, 3rd floor"
                      value={customStreet}
                      onChange={(e) => setCustomStreet(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: SUMMARY & PRICE BREAKDOWN */}
          {step === 'SUMMARY' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-brand-bg rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service:</span>
                  <span className="font-bold text-gray-900">
                    {subcategories.find((s) => s.id === selectedSubId)?.name || currentCategory.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Scheduled:</span>
                  <span className="font-medium text-gray-800">
                    {selectedDate} • {selectedSlot}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Assigned Provider:</span>
                  <span className="font-medium text-gray-800">
                    {preselectedWorker ? preselectedWorker.fullName : 'Will broadcast to nearby verified pros'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location:</span>
                  <span className="font-medium text-gray-800">
                    {currentUser.addresses[selectedAddressIndex]?.area || selectedLocation}
                  </span>
                </div>
              </div>

              {/* Transparent Price Breakdown */}
              <div className="p-3.5 bg-white rounded-xl border border-gray-200 space-y-2">
                <h4 className="font-bold text-gray-900 mb-1">Transparent Price Breakdown</h4>
                <div className="flex justify-between text-gray-600">
                  <span>Base Diagnostic & Labor Charge</span>
                  <span>{APP_CONFIG.currencySymbol}{baseFare}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    <span>Platform Safety & Guarantee Fee</span>
                    <Info className="w-3 h-3 text-gray-400" />
                  </span>
                  <span>{APP_CONFIG.currencySymbol}{platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Estimated GST (8% simulated)</span>
                  <span>{APP_CONFIG.currencySymbol}{taxes}</span>
                </div>
                <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-sm text-brand-dark">
                  <span>Total Payable Amount</span>
                  <span>{APP_CONFIG.currencySymbol}{totalAmount}</span>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                  *Spare parts (if needed) are invoiced separately upon inspection with customer approval.
                </p>
              </div>

              {/* Cancellation Terms */}
              <div className="p-3 bg-amber-50 border border-amber-200/80 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                <span className="font-semibold block mb-0.5">Cancellation & Protection Policy</span>
                Free cancellation up to 2 hours before the scheduled time. 100% money-back guarantee if the verified pro fails to arrive.
              </div>
            </div>
          )}

          {/* STEP 4: PAYMENT SIMULATION */}
          {step === 'PAYMENT' && (
            <div className="space-y-4">
              {/* Demo Payment Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Prototype Sandbox Checkout</span>
                </div>
                <p className="text-[11px]">
                  <strong>Demo payment — no money is charged.</strong> Do not enter real banking credentials. All payment methods below are simulated for prototype evaluation.
                </p>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    paymentMethod === 'UPI' ? 'border-brand-dark bg-brand-bg font-bold' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="text-brand-dark"
                    />
                    <div>
                      <p className="text-gray-900 text-xs">UPI (Google Pay / PhonePe / Paytm)</p>
                      <p className="text-[10px] text-gray-500 font-normal">Instant mock UPI authorization</p>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Popular in Bengaluru
                  </span>
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    paymentMethod === 'CARD' ? 'border-brand-dark bg-brand-bg font-bold' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="text-brand-dark"
                    />
                    <div>
                      <p className="text-gray-900 text-xs">Credit / Debit Card</p>
                      <p className="text-[10px] text-gray-500 font-normal">Simulated Visa / Mastercard gateway</p>
                    </div>
                  </div>
                  <CreditCard className="w-4 h-4 text-gray-400" />
                </label>

                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    paymentMethod === 'NET_BANKING' ? 'border-brand-dark bg-brand-bg font-bold' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="payMethod"
                      checked={paymentMethod === 'NET_BANKING'}
                      onChange={() => setPaymentMethod('NET_BANKING')}
                      className="text-brand-dark"
                    />
                    <div>
                      <p className="text-gray-900 text-xs">Net Banking (HDFC, SBI, ICICI)</p>
                      <p className="text-[10px] text-gray-500 font-normal">Simulated institutional portal</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Failure Simulation Tester Toggle */}
              <div className="p-2.5 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800 text-[11px]">Simulate Payment Failure Edge Case?</p>
                  <p className="text-[10px] text-gray-500">Test gateway timeout and retry UI handling</p>
                </div>
                <input
                  type="checkbox"
                  checked={simulateFailureToggle}
                  onChange={(e) => setSimulateFailureToggle(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </div>
            </div>
          )}

          {/* STEP: PROCESSING */}
          {step === 'PROCESSING' && (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 border-4 border-brand-accent border-t-brand-dark rounded-full animate-spin mx-auto"></div>
              <p className="font-bold text-gray-900 text-sm">Processing Simulated Hold...</p>
              <p className="text-gray-500 text-xs max-w-xs mx-auto">
                Communicating with mock payment processor for {APP_CONFIG.currencySymbol}{totalAmount}
              </p>
            </div>
          )}

          {/* STEP: SUCCESS */}
          {step === 'SUCCESS' && createdBookingResult && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Booking Confirmed!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Reference: <span className="font-mono font-bold text-brand-dark">{createdBookingResult.referenceNumber}</span>
                </p>
              </div>

              <div className="p-3 bg-brand-bg rounded-xl border border-gray-100 text-left text-xs space-y-1">
                <p>
                  <strong>Service:</strong> {createdBookingResult.serviceName}
                </p>
                <p>
                  <strong>Date & Slot:</strong> {createdBookingResult.scheduledDate} ({createdBookingResult.scheduledTimeSlot})
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className="font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {createdBookingResult.status}
                  </span>
                </p>
              </div>

              <p className="text-[11px] text-gray-400">
                You can view live status and chat with the provider in "My Bookings".
              </p>
            </div>
          )}

          {/* STEP: FAILED */}
          {step === 'FAILED' && (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Payment Simulation Declined</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Simulated card decline or gateway timeout. No charges occurred.
                </p>
              </div>
              <button
                onClick={() => {
                  setSimulateFailureToggle(false);
                  setStep('PAYMENT');
                }}
                className="py-2.5 px-4 bg-brand-dark text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 mx-auto shadow"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Payment Simulation</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        {step !== 'PROCESSING' && step !== 'SUCCESS' && (
          <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between gap-3">
            {step !== 'DETAILS' && (
              <button
                type="button"
                onClick={() => {
                  if (step === 'SCHEDULE_ADDRESS') setStep('DETAILS');
                  if (step === 'SUMMARY') setStep('SCHEDULE_ADDRESS');
                  if (step === 'PAYMENT') setStep('SUMMARY');
                  if (step === 'FAILED') setStep('PAYMENT');
                }}
                className="py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-50"
              >
                Back
              </button>
            )}

            {step === 'DETAILS' && (
              <button
                type="button"
                onClick={() => setStep('SCHEDULE_ADDRESS')}
                className="flex-1 py-3 px-5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl text-xs shadow transition-all"
              >
                Continue to Schedule & Address →
              </button>
            )}

            {step === 'SCHEDULE_ADDRESS' && (
              <button
                type="button"
                onClick={() => setStep('SUMMARY')}
                className="flex-1 py-3 px-5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl text-xs shadow transition-all"
              >
                Review Booking Details →
              </button>
            )}

            {step === 'SUMMARY' && (
              <button
                type="button"
                onClick={() => setStep('PAYMENT')}
                className="flex-1 py-3 px-5 bg-brand-dark hover:bg-brand-darker text-white font-semibold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Demo Payment</span>
                <span className="bg-brand-accent text-white px-2 py-0.5 rounded text-[11px] font-bold">
                  {APP_CONFIG.currencySymbol}{totalAmount}
                </span>
              </button>
            )}

            {step === 'PAYMENT' && (
              <button
                type="button"
                onClick={handleCreateAndPay}
                className="flex-1 py-3 px-5 bg-brand-accent hover:bg-brand-accent-hover text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Authorize Demo Payment ({APP_CONFIG.currencySymbol}{totalAmount})</span>
              </button>
            )}
          </div>
        )}

        {step === 'SUCCESS' && createdBookingResult && (
          <div className="p-4 border-t border-gray-100 bg-white">
            <button
              onClick={() => {
                onClose();
                onBookingSuccess(createdBookingResult);
              }}
              className="w-full py-3 px-4 bg-brand-dark text-white font-bold rounded-xl text-xs shadow"
            >
              Go to My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

