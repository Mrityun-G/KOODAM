import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { ref, onValue, set, update, remove, push } from 'firebase/database';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth, storage, isFirebaseConfigured, isStorageConfigured } from '../lib/firebase';
import { haversineDistanceKm, estimateEtaMinutes } from '../lib/geo';

const AppContext = createContext(null);

// Member's service address — live ETA/distance is measured against this point.
// Defaults to Indiranagar, Bengaluru; replace with the real booking address.
const DESTINATION_COORDS = { lat: 12.9784, lng: 77.6408 };

// Firebase Realtime Database keys can't contain ".", "#", "$", "[", "]" — order IDs like "#KD-8924" need stripping.
const toDbKey = (orderId) => orderId.replace(/[.#$[\]]/g, '');

// Error codes that mean the Firebase project itself isn't fully set up (e.g. Email/Password
// sign-in not enabled in the console) rather than a real problem with what the user entered.
// When we hit one of these, fall back to local-only demo mode instead of blocking the user.
const AUTH_SETUP_ERROR_CODES = [
  'auth/configuration-not-found',
  'auth/operation-not-allowed',
  'auth/invalid-api-key',
  'auth/api-key-not-valid',
  'auth/project-not-found'
];
const isAuthSetupError = (err) => AUTH_SETUP_ERROR_CODES.includes(err?.code);

// Translates Firebase Auth error codes into friendly, user-facing copy.
const authErrorMessage = (err) => {
  const code = err?.code || '';
  if (code.includes('email-already-in-use')) return 'That email is already registered — try logging in instead.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
    return 'Incorrect email or password.';
  }
  if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
  if (code.includes('invalid-email')) return 'Please enter a valid email address.';
  if (code.includes('too-many-requests')) return 'Too many attempts. Please try again in a moment.';
  return err?.message || 'Something went wrong. Please try again.';
};

export const AppProvider = ({ children }) => {
  // Navigation & Role State
  const [role, setRole] = useState('welcome'); // 'welcome' | 'member' | 'partner'
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing' | 'welcome' | 'home' | 'booking' | 'tracking' | 'partner'
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'search' | 'requests' | 'chat' | 'profile'
  const [language, setLanguage] = useState('en'); // 'en' | 'ta' | 'kn'
  const [location, setLocation] = useState('Indiranagar, Bengaluru');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Auth State
  const [authUser, setAuthUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Service Partner identity documents (Aadhaar, PAN, Voter ID) uploaded at sign-up.
  // Holds Firebase Storage download URLs when Storage is configured, otherwise the
  // raw File objects for this session only (nothing persists across a reload offline).
  const [partnerKyc, setPartnerKyc] = useState(null);

  // Mirror the signed-in Firebase user (null when signed out or running offline)
  useEffect(() => {
    if (!isFirebaseConfigured) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user));
    return () => unsubscribe();
  }, []);

  // Member Profile & Settings State
  const [userProfile, setUserProfile] = useState({
    name: 'Priya Sharma',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 12345',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZKnQP42EPG0JORpP5bTXuIreTz7lfmiiSke3JZzhdqFV7Pjd2tXztHMC9EFtcT5E4kJn8YRuq5kEZ2bY4nLB26pkktCdavk6F9afmmNcRO2-78-t3OIh-d6M4MEHLzSSTtgitcy1iLAAEEID2qFcx87ghwK_nevrbzFgkGapbKiIL-k7CKiXuYJOLFBuvsbd1Yh0UejQrUggO7n7AEewo0rMhrh8u93xBcXUG6Blrutcyp3EPmw7TGw'
  });

  // Service Partner Profile & Settings State
  const [partnerProfile, setPartnerProfile] = useState({
    name: 'Arun Varma',
    email: 'arun.varma@example.com',
    phone: '+91 98765 43210',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1KUaHaxx9-0zLYxXwe1qxLJ0jJYPLqCFsAjNOyvD60uX5AVr6RK2dvGziPMtH59A3aJOvnqyPP4w30p4E-MWzvTTddgIC6_jhVaV3Vv4v4zJDxVLTZ4QyusKSFBoaOmYL-PNBEX0PpYEvExLZfM8KanBylMX25cDla34VsABdoAJ66XZXU9OnKsInNA-vLjrtqUCQUpQACDv33Rg9utw_2rQVKnXf6z5x0U5ZiTD0NIvTo9L6FiJNEg'
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Helper & Booking State
  const [selectedHelper, setSelectedHelper] = useState({
    id: 'arun',
    name: 'Arun Varma',
    title: 'Master Electrician & Smart Home Tech',
    rating: 4.92,
    reviewsCount: 184,
    completionRate: '99%',
    distance: '1.1 km',
    experience: '6+ yrs',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFP-hU-FEvoiJVzKzRp5W3wJOlmXvEIgsYb8I9Nmnf3XEq3dbTrQZ-NUDt5Cae6rToq_UsMM47w7oI4k31EWKotizKHaHa6paxpDCLq86tWj_0lR9U4DWJo4S5marrKLXymEKlXE1p9hioIBsUxdzwrwiQoNPjVq1YSg_qmiN58moH7YnlnV0w1FiNYrNcQzllBVwnvN640h9SbhbmRFpTLl6OBH6OWKG_RLEd2Z_WyLrjXVY5faO4w',
    hourlyRate: 299,
    vehicle: 'TVS Jupiter • KA-03-HM-4122',
    phone: '+91 98765 43210'
  });

  const [selectedService, setSelectedService] = useState({
    id: 2,
    title: 'Emergency Short Circuit Diagnostic',
    price: 399,
    duration: '~45 mins',
    tag: 'POPULAR',
    desc: 'Line leakage, spark identification & testing'
  });

  const [selectedDate, setSelectedDate] = useState('Today 22');
  const [selectedTime, setSelectedTime] = useState('10:30 AM - 11:30 AM');
  const [trustFee] = useState(20);

  // Active Order / Live Tracking State
  const [activeOrder, setActiveOrder] = useState({
    orderId: '#KD-8924',
    helperName: 'Arun Varma',
    serviceTitle: 'Emergency Diagnostic',
    safetyPin: '4821',
    completionOtp: null,
    currentStep: 3, // 1: Confirmed, 2: Assigned, 3: En Route, 4: In Progress, 5: Completed
    etaMinutes: 12,
    etaTime: '10:45 AM',
    currentRoad: '12th Main Rd (0.8 km away)',
    totalPaid: 419,
    trafficCondition: 'Smooth traffic on 100 Feet Rd',
    rating: null,
    feedback: ''
  });

  // Member side: subscribe to the active order's live status (synced with the partner's device via Firebase)
  useEffect(() => {
    if (!isFirebaseConfigured || !activeOrder.orderId) return;
    const orderRef = ref(db, `orders/${toDbKey(activeOrder.orderId)}`);
    const unsubscribe = onValue(orderRef, (snapshot) => {
      const val = snapshot.val();
      if (val) setActiveOrder(prev => ({ ...prev, ...val }));
    });
    return () => unsubscribe();
  }, [activeOrder.orderId]);

  // Writes an order-status patch through Firebase (so every device sees it) with a local-only fallback
  const updateActiveOrder = (patch) => {
    if (isFirebaseConfigured && activeOrder.orderId) {
      update(ref(db, `orders/${toDbKey(activeOrder.orderId)}`), patch);
    } else {
      setActiveOrder(prev => ({ ...prev, ...patch }));
    }
  };

  // Live GPS Tracking State (partner's device -> Firebase Realtime DB -> member's device)
  const [partnerLocation, setPartnerLocation] = useState(null); // { lat, lng, heading, speed, updatedAt }
  const [isSharingLocation, setIsSharingLocation] = useState(false);
  const geoWatchIdRef = useRef(null);

  // Member side: subscribe to the active order's live location whenever it changes
  useEffect(() => {
    if (!isFirebaseConfigured || !activeOrder.orderId) return;
    const locRef = ref(db, `liveLocations/${toDbKey(activeOrder.orderId)}`);
    const unsubscribe = onValue(locRef, (snapshot) => {
      setPartnerLocation(snapshot.val());
    });
    return () => unsubscribe();
  }, [activeOrder.orderId]);

  // Stop the device GPS watch on unmount so it doesn't keep running in the background
  useEffect(() => {
    return () => {
      if (geoWatchIdRef.current != null) {
        navigator.geolocation?.clearWatch(geoWatchIdRef.current);
      }
    };
  }, []);

  const startSharingLocation = () => {
    if (!isFirebaseConfigured) {
      showToast('Live GPS needs Firebase setup — add keys to .env.local first.');
      return;
    }
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported on this device/browser.');
      return;
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, heading, speed } = pos.coords;
        set(ref(db, `liveLocations/${toDbKey(activeOrder.orderId)}`), {
          lat: latitude,
          lng: longitude,
          heading: heading ?? null,
          speed: speed ?? null,
          updatedAt: Date.now()
        });
      },
      (err) => {
        showToast(`Location error: ${err.message}`);
        setIsSharingLocation(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    geoWatchIdRef.current = watchId;
    setIsSharingLocation(true);
    showToast('Sharing your live location with the customer.');
  };

  const stopSharingLocation = () => {
    if (geoWatchIdRef.current != null) {
      navigator.geolocation.clearWatch(geoWatchIdRef.current);
      geoWatchIdRef.current = null;
    }
    setIsSharingLocation(false);
    if (isFirebaseConfigured && activeOrder.orderId) {
      remove(ref(db, `liveLocations/${toDbKey(activeOrder.orderId)}`));
    }
    showToast('Stopped sharing live location.');
  };

  const liveDistanceKm = partnerLocation
    ? haversineDistanceKm(partnerLocation, DESTINATION_COORDS)
    : null;
  const liveEtaMinutes = liveDistanceKm != null ? estimateEtaMinutes(liveDistanceKm) : null;

  // Service Partner State
  const [isPartnerOnline, setIsPartnerOnline] = useState(true);
  const [partnerStats, setPartnerStats] = useState({
    todayEarnings: 1850,
    completedJobs: 3,
    weeklyBalance: 9420,
    rating: 4.9,
    reviews: 184
  });

  const [hasIncomingJob, setHasIncomingJob] = useState(true);
  const [incomingCountdown, setIncomingCountdown] = useState(105); // seconds (01:45)
  const [incomingJobDetails, setIncomingJobDetails] = useState({
    category: 'Electrical & Appliances',
    title: 'Kitchen Chimney & Switchboard Repair',
    distance: '0.9 km',
    etaMins: 7,
    area: 'Indiranagar 12th Main',
    payout: 550,
    customerName: 'Priya Sharma',
    customerRating: 4.8
  });

  // Countdown timer for incoming request
  useEffect(() => {
    let timer;
    if (hasIncomingJob && incomingCountdown > 0) {
      timer = setInterval(() => {
        setIncomingCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [hasIncomingJob, incomingCountdown]);

  // Chat Modal State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatPartner, setChatPartner] = useState('Arun Varma');
  // sender is 'member' or 'partner' (whoever sent it) — offline fallback below uses the same shape
  const [messages, setMessages] = useState([
    { id: 1, sender: 'partner', text: 'Namaskara! I am at 12th Main cross, reaching in about 10 minutes.', time: '10:35 AM' },
    { id: 2, sender: 'member', text: 'Sounds great Arun! Please ring the bell on the 2nd floor.', time: '10:36 AM' },
    { id: 3, sender: 'partner', text: 'Sure thing, will do! I have the multimeter and safety gear ready.', time: '10:37 AM' }
  ]);

  // Subscribe to the order's shared chat thread (both member and partner devices read/write the same thread)
  useEffect(() => {
    if (!isFirebaseConfigured || !activeOrder.orderId) return;
    const msgsRef = ref(db, `chats/${toDbKey(activeOrder.orderId)}/messages`);
    const unsubscribe = onValue(msgsRef, (snapshot) => {
      const val = snapshot.val() || {};
      const list = Object.entries(val)
        .map(([id, msg]) => ({ id, ...msg }))
        .sort((a, b) => (a.ts || 0) - (b.ts || 0));
      setMessages(list);
    });
    return () => unsubscribe();
  }, [activeOrder.orderId]);

  // Emergency Modal State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, duration);
  };

  // Persistent Notifications (shared, targeted at 'member' or 'partner')
  const [notifications, setNotifications] = useState([]);

  const addNotification = (target, { title, desc, screen = null, tab = null }) => {
    setNotifications(prev => [
      { id: Date.now() + Math.random(), target, title, desc, time: 'Just now', unread: true, screen, tab },
      ...prev
    ]);
  };

  const markNotificationsRead = (target) => {
    setNotifications(prev => prev.map(n => (n.target === target ? { ...n, unread: false } : n)));
  };

  // Reviews left by members for their helper, visible on the Partner Dashboard
  const [reviews, setReviews] = useState([]);

  // Switch Screen Helper
  const navigateTo = (screen, tab = null) => {
    setCurrentScreen(screen);
    if (tab) setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Actions
  // Enters a role's home screen without a toast — used by both the demo role-switch
  // buttons (which show their own toast) and by sign in/up (which show a welcome toast).
  const enterRole = (targetRole) => {
    setRole(targetRole);
    if (targetRole === 'partner') {
      setCurrentScreen('partner');
    } else {
      setCurrentScreen('home');
      setActiveTab('home');
    }
  };

  const handleSelectMember = () => {
    enterRole('member');
    showToast('Switched to Community Member View');
  };

  const handleSelectPartner = () => {
    enterRole('partner');
    showToast('Switched to Service Partner Dashboard');
  };

  // Creates an account (real Firebase Auth when configured, local-only otherwise) and enters the given role's home screen.
  const signUp = async (targetRole, { name, email, phone, password, aadhaarFile, panFile, voterIdFile }) => {
    setAuthLoading(true);
    try {
      let cred = null;
      if (isFirebaseConfigured) {
        try {
          cred = await createUserWithEmailAndPassword(auth, email, password);
          if (name) await updateProfile(cred.user, { displayName: name });
        } catch (err) {
          if (!isAuthSetupError(err)) throw err;
        }
      }
      setUserProfile(prev => ({
        ...prev,
        name: name || prev.name,
        email: email || prev.email,
        phone: phone || prev.phone
      }));

      if (targetRole === 'partner' && (aadhaarFile || panFile || voterIdFile)) {
        await uploadPartnerKyc(cred?.user?.uid, { aadhaarFile, panFile, voterIdFile });
      }

      enterRole(targetRole);
      showToast(`Welcome to KOODAM, ${name || 'there'}!`);
      return true;
    } catch (err) {
      showToast(authErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  // Uploads the service partner's KYC documents to Firebase Storage when configured
  // (falling back to keeping the raw files in memory for this session only), without
  // ever blocking account creation if the upload itself fails.
  const uploadPartnerKyc = async (uid, { aadhaarFile, panFile, voterIdFile }) => {
    const docs = { aadhaar: aadhaarFile, pan: panFile, voterId: voterIdFile };

    if (!isStorageConfigured || !uid) {
      setPartnerKyc(docs);
      return;
    }

    try {
      const uploaded = {};
      for (const [key, file] of Object.entries(docs)) {
        if (!file) continue;
        const path = `partnerDocuments/${uid}/${key}-${Date.now()}-${file.name}`;
        const fileRef = storageRef(storage, path);
        await uploadBytes(fileRef, file);
        uploaded[key] = await getDownloadURL(fileRef);
      }
      setPartnerKyc(uploaded);
    } catch (err) {
      setPartnerKyc(docs);
      showToast('Account created, but document upload failed — you can re-upload documents later.');
    }
  };

  // Signs in (real Firebase Auth when configured, local-only otherwise) and enters the given role's home screen.
  const signIn = async (targetRole, { email, password }) => {
    setAuthLoading(true);
    try {
      if (isFirebaseConfigured) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err) {
          if (!isAuthSetupError(err)) throw err;
        }
      }
      if (email) setUserProfile(prev => ({ ...prev, email }));
      enterRole(targetRole);
      showToast('Logged in successfully!');
      return true;
    } catch (err) {
      showToast(authErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err) {
        showToast(authErrorMessage(err));
      }
    }
    setRole('welcome');
    navigateTo('welcome');
    showToast('Logged out.');
  };

  const requestPasswordReset = async (email) => {
    if (!email) {
      showToast('Enter your email address first.');
      return;
    }
    if (isFirebaseConfigured) {
      try {
        await sendPasswordResetEmail(auth, email);
        showToast('Password reset email sent — check your inbox.');
      } catch (err) {
        showToast(authErrorMessage(err));
      }
    } else {
      showToast(`Demo mode: a password reset link would be sent to ${email}.`);
    }
  };

  const updateUserProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile updated successfully!');
  };

  const updatePartnerProfile = (updates) => {
    setPartnerProfile(prev => ({ ...prev, ...updates }));
    showToast('Profile updated successfully!');
  };

  const changePassword = (currentPassword, newPassword) => {
    if (!currentPassword || !newPassword) {
      showToast('Please fill in all password fields.');
      return false;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.');
      return false;
    }
    showToast('Password updated successfully!');
    return true;
  };

  const handleBookHelper = (helperData = null) => {
    if (helperData) setSelectedHelper(helperData);
    navigateTo('booking');
  };

  const handleVoiceBooking = (spokenText) => {
    const text = spokenText.toLowerCase();
    const budgetMatch = text.match(/(?:₹\s*|rs\.?\s*|(?:cost|price|budget)\s*(?:of|is)?\s*)(\d{2,5})|(\d{2,5})\s*rupees?/i);
    const budget = budgetMatch ? Number(budgetMatch[1] || budgetMatch[2]) : null;
    const isPlumbing = /plumb|tap|pipe|leak|water/.test(text);
    const isMorning = /morning|today|asap|now/.test(text);
    const servicePrice = budget || (isPlumbing ? 500 : 399);

    setSelectedHelper(prev => ({
      ...prev,
      title: isPlumbing ? 'Verified Plumber & Water Systems Specialist' : prev.title
    }));
    setSelectedService({
      id: `voice-${Date.now()}`,
      title: isPlumbing ? 'Plumbing Service Visit' : 'On-demand Home Service Visit',
      price: servicePrice,
      duration: '~60 mins',
      tag: 'VOICE MATCHED',
      desc: budget ? `Matched to your ₹${budget} budget` : 'Verified local partner dispatch'
    });
    if (isMorning) {
      setSelectedDate('Today 22');
      setSelectedTime('10:30 AM - 11:30 AM');
    }
    showToast(`Voice request understood: ${isPlumbing ? 'plumber' : 'home service'} • ₹${servicePrice}`);
    navigateTo('payment');
  };

  const handleProceedToPayment = () => navigateTo('payment');

  const handleConfirmBooking = () => {
    // Transition to tracking screen with live order details
    const finalTotal = selectedService.price + trustFee;
    updateActiveOrder({
      helperName: selectedHelper.name,
      serviceTitle: selectedService.title,
      totalPaid: finalTotal,
      currentStep: 3,
      etaMinutes: 12,
      rating: null,
      feedback: ''
    });

    // Notify the member: request is on its way to the helper
    addNotification('member', {
      title: 'Request Sent',
      desc: `Your booking request has been sent to ${selectedHelper.name}.`,
      screen: 'tracking',
      tab: 'requests'
    });

    // Notify the service man: a new job is awaiting their accept/reject
    setIncomingJobDetails(prev => ({
      ...prev,
      title: selectedService.title,
      payout: finalTotal
    }));
    setHasIncomingJob(true);
    setIncomingCountdown(105);
    addNotification('partner', {
      title: 'New Request Nearby!',
      desc: `${selectedService.title} • Accept or reject within 01:45`
    });

    showToast(`Booking Request Sent to ${selectedHelper.name}! Redirecting to Live Tracking...`);
    setTimeout(() => {
      navigateTo('tracking', 'requests');
    }, 1200);
  };

  const advanceOrderStatus = () => {
    const nextStep = activeOrder.currentStep < 5 ? activeOrder.currentStep + 1 : 1;
    const stepNames = [
      'Booking Confirmed',
      'Helper Assigned',
      'Helper En Route',
      'Service in Progress',
      'Service Completed & Verified'
    ];
    showToast(`Order Status Updated: ${stepNames[nextStep - 1]}`);
    updateActiveOrder({
      currentStep: nextStep,
      etaMinutes: nextStep === 3 ? 12 : nextStep > 3 ? 0 : 20
    });
  };

  const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));

  // Service partner enters the code the customer reads out on arrival.
  // Only once it matches does the job move to "in progress" — this stops a
  // partner from starting (and getting paid for) a job at the wrong address.
  const verifyArrivalOtp = (code) => {
    if (code !== activeOrder.safetyPin) {
      showToast('Incorrect arrival code — ask the customer to confirm it.');
      return false;
    }
    const completionOtp = generateOtp();
    // Clear out any rating left over from a previous job on this order, so the
    // customer always has to pick a fresh rating once this job is verified done.
    updateActiveOrder({ currentStep: 4, completionOtp, etaMinutes: 0, rating: null, feedback: '' });
    addNotification('member', {
      title: 'Work Started',
      desc: `${activeOrder.helperName} verified your arrival code and has started the service.`,
      screen: 'tracking',
      tab: 'requests'
    });
    showToast('Arrival code verified — work has started!');
    return true;
  };

  // Customer enters the code the partner reads out once the job is done.
  // This is the customer's sign-off that they're happy with the work before
  // the order is marked complete and the payment is settled.
  const verifyCompletionOtp = (code) => {
    if (code !== activeOrder.completionOtp) {
      showToast('Incorrect completion code — ask your service partner to confirm it.');
      return false;
    }
    updateActiveOrder({ currentStep: 5 });
    addNotification('partner', {
      title: 'Job Verified & Paid',
      desc: `The customer confirmed completion for ${activeOrder.serviceTitle}. Payment has been settled.`
    });
    showToast('Service verified! Payment completed.');
    return true;
  };

  const submitRating = (stars, feedback = '') => {
    updateActiveOrder({ rating: stars, feedback });

    setReviews(prev => [
      {
        id: Date.now() + Math.random(),
        orderId: activeOrder.orderId,
        serviceTitle: activeOrder.serviceTitle,
        stars,
        feedback,
        time: 'Just now'
      },
      ...prev
    ]);

    setPartnerStats(prev => {
      const totalScore = prev.rating * prev.reviews + stars;
      const newReviews = prev.reviews + 1;
      return {
        ...prev,
        rating: Math.round((totalScore / newReviews) * 100) / 100,
        reviews: newReviews
      };
    });

    addNotification('partner', {
      title: 'New Rating Received',
      desc: `You were rated ${stars}★ for ${activeOrder.serviceTitle}${feedback ? `: "${feedback}"` : '.'}`
    });

    showToast('Thanks for your feedback! Rating submitted.');
  };

  const togglePartnerDuty = () => {
    setIsPartnerOnline(prev => {
      const newState = !prev;
      showToast(newState ? 'You are now ONLINE. Receiving local orders within 5km.' : 'You are now OFFLINE.');
      return newState;
    });
  };

  const acceptIncomingJob = () => {
    setHasIncomingJob(false);
    setPartnerStats(prev => ({
      ...prev,
      todayEarnings: prev.todayEarnings + incomingJobDetails.payout,
      weeklyBalance: prev.weeklyBalance + incomingJobDetails.payout,
      completedJobs: prev.completedJobs + 1
    }));
    addNotification('member', {
      title: 'Booking Accepted!',
      desc: `${selectedHelper.name} accepted your request for ${incomingJobDetails.title}.`,
      screen: 'tracking',
      tab: 'requests'
    });
    showToast(`Job Accepted! ₹${incomingJobDetails.payout} added to queue. Customer notified.`);
  };

  const declineIncomingJob = () => {
    setHasIncomingJob(false);
    addNotification('member', {
      title: 'Booking Declined',
      desc: `${selectedHelper.name} couldn't accept this request. We're finding another helper nearby.`
    });
    showToast('Job request passed to nearby helper.');
  };

  const sendChatMessage = (text) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const senderRole = role === 'partner' ? 'partner' : 'member';
    const newMsg = { sender: senderRole, text: text.trim(), time: timeStr, ts: Date.now() };

    if (isFirebaseConfigured && activeOrder.orderId) {
      push(ref(db, `chats/${toDbKey(activeOrder.orderId)}/messages`), newMsg);
    } else {
      setMessages(prev => [...prev, { id: Date.now(), ...newMsg }]);

      // Simulated auto-reply — offline demo fallback only, real chat has no bot reply
      setTimeout(() => {
        const replyRole = senderRole === 'member' ? 'partner' : 'member';
        setMessages(prev => [
          ...prev,
          {
            id: Date.now() + 1,
            sender: replyRole,
            text: 'Got it! I am right outside your apartment gate.',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 1800);
    }
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        language,
        setLanguage,
        location,
        setLocation,
        isLocationModalOpen,
        setIsLocationModalOpen,
        authUser,
        authLoading,
        partnerKyc,
        signUp,
        signIn,
        logout,
        requestPasswordReset,
        userProfile,
        updateUserProfile,
        partnerProfile,
        updatePartnerProfile,
        notificationsEnabled,
        setNotificationsEnabled,
        changePassword,
        selectedHelper,
        setSelectedHelper,
        selectedService,
        setSelectedService,
        selectedDate,
        setSelectedDate,
        selectedTime,
        setSelectedTime,
        trustFee,
        activeOrder,
        setActiveOrder,
        partnerLocation,
        isSharingLocation,
        startSharingLocation,
        stopSharingLocation,
        liveDistanceKm,
        liveEtaMinutes,
        destinationCoords: DESTINATION_COORDS,
        isFirebaseConfigured,
        isPartnerOnline,
        partnerStats,
        hasIncomingJob,
        incomingCountdown,
        incomingJobDetails,
        notifications,
        addNotification,
        markNotificationsRead,
        reviews,
        isChatOpen,
        setIsChatOpen,
        chatPartner,
        setChatPartner,
        messages,
        isEmergencyModalOpen,
        setIsEmergencyModalOpen,
        toastMessage,
        showToast,
        navigateTo,
        handleSelectMember,
        handleSelectPartner,
        handleBookHelper,
        handleVoiceBooking,
        handleProceedToPayment,
        handleConfirmBooking,
        advanceOrderStatus,
        verifyArrivalOtp,
        verifyCompletionOtp,
        submitRating,
        togglePartnerDuty,
        acceptIncomingJob,
        declineIncomingJob,
        sendChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
