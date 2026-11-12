// Complete Domain Types for ACubeX Marketplace Prototype

export type RoleType =
  | 'CUSTOMER'
  | 'WORKER'
  | 'SUPER_ADMIN'
  | 'DISPUTES_VERIFICATION'
  | 'ACCOUNTS_FINANCE'
  | 'OPERATIONS_SUPPORT';

export type WorkerVerificationStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'REJECTED'
  | 'RESUBMISSION_REQUIRED';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'WORKER_ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED';

export type PaymentStatus =
  | 'PENDING'
  | 'PAID'
  | 'REFUNDED'
  | 'FAILED'
  | 'CANCELLED';

export type PaymentMethodType = 'UPI' | 'CARD' | 'NET_BANKING' | 'CASH_ON_DELIVERY';

export type DisputeStatus =
  | 'OPEN'
  | 'IN_REVIEW'
  | 'ESCALATED'
  | 'RESOLVED'
  | 'DISMISSED';

export type SettlementStatus =
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'ADJUSTED'
  | 'DISPUTED'
  | 'OVERDUE';

export interface UserAddress {
  id: string;
  label: string; // 'Home', 'Office', 'Other'
  street: string;
  area: string; // e.g. 'Koramangala 4th Block'
  city: string; // 'Bengaluru'
  pincode: string;
  isDefault?: boolean;
}

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: RoleType;
  availableRoles: RoleType[]; // e.g. ['CUSTOMER', 'WORKER'] for linked account
  activeMode?: 'CUSTOMER' | 'WORKER'; // Current mode for linked account
  addresses: UserAddress[];
  createdAt: string;
  // Worker-specific linked profile if exists
  workerProfileId?: string;
  adminStaffId?: string;
}

export interface VerificationDocument {
  id: string;
  type: 'GOVERNMENT_ID' | 'TRADE_CERTIFICATE' | 'POLICE_CLEARANCE' | 'ADDRESS_PROOF';
  fileName: string;
  uploadedAt: string;
  verified: boolean;
  notes?: string;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  email: string;
  avatarUrl: string;
  headline: string;
  about: string;
  primaryCategory: string;
  skills: string[];
  experienceYears: number;
  hourlyRate: number;
  baseFare: number;
  rating: number;
  reviewCount: number;
  completedJobsCount: number;
  serviceAreas: string[]; // ['Koramangala', 'HSR Layout', 'Indiranagar', 'Bellandur']
  languages: string[]; // ['Kannada', 'English', 'Hindi', 'Tamil']
  isOnline: boolean; // Availability toggle
  verificationStatus: WorkerVerificationStatus;
  verificationNotes?: string;
  verificationSubmittedAt?: string;
  verificationReviewedAt?: string;
  verificationReviewedBy?: string;
  documents: VerificationDocument[];
  joinedDate: string;
  bankDetails: {
    accountHolder: string;
    bankName: string;
    accountNumberMasked: string;
    ifscCode: string;
    upiId: string;
  };
}

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string; // icon identifier
  description: string;
  isActive: boolean;
  baseCommissionPct: number; // e.g. 15%
  subcategories: ServiceSubcategory[];
}

export interface ServiceSubcategory {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  estimatedDuration: string;
  startingPrice: number;
  isActive: boolean;
}

export interface BookingTimelineEvent {
  id: string;
  timestamp: string;
  status: BookingStatus;
  actor: string; // 'Customer', 'Worker', 'Admin (Vikram Rao)', 'System'
  note: string;
}

export interface BookingAttachment {
  id: string;
  name: string;
  type: string;
  url?: string;
}

export interface Booking {
  id: string;
  referenceNumber: string; // e.g. 'ACX-BLR-2026-8812'
  customerId: string;
  customerName: string;
  customerPhone: string;
  workerId?: string; // null if open broadcast / unassigned
  workerName?: string;
  workerPhone?: string;
  workerAvatar?: string;
  categoryId: string;
  categoryName: string;
  subcategoryId?: string;
  serviceName: string;
  serviceArea: string;
  address: UserAddress;
  scheduledDate: string;
  scheduledTimeSlot: string;
  description: string;
  attachments?: BookingAttachment[];
  status: BookingStatus;
  timeline: BookingTimelineEvent[];
  // Pricing breakdown
  estimatedBaseFare: number;
  platformFee: number; // e.g. ₹50
  estimatedTaxes: number;
  totalEstimatedAmount: number;
  finalAmount?: number;
  commissionPct: number; // e.g. 15%
  commissionAmount?: number; // e.g. ₹150
  workerPayoutAmount?: number; // e.g. ₹850
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethodType;
  paymentTransactionId?: string;
  isDisputed?: boolean;
  disputeId?: string;
  hasCustomerReviewed?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentTransaction {
  id: string;
  transactionRef: string; // 'TXN-DEMO-947192'
  bookingId: string;
  bookingRef: string;
  customerId: string;
  customerName: string;
  workerId?: string;
  workerName?: string;
  amount: number;
  platformFee: number;
  commissionAmount: number;
  workerPayoutAmount: number;
  paymentMethod: PaymentMethodType;
  status: PaymentStatus;
  isRefunded: boolean;
  refundAmount?: number;
  refundReason?: string;
  refundedAt?: string;
  refundedBy?: string;
  gatewayMockRef: string;
  createdAt: string;
}

export interface SettlementRecord {
  id: string;
  settlementRef: string; // 'SET-2026-BLR-0041'
  workerId: string;
  workerName: string;
  periodStart: string;
  periodEnd: string;
  grossBookingsAmount: number;
  totalCommissionDeducted: number;
  adjustmentsAmount: number; // e.g. penalty or dispute adjustment
  netPayoutAmount: number;
  status: SettlementStatus;
  batchDate: string;
  paidAt?: string;
  bankReference?: string;
}

export interface ReviewItem {
  id: string;
  bookingId: string;
  workerId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  tags?: string[]; // 'Punctual', 'Clean Work', 'Polite'
}

export interface DisputeCase {
  id: string;
  caseRef: string; // 'DSP-8821'
  bookingId: string;
  bookingRef: string;
  openedByUserId: string;
  openedByName: string;
  openedByRole: 'CUSTOMER' | 'WORKER';
  againstUserId: string;
  againstName: string;
  reason: string;
  description: string;
  evidenceAttachments: string[];
  status: DisputeStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  internalNotes: {
    id: string;
    authorName: string;
    timestamp: string;
    text: string;
  }[];
  resolutionNotes?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CUSTOMER' | 'WORKER' | 'ADMIN';
  text: string;
  timestamp: string;
  isRead: boolean;
  attachmentName?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'VERIFICATION' | 'DISPUTE' | 'SYSTEM';
  targetRoute?: string;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: RoleType;
  action: string;
  targetType: 'WORKER_VERIFICATION' | 'FINANCE_REFUND' | 'FINANCE_SETTLEMENT' | 'DISPUTE_RESOLUTION' | 'COMMISSION_RULE' | 'STAFF_ROLE' | 'CATEGORY_MGMT';
  targetId: string;
  details: string;
  ipAddressDemo: string;
}

export interface AdminStaffMember {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  department: string;
  isActive: boolean;
  lastActive: string;
}

export interface ServiceAreaZone {
  id: string;
  zoneName: string; // 'Bengaluru South', 'Bengaluru East', etc.
  localities: string[]; // ['Koramangala', 'HSR Layout', 'BTM Layout']
  activeWorkerCount: number;
  status: 'ACTIVE' | 'HIGH_DEMAND' | 'EXPANDING';
}

export interface CommissionRule {
  id: string;
  categoryName: string;
  percentage: number;
  effectiveFrom: string;
  isProvisional: boolean; // Always labelled provisional / illustrative
  notes: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountPct: number;
  maxDiscount: number;
  minBookingAmount: number;
  validUntil: string;
  isActive: boolean;
  usageCount: number;
}

