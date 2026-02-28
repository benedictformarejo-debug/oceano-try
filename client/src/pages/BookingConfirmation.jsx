import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, Users,
  ChevronRight, Check, Calendar, Moon,
  CreditCard, Wallet, AlertCircle, Percent, BadgeCheck
} from 'lucide-react';
// TODO: replace with real import once paymentsAPI is added to api.js
// import { paymentsAPI } from '../services/api';

// Temporary mock — remove this when PayMongo backend is ready
const paymentsAPI = {
  createCheckout: async (data) => {
    console.log('Checkout payload (mock):', data);
    // Simulate redirect delay — replace with real API call later
    return { checkoutUrl: null };
  },
};

// ── Sub-components outside main to prevent remounting ────────────────────────

const StepBar = ({ currentStepIdx }) => {
  const steps = ['Your Info', 'Payment Type', 'Confirm'];
  return (
    <div className="flex items-center gap-2 mb-8">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`flex items-center gap-2 ${i <= currentStepIdx ? 'text-ocean-600' : 'text-gray-400'}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
              i < currentStepIdx   ? 'bg-ocean-600 border-ocean-600 text-white' :
              i === currentStepIdx ? 'border-ocean-600 text-ocean-600' :
                                     'border-gray-300 text-gray-400'
            }`}>
              {i < currentStepIdx ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 w-8 rounded ${i < currentStepIdx ? 'bg-ocean-600' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
};

const SummaryCard = ({ booking, nights, total }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden sticky top-28">
    <div className="relative h-44">
      <img src={booking.roomImage} alt={booking.roomName} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 text-white">
        <p className="font-display font-bold text-lg">{booking.roomName}</p>
        <p className="text-sm text-white/80">Oceano Con Vista Resort</p>
      </div>
    </div>
    <div className="p-5 space-y-4">
      {[
        { icon: Calendar, label: 'Dates',    value: `${booking.checkIn} → ${booking.checkOut}` },
        { icon: Users,    label: 'Guests',   value: `${booking.guests} ${booking.guests === 1 ? 'Guest' : 'Guests'}` },
        { icon: Moon,     label: 'Duration', value: `${nights} ${nights === 1 ? 'Night' : 'Nights'}` },
      ].map(({ icon: Icon, label, value }) => (
        <div key={label} className="flex items-center gap-3 text-sm">
          <Icon className="w-4 h-4 text-ocean-600 shrink-0" />
          <div>
            <p className="text-gray-500 text-xs">{label}</p>
            <p className="font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
      <div className="border-t border-gray-100 pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">
            ₱{(booking.pricePerNight || total / nights).toLocaleString()} × {nights} nights
          </span>
          <span className="text-gray-700">₱{total.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100">
          <span>Total (PHP)</span>
          <span className="text-ocean-600">₱{total.toLocaleString()}</span>
        </div>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
        ⚠️ Booking is subject to resort confirmation after payment.
      </div>
    </div>
  </div>
);

// ── Constants ─────────────────────────────────────────────────────────────────

const STEPS = { INFO: 'info', PAYMENT_TYPE: 'payment_type', CONFIRM: 'confirm' };

const DOWNPAYMENT_PERCENT = 50; // 50% downpayment

const MOCK = {
  roomId: 'uuid-here', roomName: 'Oceanus Room', roomImage: '/images/oceanus.jpeg',
  checkIn: '2026-03-10', checkOut: '2026-03-13',
  guests: 2, nights: 3, pricePerNight: 3000, total: 9000,
};

const inputClass = (hasError) =>
  `w-full pl-10 pr-4 py-3 border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent ${
    hasError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'
  }`;

// ── Main Component ────────────────────────────────────────────────────────────

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const booking  = location.state?.booking || MOCK;
  const nights   = booking.nights || Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000);
  const total    = booking.total  || booking.pricePerNight * nights;

  const downpaymentAmount = Math.round(total * (DOWNPAYMENT_PERCENT / 100));
  const remainingAmount   = total - downpaymentAmount;

  const [step, setStep]             = useState(STEPS.INFO);
  const [form, setForm]             = useState({ fullName: '', email: '', phone: '', specialRequest: '' });
  const [errors, setErrors]         = useState({});
  const [paymentType, setPaymentType] = useState(null); // 'full' | 'downpayment'
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const amountToPay = paymentType === 'full' ? total : downpaymentAmount;

  const currentStepIdx =
    step === STEPS.INFO         ? 0 :
    step === STEPS.PAYMENT_TYPE ? 1 : 2;

  // ── Handlers ────────────────────────────────────────────────────────────────
  const setField = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const validateInfo = () => {
    const e = {};
    if (!form.fullName.trim())                    e.fullName = 'Full name is required';
    if (!form.email.trim())                       e.email    = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))   e.email    = 'Enter a valid email';
    if (!form.phone.trim())                       e.phone    = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleInfoNext = () => { if (validateInfo()) setStep(STEPS.PAYMENT_TYPE); };

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    setStep(STEPS.CONFIRM);
  };

  // ── Redirect to PayMongo hosted checkout ─────────────────────────────────
  // PayMongo handles all payment UI (GCash, Maya, card, etc.) on their page
  const handleProceedToPayment = async () => {
    setSubmitting(true);
    setSubmitError('');
    try {
      const data = await paymentsAPI.createCheckout({
        // Booking details
        roomId:      booking.roomId,
        roomName:    booking.roomName,
        checkIn:     booking.checkIn,
        checkOut:    booking.checkOut,
        guests:      booking.guests,
        totalPrice:  total,
        // Guest info
        fullName:    form.fullName,
        email:       form.email,
        phone:       form.phone,
        specialRequest: form.specialRequest,
        // Payment
        paymentType,              // 'full' or 'downpayment'
        amountToPay,              // actual amount to charge now
        remainingAmount: paymentType === 'full' ? 0 : remainingAmount,
      });

      // ── Redirect to PayMongo's hosted checkout page ──────────────────────
      // PayMongo shows GCash, Maya, card options on their page
      // On success they redirect back to your success URL (set in backend)
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        // Dev mode — PayMongo not connected yet, go to bookings
        navigate('/dashboard/bookings');
      }

    } catch (err) {
      setSubmitError(err.message || 'Failed to initiate payment. Please try again.');
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-4 py-8">
          <button
            onClick={() => step === STEPS.INFO ? navigate(-1) : setStep(prev =>
              prev === STEPS.CONFIRM ? STEPS.PAYMENT_TYPE :
              prev === STEPS.PAYMENT_TYPE ? STEPS.INFO : STEPS.INFO
            )}
            className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Request to Book</h1>
            <p className="text-sm text-gray-500">Complete your reservation</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left — Steps */}
          <div className="lg:col-span-3">
            <StepBar currentStepIdx={currentStepIdx} />

            <AnimatePresence mode="wait">

              {/* ── STEP 1: Guest Info ──────────────────────────────────── */}
              {step === STEPS.INFO && (
                <motion.div key="info"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-900">1. Your Information</h2>
                    <p className="text-sm text-gray-500 mt-1">We'll use this to confirm your reservation.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" placeholder="e.g. Juan dela Cruz"
                        value={form.fullName} onChange={setField('fullName')}
                        className={inputClass(errors.fullName)} />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" placeholder="you@email.com"
                        value={form.email} onChange={setField('email')}
                        className={inputClass(errors.email)} />
                    </div>
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="tel" placeholder="+63 9XX XXX XXXX"
                        value={form.phone} onChange={setField('phone')}
                        className={inputClass(errors.phone)} />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Special Requests <span className="font-normal text-gray-400">(optional)</span>
                    </label>
                    <textarea rows={3}
                      placeholder="Any special requests or notes for the resort..."
                      value={form.specialRequest} onChange={setField('specialRequest')}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:border-transparent hover:border-gray-300" />
                  </div>

                  <button onClick={handleInfoNext}
                    className="w-full bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* ── STEP 2: Payment Type ────────────────────────────────── */}
              {step === STEPS.PAYMENT_TYPE && (
                <motion.div key="payment_type"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-display font-bold text-gray-900">2. Payment Type</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose how much you'd like to pay now.</p>
                  </div>

                  {/* Full Payment */}
                  <button onClick={() => handlePaymentTypeSelect('full')}
                    className="w-full flex items-start gap-4 p-5 border-2 border-gray-200 hover:border-ocean-400 hover:bg-ocean-50 rounded-2xl transition-all group text-left">
                    <div className="w-12 h-12 bg-ocean-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-gray-900">Full Payment</p>
                        <span className="px-2 py-0.5 bg-ocean-100 text-ocean-700 text-xs font-semibold rounded-full">Recommended</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-2">Pay the total amount now and your booking is fully confirmed.</p>
                      <p className="text-2xl font-display font-bold text-ocean-600">₱{total.toLocaleString()}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-ocean-600 transition-colors shrink-0 mt-1" />
                  </button>

                  {/* Downpayment */}
                  <button onClick={() => handlePaymentTypeSelect('downpayment')}
                    className="w-full flex items-start gap-4 p-5 border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-2xl transition-all group text-left">
                    <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{DOWNPAYMENT_PERCENT}% Downpayment</p>
                      <p className="text-sm text-gray-500 mb-3">Pay {DOWNPAYMENT_PERCENT}% now to reserve your room. Pay the rest upon arrival.</p>
                      <div className="flex items-center gap-4 flex-wrap">
                        <div>
                          <p className="text-xs text-gray-400">Pay now</p>
                          <p className="text-xl font-display font-bold text-emerald-600">₱{downpaymentAmount.toLocaleString()}</p>
                        </div>
                        <div className="text-gray-300 text-lg">+</div>
                        <div>
                          <p className="text-xs text-gray-400">On arrival</p>
                          <p className="text-xl font-display font-bold text-gray-600">₱{remainingAmount.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors shrink-0 mt-1" />
                  </button>

                  {/* PayMongo methods notice */}
                  <div className="flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-xl p-3">
                    <Wallet className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-1">Accepted payment methods</p>
                      <p className="text-xs text-gray-500">GCash · Maya · Credit/Debit Card · GrabPay — powered by PayMongo. You'll choose on the next page.</p>
                    </div>
                  </div>

                  <button onClick={() => setStep(STEPS.INFO)}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                    ← Back to your information
                  </button>
                </motion.div>
              )}

              {/* ── STEP 3: Review & Confirm ────────────────────────────── */}
              {step === STEPS.CONFIRM && (
                <motion.div key="confirm"
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                    <h2 className="text-lg font-display font-bold text-gray-900 mb-1">3. Review & Confirm</h2>
                    <p className="text-sm text-gray-500 mb-5">Double-check everything before proceeding to payment.</p>

                    {/* Guest details */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-2.5 text-sm">
                      <p className="font-bold text-gray-900 text-sm">Guest Details</p>
                      {[
                        ['Name',  form.fullName],
                        ['Email', form.email],
                        ['Phone', form.phone],
                        ...(form.specialRequest ? [['Note', form.specialRequest]] : []),
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-gray-500">{l}</span>
                          <span className="font-medium text-gray-900 text-right max-w-[60%]">{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Booking details */}
                    <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-2.5 text-sm">
                      <p className="font-bold text-gray-900 text-sm">Booking Details</p>
                      {[
                        ['Room',      booking.roomName],
                        ['Check-In',  booking.checkIn],
                        ['Check-Out', booking.checkOut],
                        ['Guests',    `${booking.guests} ${booking.guests === 1 ? 'Guest' : 'Guests'}`],
                        ['Duration',  `${nights} ${nights === 1 ? 'Night' : 'Nights'}`],
                      ].map(([l, v]) => (
                        <div key={l} className="flex justify-between">
                          <span className="text-gray-500">{l}</span>
                          <span className="font-medium text-gray-900">{v}</span>
                        </div>
                      ))}
                    </div>

                    {/* Payment summary */}
                    <div className={`rounded-2xl p-4 mb-5 border ${
                      paymentType === 'full'
                        ? 'bg-ocean-50 border-ocean-200'
                        : 'bg-emerald-50 border-emerald-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-3">
                        {paymentType === 'full'
                          ? <CreditCard className="w-4 h-4 text-ocean-600" />
                          : <Percent className="w-4 h-4 text-emerald-600" />}
                        <p className={`text-sm font-bold ${paymentType === 'full' ? 'text-ocean-700' : 'text-emerald-700'}`}>
                          {paymentType === 'full' ? 'Full Payment' : `${DOWNPAYMENT_PERCENT}% Downpayment`}
                        </p>
                      </div>

                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total booking cost</span>
                          <span className="font-medium text-gray-900">₱{total.toLocaleString()}</span>
                        </div>
                        {paymentType === 'downpayment' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Remaining on arrival</span>
                            <span className="font-medium text-gray-900">₱{remainingAmount.toLocaleString()}</span>
                          </div>
                        )}
                        <div className={`flex justify-between pt-2 border-t font-bold text-base ${
                          paymentType === 'full' ? 'border-ocean-200' : 'border-emerald-200'
                        }`}>
                          <span>Pay now</span>
                          <span className={paymentType === 'full' ? 'text-ocean-600' : 'text-emerald-600'}>
                            ₱{amountToPay.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* PayMongo notice */}
                    <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5">
                      <BadgeCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <div className="text-xs text-blue-700">
                        <p className="font-semibold mb-0.5">Secure Payment via PayMongo</p>
                        <p>You'll be redirected to PayMongo's secure checkout where you can pay using GCash, Maya, credit/debit card, or GrabPay.</p>
                      </div>
                    </div>

                    {submitError && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-4 text-sm">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        {submitError}
                      </div>
                    )}

                    <button onClick={handleProceedToPayment} disabled={submitting}
                      className={`w-full text-white font-semibold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg ${
                        paymentType === 'full'
                          ? 'bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300'
                      } disabled:cursor-not-allowed disabled:shadow-none`}>
                      {submitting ? (
                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Redirecting to PayMongo...</>
                      ) : (
                        <>Proceed to Payment — ₱{amountToPay.toLocaleString()} <ChevronRight className="w-4 h-4" /></>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-3">
                      🔒 Your payment is secured and encrypted by PayMongo
                    </p>
                  </div>

                  <button onClick={() => setStep(STEPS.PAYMENT_TYPE)}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors">
                    ← Change payment type
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Right — Summary Card */}
          <div className="lg:col-span-2">
            <SummaryCard booking={booking} nights={nights} total={total} />
          </div>

        </div>
      </div>
    </div>
  );
}