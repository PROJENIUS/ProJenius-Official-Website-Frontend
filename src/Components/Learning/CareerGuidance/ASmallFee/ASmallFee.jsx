import { useEffect, useMemo, useRef, useState } from "react";
import {
  Users,
  CheckCircle2,
  CalendarDays,
  Clock,
  Clock3,
  ArrowRight,
  ArrowLeft,
  Check,
  Smartphone,
  Calendar,
  Sparkles,
  Mail,
  Phone,
  User,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { normalizeApiBase, resolveApiUrl } from "../../../../utils/apiUrl.js";
import { loadRazorpayCheckout } from "../../Courses/ExploreOurCourses/razorpayCheckout.js";
import "./ASmallFee.css";
import TypedPhrase from "../../../Common/TypedPhrase/TypedPhrase.jsx";

import SectionTitleLine from "../../../Common/SectionTitleLine/SectionTitleLine.jsx";

/* Booking = payment. The student picks a slot, pays the fee set by the admin
   (Razorpay), and the slot is locked for them. The confirmation email carries
   the Google Meet link and the receipt; the admin gets the booking + receipt. */
const API_BASE = normalizeApiBase(import.meta.env.VITE_API_BASE_URL?.trim(), import.meta.env.DEV);

const guidanceUrl = (path) => resolveApiUrl(`/api/guidance${path}`, API_BASE, window.location.origin);
const rupees = (minor) => `₹${Math.round((minor || 0) / 100).toLocaleString("en-IN")}`;
/* Same key the server uses to lock a slot (minute precision, UTC). */
const slotKey = (date, hour, minute) => { const d = new Date(date); d.setHours(hour, minute, 0, 0); return d.toISOString().slice(0, 16); };
async function postJson(path, body, headers = {}) {
  const response = await fetch(guidanceUrl(path), { method: "POST", headers: { "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw Object.assign(new Error(data.error || "Something went wrong. Please try again."), { status: response.status });
  return data;
}
function failureReason(error) {
  const t = error?.description || (error?.reason ? String(error.reason).replace(/_/g, " ") : "");
  return t ? `${t.charAt(0).toUpperCase()}${t.slice(1)}${/[.!]$/.test(t) ? "" : "."}` : "The bank or payment app declined the payment.";
}

/* =========================================================
   SESSION 1: TIME SLOTS & STATIC DATA
========================================================= */

const FIXED_TIME_SLOTS = [
  { label: "10:00 AM", hour: 10, minute: 0 },
  { label: "2:30 PM", hour: 14, minute: 30 },
  { label: "4:00 PM", hour: 16, minute: 0 },
  { label: "6:00 PM", hour: 18, minute: 0 },
];

const AM_HOURS = [9, 10, 11];
const PM_HOURS = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const ALL_MINUTES = [0, 15, 30, 45];
const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TARGET_ROLES = [
  "Full Stack Development",
  "Frontend / React Developer",
  "Backend & APIs (Node/Java/Python)",
  "AI & Data Science",
  "Cloud & DevOps Engineering",
  "College Student / Placement Prep",
  "Career Transition / Other",
];

/* =========================================================
   SESSION 2: DATE & TIME HELPERS
========================================================= */

const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isSameDay = (date1, date2) => {
  return formatDateKey(date1) === formatDateKey(date2);
};

const isSlotExpired = (slotDate, slotHour, slotMinute) => {
  const now = new Date();
  if (slotDate < startOfDay(now)) return true;
  if (slotDate > startOfDay(now)) return false;

  const slotEndTime = new Date(slotDate);
  slotEndTime.setHours(slotHour, slotMinute + 30, 0, 0);
  return now >= slotEndTime;
};

const getFirstAvailableSlot = (date) => {
  return (
    FIXED_TIME_SLOTS.find(
      (slot) => !isSlotExpired(date, slot.hour, slot.minute)
    ) || null
  );
};

const getCustom24Hour = (h, period) => {
  if (period === "AM") {
    return h === 12 ? 0 : h;
  }
  return h === 12 ? 12 : h + 12;
};

/* =========================================================
   SESSION 3: COMPONENT LOGIC & STATE
========================================================= */

const ASmallFee = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [slotMode, setSlotMode] = useState("fixed");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoMoveMessage, setAutoMoveMessage] = useState("");

  const availableDates = useMemo(() => {
    const list = [];
    const base = new Date();
    for (let i = 0; i < 5; i++) {
      const nextDate = new Date(base);
      nextDate.setDate(base.getDate() + i);
      list.push(startOfDay(nextDate));
    }
    return list;
  }, []);

  const [selectedDate, setSelectedDate] = useState(() => availableDates[0]);

  const [selectedTime, setSelectedTime] = useState(() => {
    const firstAvail = getFirstAvailableSlot(availableDates[0]);
    return firstAvail ? firstAvail.label : FIXED_TIME_SLOTS[0].label;
  });

  const [selectedSlotDetails, setSelectedSlotDetails] = useState(() => {
    const firstAvail = getFirstAvailableSlot(availableDates[0]);
    const init = firstAvail || FIXED_TIME_SLOTS[0];
    return { hour: init.hour, minute: init.minute, isCustom: false };
  });

  const [customHour, setCustomHour] = useState(5);
  const [customMinute, setCustomMinute] = useState(30);
  const [customAmPm, setCustomAmPm] = useState("PM");
  const [customTimeNotice, setCustomTimeNotice] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    targetRole: TARGET_ROLES[0],
    notes: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [config, setConfig] = useState({ feeMinor: 9900, takenSlots: [], bookingOpen: true, loaded: false });
  const [paid, setPaid] = useState(null);
  const [failure, setFailure] = useState(null);
  const idemRef = useRef(null);
  const fee = rupees(config.feeMinor);
  const isTaken = (date, hour, minute) => config.takenSlots.includes(slotKey(date, hour, minute));

  // Fee, open/closed and already-booked slots come from the server.
  const loadConfig = () => {
    if (!API_BASE) return;
    fetch(guidanceUrl("/config"), { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.item) setConfig({ ...data.item, loaded: true }); })
      .catch(() => {});
  };
  useEffect(loadConfig, []);

  /* Dynamic Time Filtering for Convenient Slots */
  const isAmAvailable = useMemo(() => {
    const now = currentTime;
    if (!isSameDay(selectedDate, now)) return true;
    return AM_HOURS.some((h) =>
      ALL_MINUTES.some(
        (m) => !isSlotExpired(selectedDate, getCustom24Hour(h, "AM"), m)
      )
    );
  }, [selectedDate, currentTime]);

  const isPmAvailable = useMemo(() => {
    const now = currentTime;
    if (!isSameDay(selectedDate, now)) return true;
    return PM_HOURS.some((h) =>
      ALL_MINUTES.some(
        (m) => !isSlotExpired(selectedDate, getCustom24Hour(h, "PM"), m)
      )
    );
  }, [selectedDate, currentTime]);

  useEffect(() => {
    if (!isAmAvailable && customAmPm === "AM") {
      setCustomAmPm("PM");
    }
  }, [isAmAvailable, customAmPm]);

  const availableHours = useMemo(() => {
    const candidateHours = customAmPm === "AM" ? AM_HOURS : PM_HOURS;
    const now = currentTime;
    if (!isSameDay(selectedDate, now)) return candidateHours;
    return candidateHours.filter((h) => {
      const h24 = getCustom24Hour(h, customAmPm);
      return ALL_MINUTES.some((m) => !isSlotExpired(selectedDate, h24, m));
    });
  }, [selectedDate, customAmPm, currentTime]);

  useEffect(() => {
    if (availableHours.length > 0 && !availableHours.includes(customHour)) {
      setCustomHour(availableHours[0]);
    }
  }, [availableHours, customHour]);

  const availableMinutes = useMemo(() => {
    const now = currentTime;
    if (!isSameDay(selectedDate, now)) return ALL_MINUTES;
    const h24 = getCustom24Hour(customHour, customAmPm);
    const filtered = ALL_MINUTES.filter(
      (m) => !isSlotExpired(selectedDate, h24, m)
    );
    return filtered.length > 0 ? filtered : [0];
  }, [selectedDate, customHour, customAmPm, currentTime]);

  useEffect(() => {
    if (
      availableMinutes.length > 0 &&
      !availableMinutes.includes(customMinute)
    ) {
      setCustomMinute(availableMinutes[0]);
    }
  }, [availableMinutes, customMinute]);

  const allUpcomingConvenientSlots = useMemo(() => {
    const slots = [];
    const periods = [];
    if (isAmAvailable) periods.push("AM");
    if (isPmAvailable) periods.push("PM");

    for (const ap of periods) {
      const hours = ap === "AM" ? AM_HOURS : PM_HOURS;
      for (const h of hours) {
        const h24 = getCustom24Hour(h, ap);
        for (const m of ALL_MINUTES) {
          if (!isSlotExpired(selectedDate, h24, m)) {
            const hStr = h < 10 ? `0${h}` : `${h}`;
            const mStr = m < 10 ? `0${m}` : `${m}`;
            slots.push({
              h,
              m,
              ap,
              h24,
              label: `${hStr}:${mStr} ${ap}`,
            });
          }
        }
      }
    }
    return slots;
  }, [selectedDate, isAmAvailable, isPmAvailable]);

  const upcomingQuickChips = useMemo(() => {
    const onHalfHours = allUpcomingConvenientSlots.filter(
      (s) => s.m === 0 || s.m === 30
    );
    return onHalfHours.length > 0
      ? onHalfHours.slice(0, 6)
      : allUpcomingConvenientSlots.slice(0, 6);
  }, [allUpcomingConvenientSlots]);

  /* Real-Time Auto Advance Slot Check */
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (currentStep === 1 && slotMode === "fixed" && selectedSlotDetails) {
        if (
          isSlotExpired(
            selectedDate,
            selectedSlotDetails.hour,
            selectedSlotDetails.minute
          )
        ) {
          const nextSlot = getFirstAvailableSlot(selectedDate);
          if (nextSlot) {
            setSelectedTime(nextSlot.label);
            setSelectedSlotDetails({
              hour: nextSlot.hour,
              minute: nextSlot.minute,
              isCustom: false,
            });
            setAutoMoveMessage(
              `Slot passed. Moved to next available: ${nextSlot.label}.`
            );
            setTimeout(() => setAutoMoveMessage(""), 6000);
          } else {
            const tomorrow = availableDates[1];
            if (tomorrow) {
              setSelectedDate(tomorrow);
              const firstSlotTomorrow = FIXED_TIME_SLOTS[0];
              setSelectedTime(firstSlotTomorrow.label);
              setSelectedSlotDetails({
                hour: firstSlotTomorrow.hour,
                minute: firstSlotTomorrow.minute,
                isCustom: false,
              });
              setAutoMoveMessage(
                "All slots for today have ended. Moved to tomorrow 10:00 AM."
              );
              setTimeout(() => setAutoMoveMessage(""), 7000);
            }
          }
        }
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [selectedDate, selectedSlotDetails, slotMode, availableDates, currentStep]);

  /* Handlers */
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setAutoMoveMessage("");

    if (slotMode === "fixed") {
      const currentSlotDef = FIXED_TIME_SLOTS.find(
        (s) => s.label === selectedTime
      );
      if (
        currentSlotDef &&
        !isSlotExpired(date, currentSlotDef.hour, currentSlotDef.minute)
      ) {
        setSelectedSlotDetails({
          hour: currentSlotDef.hour,
          minute: currentSlotDef.minute,
          isCustom: false,
        });
      } else {
        const nextSlot = getFirstAvailableSlot(date);
        if (nextSlot) {
          setSelectedTime(nextSlot.label);
          setSelectedSlotDetails({
            hour: nextSlot.hour,
            minute: nextSlot.minute,
            isCustom: false,
          });
        } else {
          setSelectedTime(null);
        }
      }
    }
  };

  const handleTimeChange = (slot) => {
    if (isSlotExpired(selectedDate, slot.hour, slot.minute)) return;
    setSelectedTime(slot.label);
    setSelectedSlotDetails({
      hour: slot.hour,
      minute: slot.minute,
      isCustom: false,
    });
    setAutoMoveMessage("");
  };

  const formattedCustomTime = useMemo(() => {
    const hStr = customHour < 10 ? `0${customHour}` : `${customHour}`;
    const mStr = customMinute < 10 ? `0${customMinute}` : `${customMinute}`;
    return `${hStr}:${mStr} ${customAmPm}`;
  }, [customHour, customMinute, customAmPm]);

  const validateCustom = (h, m, ap) => {
    const h24Val = getCustom24Hour(h, ap);
    if (isSlotExpired(selectedDate, h24Val, m)) {
      setCustomTimeNotice(
        "This time has already passed for today. Please pick an upcoming time."
      );
      return false;
    }
    setCustomTimeNotice("");
    return true;
  };

  const selectQuickConvenientSlot = (quick) => {
    setCustomHour(quick.h);
    setCustomMinute(quick.m);
    setCustomAmPm(quick.ap);
    const valid = validateCustom(quick.h, quick.m, quick.ap);
    if (valid) {
      setSelectedTime(quick.label);
      setSelectedSlotDetails({
        hour: getCustom24Hour(quick.h, quick.ap),
        minute: quick.m,
        isCustom: true,
      });
    }
  };

  const applyCustomConvenientTime = () => {
    const valid = validateCustom(customHour, customMinute, customAmPm);
    if (!valid) return;

    setSelectedTime(formattedCustomTime);
    setSelectedSlotDetails({
      hour: getCustom24Hour(customHour, customAmPm),
      minute: customMinute,
      isCustom: true,
    });
  };

  const handleProceedToDetails = () => {
    if (!selectedTime || !termsAccepted) return;
    setCurrentStep(2);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Please enter a valid email address";
    }
    const cleanedPhone = formData.phone.replace(/[\s().-]/g, "");
    if (!formData.phone.trim()) {
      errors.phone = "Phone/WhatsApp number is required";
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(cleanedPhone) && !/^\+\d{7,15}$/.test(cleanedPhone)) {
      // Same rule the enquiry API applies (Indian mobile or +international).
      errors.phone = "Please enter a valid mobile number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formattedSelectedDate = useMemo(() => {
    return selectedDate.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDate]);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    if (isSubmitting || !validateForm()) return;
    setFailure(null);
    setSubmitError("");

    if (!API_BASE) {
      setSubmitError("Online booking is temporarily unavailable. Please contact us on WhatsApp or by phone to book your call.");
      return;
    }
    if (!config.bookingOpen) {
      setSubmitError("Booking is closed right now. Please contact us on WhatsApp or by phone.");
      return;
    }

    const slotStart = new Date(selectedDate);
    slotStart.setHours(selectedSlotDetails.hour, selectedSlotDetails.minute, 0, 0);
    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      targetRole: formData.targetRole,
      notes: formData.notes.trim(),
      slotStart: slotStart.toISOString(),
      slotLabel: `${formattedSelectedDate} at ${selectedTime}`,
      slotType: selectedSlotDetails?.isCustom ? "custom" : "fixed",
      termsAccepted: true,
    };
    const fingerprint = JSON.stringify(payload);
    if (idemRef.current?.fingerprint !== fingerprint) idemRef.current = { fingerprint, key: crypto.randomUUID() };

    setIsSubmitting(true);
    try {
      const Razorpay = await loadRazorpayCheckout();
      const order = await postJson("/orders", payload, { "Idempotency-Key": idemRef.current.key });
      setBookingId(order.booking.reference);
      const checkout = new Razorpay({
        key: order.keyId, order_id: order.order.id, amount: order.order.amount, currency: order.order.currency,
        name: "ProJenius", description: "1:1 Career Guidance Call", prefill: order.checkout?.prefill,
        handler: async (result) => {
          try {
            const verified = await postJson("/payments/verify", result);
            if (verified.status === "confirmed") {
              setPaid({ ...verified.booking, paymentId: result.razorpay_payment_id, receiptUrl: verified.receiptUrl });
              setCurrentStep(3);
              loadConfig();
            } else {
              setFailure({ title: "Payment being confirmed", reason: "We are checking this payment with the bank. Please do not pay again.", reference: order.booking.reference });
            }
          } catch (verifyError) {
            setFailure({ title: verifyError.status === 409 ? "Slot no longer available" : "Payment being confirmed", reason: verifyError.message, reference: order.booking.reference, paymentId: result.razorpay_payment_id });
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: { ondismiss: () => { setIsSubmitting(false); setFailure((current) => current || { title: "Payment not completed", reason: "You closed the payment window. No money has been taken.", reference: order.booking.reference, retry: true }); } },
      });
      checkout.on("payment.failed", (response) => {
        const reason = failureReason(response?.error);
        postJson("/payments/failure", { orderId: order.order.id, reason }).catch(() => {});
        idemRef.current = null;
        setFailure({ title: "Payment failed", reason, reference: order.booking.reference, paymentId: response?.error?.metadata?.payment_id, retry: true });
        setIsSubmitting(false);
        loadConfig();
      });
      checkout.open();
    } catch (error) {
      setIsSubmitting(false);
      if (error.status === 409) loadConfig();
      setSubmitError(error instanceof TypeError ? "We could not connect right now. Please try again in a moment." : error.message);
    }
  };

  const handleResetBooking = () => {
    setCurrentStep(1);
    setSlotMode("fixed");
    setTermsAccepted(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      targetRole: TARGET_ROLES[0],
      notes: "",
    });
    setFormErrors({});
    setSubmitError("");
    setBookingId("");
    setPaid(null);
    setFailure(null);
    idemRef.current = null;
    const initialSlot =
      getFirstAvailableSlot(availableDates[0]) || FIXED_TIME_SLOTS[0];
    setSelectedDate(availableDates[0]);
    setSelectedTime(initialSlot.label);
    setSelectedSlotDetails({
      hour: initialSlot.hour,
      minute: initialSlot.minute,
      isCustom: false,
    });
  };

  const googleCalendarUrl = useMemo(() => {
    if (!selectedSlotDetails || !selectedDate) return "#";
    const startTime = new Date(selectedDate);
    startTime.setHours(
      selectedSlotDetails.hour,
      selectedSlotDetails.minute,
      0,
      0
    );
    const endTime = new Date(startTime.getTime() + 30 * 60 * 1000);
    const toUtc = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");
    const dates = `${toUtc(startTime)}/${toUtc(endTime)}`;
    const title = encodeURIComponent(
      "1:1 Career Guidance Call with ProJenius Mentor"
    );
    const details = encodeURIComponent(
      `ProJenius 1:1 Career Guidance call (confirmed).\nCandidate: ${
        formData.name || "Student"
      }\nRole: ${formData.targetRole}${paid?.meetLink ? `\nGoogle Meet: ${paid.meetLink}` : ""}`
    );
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
  }, [selectedDate, selectedSlotDetails, formData, paid]);

  return (
    <section id="book-call" className="asf-section">
      <div className="asf-container">
        {/* ===================================================
            SESSION 4: LEFT VALUE PROPOSITION
        =================================================== */}
        <div className="asf-content" data-reveal="left">
          <p className="pjds-eyebrow">1:1 Mentoring Call</p>
          <h2 className="asf-title">
            <span className="asf-title-static">A Small Fee.</span>
            <TypedPhrase phrases={["A Serious Conversation.", "A Clear Roadmap.", "Honest Feedback."]} />
          </h2>
          <SectionTitleLine />

          <div className="asf-trust-badge">
            <Users size={16} strokeWidth={2.5} />
            <span>Trusted by 500+ students so far</span>
          </div>

          <p className="asf-description">
            Why {fee}, not free? A nominal fee filters for students who are
            genuinely serious, allowing our mentors to give their full,
            undistracted attention rather than rushing through high-volume,
            low-commitment calls.
          </p>

          <h3 className="asf-features-title">What's included in your session:</h3>

          <div className="asf-features-list">
            <div className="asf-feature-item">
              <CheckCircle2 size={18} className="asf-check-icon" />
              <span>
                A real assessment of your current resume/profile against your
                target role
              </span>
            </div>

            <div className="asf-feature-item">
              <CheckCircle2 size={18} className="asf-check-icon" />
              <span>
                A personalized first-draft roadmap you keep regardless of
                whether you continue with ProJenius
              </span>
            </div>

            <div className="asf-feature-item">
              <CheckCircle2 size={18} className="asf-check-icon" />
              <span>Direct, honest feedback on your biggest current gap</span>
            </div>

            <div className="asf-feature-item">
              <CheckCircle2 size={18} className="asf-check-icon" />
              <span>
                A clear recommendation on next steps — including telling you
                honestly if ProJenius isn't the right fit
              </span>
            </div>
          </div>

          <div className="asf-pills">
            <div className="asf-pill asf-pill-wide">
              <ArrowRight size={15} />
              <strong>{fee} (fully refundable if you're not satisfied)</strong>
            </div>

            <div className="asf-pill">
              <Clock3 size={15} />
              <strong>30 Minutes</strong>
            </div>

            <div className="asf-pill">
              <Users size={15} />
              <strong>1:1 With a Real Mentor</strong>
            </div>

            <div className="asf-pill">
              <CalendarDays size={15} />
              <strong>Credited toward program fee if enrolled</strong>
            </div>
          </div>
        </div>

        {/* ===================================================
            SESSION 5: RIGHT BOOKING WIZARD CARD
        =================================================== */}
        <div className="asf-card" data-reveal="right" data-reveal-delay="1">
          <div className="asf-card-header">
            <h3>
              {currentStep === 1 && "Book a Call"}
              {currentStep === 2 && "Attendee Details"}
              {currentStep === 3 && "Call Booked"}
            </h3>
          </div>

          {/* STEP BAR */}
          <div className="asf-steps-bar">
            <div
              className={`asf-step-item ${
                currentStep === 1
                  ? "asf-step-active"
                  : currentStep > 1
                  ? "asf-step-completed"
                  : ""
              }`}
              onClick={() =>
                currentStep > 1 && currentStep < 3 && setCurrentStep(1)
              }
            >
              <div className="asf-step-circle">
                {currentStep > 1 ? <Check size={13} strokeWidth={3} /> : "1"}
              </div>
              <span className="asf-step-label">Date & Time</span>
            </div>

            <div
              className={`asf-step-line ${
                currentStep >= 2 ? "asf-line-active" : ""
              }`}
            />

            <div
              className={`asf-step-item ${
                currentStep === 2
                  ? "asf-step-active"
                  : currentStep > 2
                  ? "asf-step-completed"
                  : ""
              }`}
            >
              <div className="asf-step-circle">
                {currentStep > 2 ? <Check size={13} strokeWidth={3} /> : "2"}
              </div>
              <span className="asf-step-label">Your Info</span>
            </div>
          </div>

          <div className="asf-card-body">
            {/* STEP 1: DATE & TIME */}
            {currentStep === 1 && (
              <div className="asf-step-view">
                <div className="asf-calendar-icon-wrap">
                  <CalendarDays size={38} strokeWidth={1.8} />
                </div>

                <h4 className="asf-view-title">Select a Date & Time</h4>
                <p className="asf-view-sub">
                  Choose a convenient slot for your mentoring session.
                </p>

                {autoMoveMessage && (
                  <div className="asf-auto-banner">
                    <Clock size={15} />
                    <span>{autoMoveMessage}</span>
                  </div>
                )}

                {/* DATES */}
                <div className="asf-dates-row">
                  {availableDates.map((date) => {
                    const active = isSameDay(date, selectedDate);
                    const today = isSameDay(date, new Date());
                    const allTodayExpired =
                      today && !getFirstAvailableSlot(date);

                    return (
                      <button
                        type="button"
                        key={formatDateKey(date)}
                        className={`asf-date-btn ${
                          active ? "asf-date-active" : ""
                        } ${allTodayExpired ? "asf-date-ended" : ""}`}
                        onClick={() => handleDateChange(date)}
                      >
                        <span className="asf-date-day">
                          {today
                            ? allTodayExpired
                              ? "Today (Ended)"
                              : "Today"
                            : WEEK_DAYS[date.getDay()]}
                        </span>
                        <strong className="asf-date-num">
                          {date.getDate()}
                        </strong>
                      </button>
                    );
                  })}
                </div>

                {/* MODE TABS */}
                <div className="asf-slot-mode-tabs">
                  <button
                    type="button"
                    className={`asf-mode-tab ${
                      slotMode === "fixed" ? "asf-mode-active" : ""
                    }`}
                    onClick={() => {
                      setSlotMode("fixed");
                      const nextSlot =
                        getFirstAvailableSlot(selectedDate) ||
                        FIXED_TIME_SLOTS[0];
                      setSelectedTime(nextSlot.label);
                      setSelectedSlotDetails({
                        hour: nextSlot.hour,
                        minute: nextSlot.minute,
                        isCustom: false,
                      });
                    }}
                  >
                    <Clock3 size={14} />
                    <span>4 Fixed Slots</span>
                  </button>

                  <button
                    type="button"
                    className={`asf-mode-tab ${
                      slotMode === "custom" ? "asf-mode-active" : ""
                    }`}
                    onClick={() => setSlotMode("custom")}
                  >
                    <Clock size={14} />
                    <span>Book Convenient Slot 🕒</span>
                  </button>
                </div>

                {/* 4 FIXED SLOTS */}
                {slotMode === "fixed" && (
                  <div className="asf-fixed-slots-grid">
                    {FIXED_TIME_SLOTS.map((slot) => {
                      const expired = isSlotExpired(
                        selectedDate,
                        slot.hour,
                        slot.minute
                      );
                      const taken = isTaken(selectedDate, slot.hour, slot.minute);
                      const isSelected = selectedTime === slot.label && !taken;
                      const nextSlot = getFirstAvailableSlot(selectedDate);
                      const isNext =
                        nextSlot && nextSlot.label === slot.label && !expired;

                      return (
                        <button
                          type="button"
                          key={slot.label}
                          disabled={expired || taken}
                          className={`asf-slot-btn ${
                            isSelected ? "asf-slot-selected" : ""
                          } ${expired || taken ? "asf-slot-expired" : ""}`}
                          onClick={() => handleTimeChange(slot)}
                        >
                          <div className="asf-slot-label-row">
                            <Clock3 size={15} />
                            <strong>{slot.label}</strong>
                          </div>
                          {expired ? (
                            <span className="asf-tag-passed">Passed</span>
                          ) : taken ? (
                            <span className="asf-tag-passed">Booked</span>
                          ) : isNext ? (
                            <span className="asf-tag-next">Next Slot</span>
                          ) : (
                            <span className="asf-tag-avail">Available</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* CONVENIENT SLOT */}
                {slotMode === "custom" && (
                  <div className="asf-convenient-box">
                    {allUpcomingConvenientSlots.length > 0 && (
                      <div className="asf-quick-select-wrap">
                        <label>Select From All Upcoming Times:</label>
                        <select
                          className="asf-full-select"
                          value={formattedCustomTime}
                          onChange={(e) => {
                            const found = allUpcomingConvenientSlots.find(
                              (s) => s.label === e.target.value
                            );
                            if (found) selectQuickConvenientSlot(found);
                          }}
                        >
                          {allUpcomingConvenientSlots.map((s) => (
                            <option key={s.label} value={s.label}>
                              {s.label} (Convenient Slot)
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {upcomingQuickChips.length > 0 && (
                      <div className="asf-chips-wrap">
                        <span className="asf-chips-title">Popular Slots:</span>
                        <div className="asf-chips-grid">
                          {upcomingQuickChips.map((quick) => (
                            <button
                              type="button"
                              key={quick.label}
                              className={`asf-chip-btn ${
                                selectedTime === quick.label ? "active" : ""
                              }`}
                              onClick={() => selectQuickConvenientSlot(quick)}
                            >
                              {quick.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {customTimeNotice && (
                      <div className="asf-warning-banner">
                        <AlertCircle size={14} />
                        <span>{customTimeNotice}</span>
                      </div>
                    )}

                    <button
                      type="button"
                      className="asf-apply-time-btn"
                      disabled={Boolean(customTimeNotice)}
                      onClick={applyCustomConvenientTime}
                    >
                      <Check size={16} />
                      <span>Set Convenient Slot ({formattedCustomTime})</span>
                    </button>
                  </div>
                )}

                {/* SELECTED BADGE */}
                {selectedTime && (
                  <div className="asf-selected-badge">
                    <CheckCircle2 size={16} />
                    <span>
                      Selected: <strong>{selectedTime}</strong> (
                      {formattedSelectedDate} • 30 mins)
                    </span>
                  </div>
                )}

                {/* BUTTON & TERMS */}
                <button
                  type="button"
                  className="asf-main-btn"
                  disabled={!selectedTime || !termsAccepted}
                  onClick={handleProceedToDetails}
                >
                  <span>Proceed to Booking Details</span>
                  <ArrowRight size={18} />
                </button>

                <div className="asf-terms-row">
                  <label className="asf-terms-label">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <span>
                      I agree to the{" "}
                      <Link to="/terms" target="_blank" rel="noopener noreferrer">
                        <strong>Terms &amp; Conditions</strong>
                        <span className="pjds-sr-only"> (opens in a new tab)</span>
                      </Link>{" "}
                      for 1:1 mentoring.
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: ATTENDEE DETAILS */}
            {currentStep === 2 && (
              <form onSubmit={handleSubmitBooking} className="asf-form">
                <div className="asf-recap-banner">
                  <div className="asf-recap-text">
                    <CalendarDays size={15} />
                    <span>
                      {formattedSelectedDate} at{" "}
                      <strong>{selectedTime}</strong> (30 min call)
                    </span>
                  </div>
                  <button
                    type="button"
                    className="asf-recap-btn"
                    onClick={() => setCurrentStep(1)}
                  >
                    Change
                  </button>
                </div>

                <div className="asf-form-group">
                  <label htmlFor="asf-name">
                    <User size={14} aria-hidden="true" /> Full Name <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="asf-name"
                    autoComplete="name"
                    required
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? "asf-name-error" : undefined}
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={formErrors.name ? "asf-input-error" : ""}
                  />
                  {formErrors.name && (
                    <span id="asf-name-error" className="asf-error-msg">{formErrors.name}</span>
                  )}
                </div>

                <div className="asf-form-group">
                  <label htmlFor="asf-email">
                    <Mail size={14} aria-hidden="true" /> Email Address <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="asf-email"
                    autoComplete="email"
                    required
                    aria-invalid={Boolean(formErrors.email)}
                    aria-describedby={formErrors.email ? "asf-email-error" : undefined}
                    type="email"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={formErrors.email ? "asf-input-error" : ""}
                  />
                  {formErrors.email && (
                    <span id="asf-email-error" className="asf-error-msg">{formErrors.email}</span>
                  )}
                </div>

                <div className="asf-form-group">
                  <label htmlFor="asf-phone">
                    <Phone size={14} aria-hidden="true" /> Mobile / WhatsApp{" "}
                    <span className="req" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="asf-phone"
                    autoComplete="tel"
                    required
                    aria-invalid={Boolean(formErrors.phone)}
                    aria-describedby={formErrors.phone ? "asf-phone-error" : undefined}
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={formErrors.phone ? "asf-input-error" : ""}
                  />
                  {formErrors.phone && (
                    <span id="asf-phone-error" className="asf-error-msg">{formErrors.phone}</span>
                  )}
                </div>

                <div className="asf-form-group">
                  <label htmlFor="asf-role">
                    <Sparkles size={14} aria-hidden="true" /> Preparing Role
                  </label>
                  <select
                    id="asf-role"
                    value={formData.targetRole}
                    onChange={(e) =>
                      setFormData({ ...formData, targetRole: e.target.value })
                    }
                  >
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="asf-form-group">
                  <label htmlFor="asf-notes">Questions / Notes for Mentor (Optional)</label>
                  <textarea
                    id="asf-notes"
                    rows={2}
                    placeholder="e.g. Resume critique, transition to full stack..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                {failure && (
                  <div className={`asf-pay-result ${failure.title === "Payment being confirmed" ? "is-pending" : ""}`} role="alert">
                    <strong>{failure.title}</strong>
                    <p><b>Reason:</b> {failure.reason}</p>
                    <small>Reference {failure.reference}{failure.paymentId ? ` · Payment ID ${failure.paymentId}` : ""}</small>
                    <small>Need help? Call +91 89254 50473 with your reference.</small>
                  </div>
                )}

                {submitError && (
                  <p className="asf-submit-error" role="alert">
                    <AlertCircle size={16} aria-hidden="true" />
                    <span>{submitError}</span>
                  </p>
                )}

                <div className="asf-form-actions">
                  <button
                    type="button"
                    className="asf-back-btn"
                    disabled={isSubmitting}
                    onClick={() => setCurrentStep(1)}
                  >
                    <ArrowLeft size={15} /> Back
                  </button>
                  <button
                    type="submit"
                    className="asf-main-btn asf-flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={17} className="asf-spin" />
                        <span>Opening secure payment…</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {fee} &amp; book this call</span>
                        <ArrowRight size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: CALL BOOKED (paid) */}
            {currentStep === 3 && (
              <div className="asf-confirmed-view" role="status">
                <div className="asf-success-icon-wrap">
                  <CheckCircle2 size={50} aria-hidden="true" />
                </div>

                <h4 className="asf-confirmed-title">Payment successful · call booked</h4>
                <p className="asf-confirmed-sub">
                  Thank you, {formData.name || "there"}. Your slot is confirmed. The Google Meet link and your
                  receipt have been sent to <strong>{formData.email}</strong>.
                </p>

                {bookingId && (
                  <div className="asf-ref-badge">
                    <span>Booking reference:</span>
                    <strong>{bookingId}</strong>
                  </div>
                )}

                <div className="asf-details-grid">
                  <div className="asf-detail-item">
                    <CalendarDays size={15} aria-hidden="true" />
                    <div>
                      <small>Date &amp; time</small>
                      <strong>{formattedSelectedDate} at {selectedTime}</strong>
                    </div>
                  </div>
                  <div className="asf-detail-item">
                    <Clock3 size={15} aria-hidden="true" />
                    <div>
                      <small>Duration</small>
                      <strong>{config.callMinutes || 30} minutes (1:1)</strong>
                    </div>
                  </div>
                  <div className="asf-detail-item">
                    <User size={15} aria-hidden="true" />
                    <div>
                      <small>Amount paid</small>
                      <strong>{rupees(paid?.amountMinor || config.feeMinor)}</strong>
                    </div>
                  </div>
                  <div className="asf-detail-item">
                    <Smartphone size={15} aria-hidden="true" />
                    <div>
                      <small>Status</small>
                      <strong>Confirmed</strong>
                    </div>
                  </div>
                </div>

                <div className="asf-confirmed-btns">
                  {paid?.meetLink && (
                    <a href={paid.meetLink} target="_blank" rel="noopener noreferrer" className="asf-main-btn asf-meet-btn">
                      <span>Open Google Meet link</span>
                      <span className="pjds-sr-only"> (opens in a new tab)</span>
                    </a>
                  )}
                  {paid?.receiptUrl && (
                    <a href={resolveApiUrl(paid.receiptUrl, API_BASE, window.location.origin)} className="asf-calendar-link">
                      <span>Download receipt</span>
                    </a>
                  )}
                  <a href={googleCalendarUrl} target="_blank" rel="noopener noreferrer" className="asf-calendar-link">
                    <Calendar size={15} aria-hidden="true" />
                    <span>Add to Google Calendar</span>
                    <span className="pjds-sr-only"> (opens in a new tab)</span>
                  </a>
                </div>

                <button type="button" className="asf-reset-btn" onClick={handleResetBooking}>
                  Book Another Call
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ASmallFee;
