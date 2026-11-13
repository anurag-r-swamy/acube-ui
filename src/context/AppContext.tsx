import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DemoUser,
  WorkerProfile,
  ServiceCategory,
  Booking,
  BookingStatus,
  PaymentStatus,
  PaymentTransaction,
  PaymentMethodType,
  SettlementRecord,
  ReviewItem,
  DisputeCase,
  DisputeStatus,
  ChatMessage,
  NotificationItem,
  AuditLogEntry,
  AdminStaffMember,
  ServiceAreaZone,
  CommissionRule,
  PromoCode,
  RoleType,
  WorkerVerificationStatus,
  UserAddress,
} from '../types';
import {
  SEED_USERS,
  SEED_WORKER_PROFILES,
  SEED_CATEGORIES,
  SEED_BOOKINGS,
  SEED_TRANSACTIONS,
  SEED_SETTLEMENTS,
  SEED_DISPUTES,
  SEED_REVIEWS,
  SEED_CHAT_MESSAGES,
  SEED_NOTIFICATIONS,
  SEED_AUDIT_LOG,
  SEED_ADMIN_STAFF,
  SEED_SERVICE_AREAS,
  SEED_COMMISSION_RULES,
  SEED_PROMO_CODES,
} from '../mock/seedData';
import { APP_CONFIG } from '../config/branding';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface AppContextType {
  // Demo Personas & Auth Simulation
  users: DemoUser[];
  currentUser: DemoUser;
  switchPersona: (userId: string) => void;
  switchUserMode: (mode: 'CUSTOMER' | 'WORKER') => void;
  becomeWorker: (profileData: Partial<WorkerProfile>) => WorkerProfile;
  registerUser: (data: { name: string; email: string; phone: string; area: string; role?: RoleType }) => DemoUser;

  // Auth & Login Modals State
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD';
  setAuthModalMode: (mode: 'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD') => void;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  isWorkerRegModalOpen: boolean;
  setIsWorkerRegModalOpen: (open: boolean) => void;

  // Domain state
  workerProfiles: WorkerProfile[];
  currentWorkerProfile?: WorkerProfile;
  categories: ServiceCategory[];
  bookings: Booking[];
  transactions: PaymentTransaction[];
  settlements: SettlementRecord[];
  reviews: ReviewItem[];
  disputes: DisputeCase[];
  chatMessages: ChatMessage[];
  notifications: NotificationItem[];
  auditLogs: AuditLogEntry[];
  adminStaff: AdminStaffMember[];
  serviceAreas: ServiceAreaZone[];
  commissionRules: CommissionRule[];
  promoCodes: PromoCode[];

  // Location simulation
  selectedLocation: string;
  locationPermission: 'PROMPT' | 'GRANTED' | 'DENIED';
  setLocationPermission: (status: 'PROMPT' | 'GRANTED' | 'DENIED') => void;
  setSelectedLocation: (loc: string) => void;

  // Customer actions
  createBooking: (newBookingData: Partial<Booking>) => Booking;
  cancelBooking: (bookingId: string, reason: string, actor: string) => void;
  confirmBookingCompletion: (bookingId: string) => void;
  submitReview: (review: Omit<ReviewItem, 'id' | 'createdAt'>) => void;
  submitDispute: (dispute: Omit<DisputeCase, 'id' | 'caseRef' | 'status' | 'internalNotes' | 'createdAt' | 'updatedAt'>) => DisputeCase;

  // Worker actions
  toggleWorkerOnline: (workerId: string) => boolean;
  acceptBookingOpportunity: (bookingId: string, workerId: string) => void;
  updateWorkerJobLifecycle: (bookingId: string, newStatus: BookingStatus, note: string) => void;
  updateWorkerProfile: (workerId: string, updates: Partial<WorkerProfile>) => void;

  // Admin actions
  updateWorkerVerification: (
    workerId: string,
    status: WorkerVerificationStatus,
    reason: string
  ) => void;
  updateDisputeStatus: (
    disputeId: string,
    status: DisputeStatus,
    resolutionNotes?: string,
    internalNote?: string
  ) => void;
  addDisputeInternalNote: (disputeId: string, noteText: string) => void;
  issueSimulatedRefund: (transactionId: string, reason: string) => void;
  releaseSimulatedSettlement: (settlementId: string) => void;
  toggleCategoryStatus: (categoryId: string) => void;
  updateCategoryCommission: (categoryId: string, percentage: number) => void;
  sendSimulatedNotification: (title: string, message: string, targetRole?: string) => void;

  // Communication & Chat
  sendChatMessage: (bookingId: string, text: string, attachmentName?: string) => void;
  markMessagesRead: (bookingId: string) => void;

  // Notifications
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;

  // Navigation & UI
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
  viewMode: 'MOBILE_CONTAINER' | 'RESPONSIVE_FULL';
  setViewMode: (mode: 'MOBILE_CONTAINER' | 'RESPONSIVE_FULL') => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', title?: string) => void;
  removeToast: (id: string) => void;

  // State Persistence & Reset
  resetDemoData: () => void;
}

const STORAGE_KEY = 'acubex_marketplace_prototype_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or seeds
  const loadInitialState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to parse localStorage demo state, falling back to seeds.', e);
    }
    return null;
  };

  const initial = loadInitialState();

  const [users, setUsers] = useState<DemoUser[]>(initial?.users || SEED_USERS);
  const [currentUserId, setCurrentUserId] = useState<string>(initial?.currentUserId || 'user-cust-1');
  const [workerProfiles, setWorkerProfiles] = useState<WorkerProfile[]>(initial?.workerProfiles || SEED_WORKER_PROFILES);
  const [categories, setCategories] = useState<ServiceCategory[]>(initial?.categories || SEED_CATEGORIES);
  const [bookings, setBookings] = useState<Booking[]>(initial?.bookings || SEED_BOOKINGS);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>(initial?.transactions || SEED_TRANSACTIONS);
  const [settlements, setSettlements] = useState<SettlementRecord[]>(initial?.settlements || SEED_SETTLEMENTS);
  const [reviews, setReviews] = useState<ReviewItem[]>(initial?.reviews || SEED_REVIEWS);
  const [disputes, setDisputes] = useState<DisputeCase[]>(initial?.disputes || SEED_DISPUTES);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initial?.chatMessages || SEED_CHAT_MESSAGES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initial?.notifications || SEED_NOTIFICATIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initial?.auditLogs || SEED_AUDIT_LOG);
  const [adminStaff, setAdminStaff] = useState<AdminStaffMember[]>(initial?.adminStaff || SEED_ADMIN_STAFF);
  const [serviceAreas, setServiceAreas] = useState<ServiceAreaZone[]>(initial?.serviceAreas || SEED_SERVICE_AREAS);
  const [commissionRules, setCommissionRules] = useState<CommissionRule[]>(initial?.commissionRules || SEED_COMMISSION_RULES);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>(initial?.promoCodes || SEED_PROMO_CODES);

  // Active Location simulation
  const [selectedLocation, setSelectedLocation] = useState<string>(initial?.selectedLocation || 'Koramangala 4th Block, Bengaluru');
  const [locationPermission, setLocationPermission] = useState<'PROMPT' | 'GRANTED' | 'DENIED'>(initial?.locationPermission || 'GRANTED');

  // Navigation & View
  const [currentRoute, setCurrentRoute] = useState<string>(initial?.currentRoute || '/customer');
  const [viewMode, setViewMode] = useState<'MOBILE_CONTAINER' | 'RESPONSIVE_FULL'>('MOBILE_CONTAINER');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth & Login modal states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'WELCOME' | 'SIGN_IN' | 'SIGN_UP' | 'FORGOT_PASSWORD'>('SIGN_UP');
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isWorkerRegModalOpen, setIsWorkerRegModalOpen] = useState<boolean>(false);

  // Current active user
  const currentUser = users.find((u) => u.id === currentUserId) || users[0];
  const currentWorkerProfile = workerProfiles.find((wp) => wp.userId === currentUser.id);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      const stateToPersist = {
        users,
        currentUserId,
        workerProfiles,
        categories,
        bookings,
        transactions,
        settlements,
        reviews,
        disputes,
        chatMessages,
        notifications,
        auditLogs,
        adminStaff,
        serviceAreas,
        commissionRules,
        promoCodes,
        selectedLocation,
        locationPermission,
        currentRoute,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch (e) {
      console.error('Error persisting demo state to localStorage', e);
    }
  }, [
    users,
    currentUserId,
    workerProfiles,
    categories,
    bookings,
    transactions,
    settlements,
    reviews,
    disputes,
    chatMessages,
    notifications,
    auditLogs,
    adminStaff,
    serviceAreas,
    commissionRules,
    promoCodes,
    selectedLocation,
    locationPermission,
    currentRoute,
  ]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Audit Log Helper
  const addAuditLog = (
    action: string,
    targetType: AuditLogEntry['targetType'],
    targetId: string,
    details: string
  ) => {
    const newEntry: AuditLogEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      action,
      targetType,
      targetId,
      details,
      ipAddressDemo: '192.168.1.108 (Simulated)',
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  // Reset Demo Data
  const resetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUsers(SEED_USERS);
    setCurrentUserId('user-cust-1');
    setWorkerProfiles(SEED_WORKER_PROFILES);
    setCategories(SEED_CATEGORIES);
    setBookings(SEED_BOOKINGS);
    setTransactions(SEED_TRANSACTIONS);
    setSettlements(SEED_SETTLEMENTS);
    setReviews(SEED_REVIEWS);
    setDisputes(SEED_DISPUTES);
    setChatMessages(SEED_CHAT_MESSAGES);
    setNotifications(SEED_NOTIFICATIONS);
    setAuditLogs(SEED_AUDIT_LOG);
    setAdminStaff(SEED_ADMIN_STAFF);
    setServiceAreas(SEED_SERVICE_AREAS);
    setCommissionRules(SEED_COMMISSION_RULES);
    setPromoCodes(SEED_PROMO_CODES);
    setSelectedLocation('Koramangala 4th Block, Bengaluru');
    setLocationPermission('GRANTED');
    setCurrentRoute('/customer');
    showToast('Demo data restored to initial seed state.', 'success', 'Reset Complete');
  };

  // Switch Persona
  const switchPersona = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    setCurrentUserId(userId);

    // Direct user to appropriate screen
    if (user.role.endsWith('ADMIN') || user.role.includes('DISPUTES') || user.role.includes('ACCOUNTS') || user.role.includes('OPERATIONS')) {
      setCurrentRoute('/admin');
      showToast(`Switched persona to ${user.name} (${user.role.replace('_', ' ')})`, 'info', 'Persona Switched');
    } else if (user.role === 'WORKER') {
      setCurrentRoute('/worker');
      showToast(`Switched persona to ${user.name} (Worker Mode)`, 'info', 'Persona Switched');
    } else {
      setCurrentRoute('/customer');
      showToast(`Switched persona to ${user.name} (Customer Mode)`, 'info', 'Persona Switched');
    }
  };

  // Switch User Mode (between Customer and Worker for dual-capability accounts)
  const switchUserMode = (mode: 'CUSTOMER' | 'WORKER') => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return { ...u, activeMode: mode };
        }
        return u;
      })
    );

    if (mode === 'WORKER') {
      setCurrentRoute('/worker');
      showToast('Switched to Worker Dashboard mode', 'info');
    } else {
      setCurrentRoute('/customer');
      showToast('Switched to Customer mode', 'info');
    }
  };

  // Register New User (Customer or Worker)
  const registerUser = (data: { name: string; email: string; phone: string; area: string; role?: RoleType }): DemoUser => {
    const newUserId = `user-reg-${Date.now()}`;
    const newUserRole = data.role || 'CUSTOMER';
    const newUser: DemoUser = {
      id: newUserId,
      name: data.name,
      email: data.email,
      phone: data.phone,
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      role: newUserRole,
      availableRoles: [newUserRole],
      activeMode: newUserRole === 'WORKER' ? 'WORKER' : 'CUSTOMER',
      addresses: [
        {
          id: `addr-${Date.now()}`,
          label: 'Home',
          street: '1st Cross, Main Road',
          area: data.area || 'Koramangala 4th Block',
          city: 'Bengaluru',
          pincode: '560034',
          isDefault: true,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUserId);

    if (newUserRole === 'WORKER') {
      const newWpId = `wp-${Date.now()}`;
      const newWp: WorkerProfile = {
        id: newWpId,
        userId: newUserId,
        fullName: data.name,
        phone: data.phone,
        email: data.email,
        avatarUrl: newUser.avatarUrl,
        headline: 'Service Professional Partner',
        about: 'Registered service specialist in Bengaluru.',
        primaryCategory: 'Electrical & Appliances',
        skills: ['General Maintenance', 'Diagnostics'],
        experienceYears: 2,
        hourlyRate: 350,
        baseFare: 199,
        rating: 5.0,
        reviewCount: 0,
        completedJobsCount: 0,
        serviceAreas: [data.area || 'Koramangala'],
        languages: ['Kannada', 'English', 'Hindi'],
        isOnline: true,
        verificationStatus: 'PENDING_REVIEW',
        verificationSubmittedAt: new Date().toISOString(),
        documents: [],
        joinedDate: new Date().toISOString().split('T')[0],
        bankDetails: {
          accountHolder: data.name,
          bankName: 'HDFC Bank',
          accountNumberMasked: '•••• •••• 9944',
          ifscCode: 'HDFC0001048',
          upiId: `${data.name.toLowerCase().replace(/\s+/g, '')}@hdfc`,
        },
      };
      setWorkerProfiles((prev) => [newWp, ...prev]);
      setCurrentRoute('/worker');
    } else {
      setCurrentRoute('/customer');
    }

    showToast(`Account created! Welcome, ${data.name}!`, 'success', 'Registration Successful');
    return newUser;
  };

  // "Become a Worker" journey for an existing customer
  const becomeWorker = (profileData: Partial<WorkerProfile>): WorkerProfile => {
    const newWorkerProfileId = `wp-${Date.now()}`;
    const newProfile: WorkerProfile = {
      id: newWorkerProfileId,
      userId: currentUser.id,
      fullName: currentUser.name,
      phone: currentUser.phone,
      email: currentUser.email,
      avatarUrl: currentUser.avatarUrl,
      headline: profileData.headline || 'Professional Service Specialist',
      about: profileData.about || 'Verified service professional serving Bengaluru localities.',
      primaryCategory: profileData.primaryCategory || 'Electrical & Appliances',
      skills: profileData.skills || ['General Maintenance'],
      experienceYears: profileData.experienceYears || 3,
      hourlyRate: profileData.hourlyRate || 350,
      baseFare: profileData.baseFare || 199,
      rating: 5.0,
      reviewCount: 0,
      completedJobsCount: 0,
      serviceAreas: profileData.serviceAreas || ['Koramangala', 'HSR Layout'],
      languages: profileData.languages || ['Kannada', 'English', 'Hindi'],
      isOnline: false,
      verificationStatus: 'PENDING_REVIEW', // Submitted for admin review!
      verificationSubmittedAt: new Date().toISOString(),
      documents: profileData.documents || [
        {
          id: `doc-${Date.now()}-1`,
          type: 'GOVERNMENT_ID',
          fileName: 'aadhaar_redacted_demo.pdf',
          uploadedAt: new Date().toISOString(),
          verified: false,
          notes: 'Submitted for verification',
        },
      ],
      joinedDate: new Date().toISOString().split('T')[0],
      bankDetails: profileData.bankDetails || {
        accountHolder: currentUser.name,
        bankName: 'HDFC Bank - Koramangala',
        accountNumberMasked: '•••• •••• 8821',
        ifscCode: 'HDFC0001248',
        upiId: `${currentUser.name.toLowerCase().replace(/\s+/g, '')}@hdfcbank`,
      },
    };

    setWorkerProfiles((prev) => [newProfile, ...prev]);

    // Upgrade user to have both roles without duplicating account
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const availableRoles: RoleType[] = Array.from(new Set([...u.availableRoles, 'WORKER']));
          return {
            ...u,
            availableRoles,
            activeMode: 'WORKER',
            workerProfileId: newWorkerProfileId,
          };
        }
        return u;
      })
    );

    // Notify Admins in Verification Queue
    const adminNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-admin-disputes',
      title: 'New Worker Verification Submitted',
      message: `${currentUser.name} submitted onboarding documents for ${newProfile.primaryCategory}.`,
      type: 'VERIFICATION',
      targetRoute: `/admin/verification/${newProfile.id}`,
      targetId: newProfile.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications((prev) => [adminNotif, ...prev]);

    showToast('Worker profile submitted! Status: Pending Review by verification team.', 'success', 'Onboarding Complete');
    setCurrentRoute('/worker');
    return newProfile;
  };

  // Customer: Create Booking
  const createBooking = (newBookingData: Partial<Booking>): Booking => {
    const bookingId = `book-${Date.now()}`;
    const refNum = `ACX-BLR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const baseFare = newBookingData.estimatedBaseFare || 399;
    const platformFee = 49;
    const taxes = Math.round(baseFare * 0.08);
    const total = baseFare + platformFee + taxes;
    const commissionPct = 15;
    const commissionAmount = Math.round((baseFare * commissionPct) / 100);
    const workerPayoutAmount = total - commissionAmount;

    const newBooking: Booking = {
      id: bookingId,
      referenceNumber: refNum,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerPhone: currentUser.phone,
      workerId: newBookingData.workerId,
      workerName: newBookingData.workerName,
      workerPhone: newBookingData.workerPhone,
      workerAvatar: newBookingData.workerAvatar,
      categoryId: newBookingData.categoryId || 'cat-1',
      categoryName: newBookingData.categoryName || 'Electrical & Appliances',
      subcategoryId: newBookingData.subcategoryId,
      serviceName: newBookingData.serviceName || 'General Service Request',
      serviceArea: newBookingData.serviceArea || selectedLocation,
      address: newBookingData.address || currentUser.addresses[0] || {
        id: 'addr-default',
        label: 'Selected Address',
        street: '12th Main Road',
        area: 'Koramangala',
        city: 'Bengaluru',
        pincode: '560034',
      },
      scheduledDate: newBookingData.scheduledDate || new Date().toISOString().split('T')[0],
      scheduledTimeSlot: newBookingData.scheduledTimeSlot || '10:00 AM - 12:00 PM',
      description: newBookingData.description || 'Service request booked via prototype.',
      attachments: newBookingData.attachments || [],
      status: newBookingData.workerId ? 'ACCEPTED' : 'REQUESTED',
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          timestamp: new Date().toISOString(),
          status: 'REQUESTED',
          actor: `Customer (${currentUser.name})`,
          note: 'Booking created with simulated upfront payment hold.',
        },
        ...(newBookingData.workerId
          ? [
              {
                id: `tl-${Date.now()}-2`,
                timestamp: new Date().toISOString(),
                status: 'ACCEPTED' as BookingStatus,
                actor: `Worker (${newBookingData.workerName})`,
                note: `Directly booked with ${newBookingData.workerName}.`,
              },
            ]
          : []),
      ],
      estimatedBaseFare: baseFare,
      platformFee,
      estimatedTaxes: taxes,
      totalEstimatedAmount: total,
      finalAmount: total,
      commissionPct,
      commissionAmount,
      workerPayoutAmount,
      paymentStatus: 'PAID',
      paymentMethod: newBookingData.paymentMethod || 'UPI',
      paymentTransactionId: `txn-demo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create corresponding simulated transaction
    const newTxn: PaymentTransaction = {
      id: newBooking.paymentTransactionId!,
      transactionRef: `TXN-DEMO-${Math.floor(100000 + Math.random() * 900000)}`,
      bookingId: newBooking.id,
      bookingRef: newBooking.referenceNumber,
      customerId: currentUser.id,
      customerName: currentUser.name,
      workerId: newBooking.workerId,
      workerName: newBooking.workerName,
      amount: total,
      platformFee,
      commissionAmount,
      workerPayoutAmount,
      paymentMethod: newBooking.paymentMethod || 'UPI',
      status: 'PAID',
      isRefunded: false,
      gatewayMockRef: `UPI-MOCK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    setBookings((prev) => [newBooking, ...prev]);
    setTransactions((prev) => [newTxn, ...prev]);

    // Send notification to worker if directly assigned, or broadcast
    if (newBooking.workerId) {
      const workerProfile = workerProfiles.find((wp) => wp.id === newBooking.workerId);
      if (workerProfile) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            userId: workerProfile.userId,
            title: 'New Booking Assigned!',
            message: `${currentUser.name} booked "${newBooking.serviceName}" for ${newBooking.scheduledDate}.`,
            type: 'BOOKING',
            targetRoute: `/worker/jobs/${newBooking.id}`,
            targetId: newBooking.id,
            isRead: false,
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    }

    showToast(`Booking ${newBooking.referenceNumber} created successfully!`, 'success', 'Booking Confirmed');
    return newBooking;
  };

  // Cancel Booking
  const cancelBooking = (bookingId: string, reason: string, actor: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = [
            ...b.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              status: 'CANCELLED' as BookingStatus,
              actor,
              note: `Cancelled. Reason: ${reason}`,
            },
          ];
          return {
            ...b,
            status: 'CANCELLED' as BookingStatus,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );
    showToast(`Booking ${bookingId} has been cancelled.`, 'info', 'Booking Cancelled');
  };

  // Customer: Confirm Completion
  const confirmBookingCompletion = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = [
            ...b.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              status: 'COMPLETED' as BookingStatus,
              actor: `Customer (${currentUser.name})`,
              note: 'Customer confirmed job completion. Payment released to worker settlement.',
            },
          ];
          return {
            ...b,
            status: 'COMPLETED' as BookingStatus,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // Update worker stats
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking?.workerId) {
      setWorkerProfiles((prev) =>
        prev.map((wp) => {
          if (wp.id === booking.workerId) {
            return {
              ...wp,
              completedJobsCount: wp.completedJobsCount + 1,
            };
          }
          return wp;
        })
      );
    }

    showToast('Job marked completed! Thank you for confirming.', 'success', 'Work Completed');
  };

  // Submit Review
  const submitReview = (reviewData: Omit<ReviewItem, 'id' | 'createdAt'>) => {
    const newReview: ReviewItem = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);

    // Update booking review flag
    setBookings((prev) =>
      prev.map((b) => (b.id === reviewData.bookingId ? { ...b, hasCustomerReviewed: true } : b))
    );

    // Update worker average rating
    setWorkerProfiles((prev) =>
      prev.map((wp) => {
        if (wp.id === reviewData.workerId) {
          const currentTotal = wp.rating * wp.reviewCount;
          const newCount = wp.reviewCount + 1;
          const newAvg = Number(((currentTotal + reviewData.rating) / newCount).toFixed(2));
          return {
            ...wp,
            rating: newAvg,
            reviewCount: newCount,
          };
        }
        return wp;
      })
    );

    showToast('Review submitted! Thank you for rating the service.', 'success');
  };

  // Submit Dispute / Complaint
  const submitDispute = (
    disputeData: Omit<DisputeCase, 'id' | 'caseRef' | 'status' | 'internalNotes' | 'createdAt' | 'updatedAt'>
  ): DisputeCase => {
    const caseRef = `DSP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newDispute: DisputeCase = {
      ...disputeData,
      id: `dsp-${Date.now()}`,
      caseRef,
      status: 'OPEN',
      internalNotes: [
        {
          id: `in-${Date.now()}`,
          authorName: 'System',
          timestamp: new Date().toISOString(),
          text: `Dispute opened by ${disputeData.openedByName}. Reason: ${disputeData.reason}. Case placed into Disputes & Verification Queue.`,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setDisputes((prev) => [newDispute, ...prev]);

    // Mark booking as disputed
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === disputeData.bookingId) {
          const updatedTimeline = [
            ...b.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              status: 'DISPUTED' as BookingStatus,
              actor: `${disputeData.openedByRole} (${disputeData.openedByName})`,
              note: `Formal dispute lodged (${caseRef}): ${disputeData.reason}`,
            },
          ];
          return {
            ...b,
            status: 'DISPUTED' as BookingStatus,
            isDisputed: true,
            disputeId: newDispute.id,
            timeline: updatedTimeline,
          };
        }
        return b;
      })
    );

    // Notify Disputes Team
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'user-admin-disputes',
        title: 'New Dispute Lodged',
        message: `${disputeData.openedByName} opened Case #${caseRef} on Booking #${disputeData.bookingRef}.`,
        type: 'DISPUTE',
        targetRoute: `/admin/disputes/${newDispute.id}`,
        targetId: newDispute.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`Dispute case #${caseRef} lodged. Our quality assurance team will investigate.`, 'warning', 'Case Submitted');
    return newDispute;
  };

  // Worker: Toggle Online
  const toggleWorkerOnline = (workerId: string): boolean => {
    let nextState = false;
    // Check if worker has active in-progress job
    const hasActiveJob = bookings.some(
      (b) => b.workerId === workerId && (b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED')
    );

    setWorkerProfiles((prev) =>
      prev.map((wp) => {
        if (wp.id === workerId) {
          nextState = !wp.isOnline;
          return { ...wp, isOnline: nextState };
        }
        return wp;
      })
    );

    if (hasActiveJob && !nextState) {
      showToast('Note: You have an active job in progress while switching offline.', 'warning', 'Active Job Notice');
    } else {
      showToast(nextState ? 'You are now Online and eligible for job broadcasts.' : 'You are now Offline.', 'info');
    }
    return nextState;
  };

  // Worker: Accept Booking Broadcast Opportunity
  const acceptBookingOpportunity = (bookingId: string, workerId: string) => {
    const worker = workerProfiles.find((wp) => wp.id === workerId);
    if (!worker) return;

    if (worker.verificationStatus !== 'APPROVED') {
      showToast('Only verified providers can accept job requests.', 'error', 'Verification Required');
      return;
    }

    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = [
            ...b.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              status: 'ACCEPTED' as BookingStatus,
              actor: `Worker (${worker.fullName})`,
              note: `${worker.fullName} accepted this opportunity.`,
            },
          ];
          return {
            ...b,
            workerId: worker.id,
            workerName: worker.fullName,
            workerPhone: worker.phone,
            workerAvatar: worker.avatarUrl,
            status: 'ACCEPTED' as BookingStatus,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // Notify customer
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: booking.customerId,
          title: 'Provider Confirmed!',
          message: `${worker.fullName} has accepted your request for "${booking.serviceName}".`,
          type: 'BOOKING',
          targetRoute: `/customer/bookings/${booking.id}`,
          targetId: booking.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    showToast(`You have accepted booking ${booking?.referenceNumber || bookingId}!`, 'success', 'Job Accepted');
  };

  // Worker: Update Job Lifecycle (Arrived -> In Progress -> Submit for Completion)
  const updateWorkerJobLifecycle = (bookingId: string, newStatus: BookingStatus, note: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === bookingId) {
          const updatedTimeline = [
            ...b.timeline,
            {
              id: `tl-${Date.now()}`,
              timestamp: new Date().toISOString(),
              status: newStatus,
              actor: `Worker (${currentUser.name})`,
              note,
            },
          ];
          return {
            ...b,
            status: newStatus,
            timeline: updatedTimeline,
            updatedAt: new Date().toISOString(),
          };
        }
        return b;
      })
    );

    // Notify customer on status update
    const booking = bookings.find((b) => b.id === bookingId);
    if (booking) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: booking.customerId,
          title: `Job Status: ${newStatus.replace('_', ' ')}`,
          message: note,
          type: 'BOOKING',
          targetRoute: `/customer/bookings/${booking.id}`,
          targetId: booking.id,
          isRead: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }

    showToast(`Job status updated to ${newStatus.replace('_', ' ')}`, 'info');
  };

  // Worker Profile Updates
  const updateWorkerProfile = (workerId: string, updates: Partial<WorkerProfile>) => {
    setWorkerProfiles((prev) =>
      prev.map((wp) => (wp.id === workerId ? { ...wp, ...updates } : wp))
    );
    showToast('Worker profile updated successfully.', 'success');
  };

  // Admin: Update Worker Verification
  const updateWorkerVerification = (
    workerId: string,
    status: WorkerVerificationStatus,
    reason: string
  ) => {
    const worker = workerProfiles.find((wp) => wp.id === workerId);
    if (!worker) return;

    setWorkerProfiles((prev) =>
      prev.map((wp) => {
        if (wp.id === workerId) {
          return {
            ...wp,
            verificationStatus: status,
            verificationNotes: reason,
            verificationReviewedAt: new Date().toISOString(),
            verificationReviewedBy: `${currentUser.name} (${currentUser.role})`,
          };
        }
        return wp;
      })
    );

    addAuditLog(
      `WORKER_VERIFICATION_${status}`,
      'WORKER_VERIFICATION',
      workerId,
      `Changed verification status of ${worker.fullName} to ${status}. Reason: ${reason}`
    );

    // Notify worker
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: worker.userId,
        title: `Verification Status: ${status.replace('_', ' ')}`,
        message: `Decision note: ${reason}`,
        type: 'VERIFICATION',
        targetRoute: '/worker',
        targetId: worker.id,
        isRead: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    showToast(`Worker verification status updated to ${status}.`, 'success', 'Verification Recorded');
  };

  // Admin: Update Dispute Status
  const updateDisputeStatus = (
    disputeId: string,
    status: DisputeStatus,
    resolutionNotes?: string,
    internalNote?: string
  ) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          const notes = [...d.internalNotes];
          if (internalNote) {
            notes.push({
              id: `in-${Date.now()}`,
              authorName: currentUser.name,
              timestamp: new Date().toISOString(),
              text: internalNote,
            });
          }
          return {
            ...d,
            status,
            resolutionNotes: resolutionNotes || d.resolutionNotes,
            resolvedAt: status === 'RESOLVED' || status === 'DISMISSED' ? new Date().toISOString() : d.resolvedAt,
            internalNotes: notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );

    addAuditLog(
      `DISPUTE_STATUS_${status}`,
      'DISPUTE_RESOLUTION',
      disputeId,
      `Dispute case updated to ${status}. Resolution: ${resolutionNotes || 'None'}`
    );

    showToast(`Dispute case updated to ${status}`, 'success');
  };

  const addDisputeInternalNote = (disputeId: string, noteText: string) => {
    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id === disputeId) {
          return {
            ...d,
            internalNotes: [
              ...d.internalNotes,
              {
                id: `in-${Date.now()}`,
                authorName: currentUser.name,
                timestamp: new Date().toISOString(),
                text: noteText,
              },
            ],
            updatedAt: new Date().toISOString(),
          };
        }
        return d;
      })
    );
    showToast('Internal note saved.', 'info');
  };

  // Admin Finance: Issue Simulated Refund
  const issueSimulatedRefund = (transactionId: string, reason: string) => {
    const txn = transactions.find((t) => t.id === transactionId);
    if (!txn) return;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === transactionId) {
          return {
            ...t,
            isRefunded: true,
            status: 'REFUNDED' as PaymentStatus,
            refundAmount: t.amount,
            refundReason: reason,
            refundedAt: new Date().toISOString(),
            refundedBy: `${currentUser.name} (${currentUser.role})`,
          };
        }
        return t;
      })
    );

    // Also update booking payment status
    setBookings((prev) =>
      prev.map((b) => (b.paymentTransactionId === transactionId ? { ...b, paymentStatus: 'REFUNDED' } : b))
    );

    addAuditLog(
      'SIMULATED_REFUND_ISSUED',
      'FINANCE_REFUND',
      transactionId,
      `Simulated refund of ₹${txn.amount} issued for ${txn.bookingRef}. Reason: ${reason}`
    );

    showToast(`Simulated refund of ₹${txn.amount} issued. (Demo payment — no actual funds moved)`, 'success', 'Refund Processed');
  };

  // Admin Finance: Release Simulated Settlement
  const releaseSimulatedSettlement = (settlementId: string) => {
    const setl = settlements.find((s) => s.id === settlementId);
    if (!setl) return;

    const bankRef = `NEFT-MOCK-${Date.now()}`;
    setSettlements((prev) =>
      prev.map((s) => {
        if (s.id === settlementId) {
          return {
            ...s,
            status: 'PAID' as const,
            paidAt: new Date().toISOString(),
            bankReference: bankRef,
          };
        }
        return s;
      })
    );

    addAuditLog(
      'SIMULATED_SETTLEMENT_BATCH_RELEASE',
      'FINANCE_SETTLEMENT',
      settlementId,
      `Simulated payout of ₹${setl.netPayoutAmount} released to ${setl.workerName}. Ref: ${bankRef}`
    );

    showToast(`Simulated settlement #${setl.settlementRef} released to ${setl.workerName}.`, 'success', 'Settlement Released');
  };

  // Admin Ops: Toggle Category
  const toggleCategoryStatus = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, isActive: !cat.isActive } : cat))
    );
    addAuditLog('CATEGORY_TOGGLE_ACTIVE', 'CATEGORY_MGMT', categoryId, `Toggled active state of category.`);
    showToast('Category status updated.', 'info');
  };

  // Admin Ops: Update Category Commission
  const updateCategoryCommission = (categoryId: string, percentage: number) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, baseCommissionPct: percentage } : cat))
    );
    addAuditLog(
      'COMMISSION_RULE_UPDATE',
      'COMMISSION_RULE',
      categoryId,
      `Updated provisional commission to ${percentage}% for category ${categoryId}`
    );
    showToast(`Provisional commission updated to ${percentage}%.`, 'info');
  };

  // Admin Ops: Send Notification Broadcast Simulation
  const sendSimulatedNotification = (title: string, message: string, targetRole: string = 'ALL') => {
    const newNotifs: NotificationItem[] = users.map((u) => ({
      id: `notif-${Date.now()}-${u.id}`,
      userId: u.id,
      title,
      message,
      type: 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
    }));

    setNotifications((prev) => [...newNotifs, ...prev]);
    showToast(`Broadcast sent to ${newNotifs.length} demo users.`, 'success', 'Broadcast Dispatched');
  };

  // Chat: Send Message
  const sendChatMessage = (bookingId: string, text: string, attachmentName?: string) => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role === 'WORKER' ? 'WORKER' : 'CUSTOMER',
      text,
      timestamp: new Date().toISOString(),
      isRead: false,
      attachmentName,
    };
    setChatMessages((prev) => [...prev, newMessage]);
  };

  const markMessagesRead = (bookingId: string) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.bookingId === bookingId ? { ...m, isRead: true } : m))
    );
  };

  // Notifications
  const markNotificationRead = (notifId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
    showToast('All notifications marked as read.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        users,
        currentUser,
        switchPersona,
        switchUserMode,
        becomeWorker,
        registerUser,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        isWorkerRegModalOpen,
        setIsWorkerRegModalOpen,
        workerProfiles,
        currentWorkerProfile,
        categories,
        bookings,
        transactions,
        settlements,
        reviews,
        disputes,
        chatMessages,
        notifications,
        auditLogs,
        adminStaff,
        serviceAreas,
        commissionRules,
        promoCodes,
        selectedLocation,
        locationPermission,
        setLocationPermission,
        setSelectedLocation,
        createBooking,
        cancelBooking,
        confirmBookingCompletion,
        submitReview,
        submitDispute,
        toggleWorkerOnline,
        acceptBookingOpportunity,
        updateWorkerJobLifecycle,
        updateWorkerProfile,
        updateWorkerVerification,
        updateDisputeStatus,
        addDisputeInternalNote,
        issueSimulatedRefund,
        releaseSimulatedSettlement,
        toggleCategoryStatus,
        updateCategoryCommission,
        sendSimulatedNotification,
        sendChatMessage,
        markMessagesRead,
        markNotificationRead,
        markAllNotificationsRead,
        currentRoute,
        setCurrentRoute,
        viewMode,
        setViewMode,
        toasts,
        showToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
