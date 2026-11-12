import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/branding';
import { RoleType } from '../../types';
import { AccessDenied } from '../common/AccessDenied';
import { AdminDashboard } from './AdminDashboard';
import { AdminVerification } from './AdminVerification';
import { AdminDisputes } from './AdminDisputes';
import { AdminBookings } from './AdminBookings';
import { AdminCustomers } from './AdminCustomers';
import { AdminWorkers } from './AdminWorkers';
import { AdminCategories } from './AdminCategories';
import { AdminServiceAreas } from './AdminServiceAreas';
import { AdminFinance } from './AdminFinance';
import { AdminSupport } from './AdminSupport';
import { AdminStaff } from './AdminStaff';
import { AdminReports } from './AdminReports';
import { AdminAuditLog } from './AdminAuditLog';
import { AdminPromotions } from './AdminPromotions';
import { AdminSettings } from './AdminSettings';
import {
  LayoutDashboard,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Users,
  HardHat,
  FolderTree,
  MapPin,
  CreditCard,
  Headphones,
  UserCheck,
  BarChart3,
  History,
  Tag,
  Settings,
  ChevronRight,
  Search,
  Bell,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
} from 'lucide-react';

export type AdminSection =
  | 'OVERVIEW'
  | 'VERIFICATION'
  | 'DISPUTES'
  | 'BOOKINGS'
  | 'CUSTOMERS'
  | 'WORKERS'
  | 'CATEGORIES'
  | 'SERVICE_AREAS'
  | 'FINANCE'
  | 'SUPPORT'
  | 'STAFF'
  | 'REPORTS'
  | 'AUDIT_LOG'
  | 'PROMOTIONS'
  | 'SETTINGS';

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ReactNode;
  allowedRoles: RoleType[];
  badge?: number;
}

export const AdminLayout: React.FC = () => {
  const {
    currentUser,
    switchPersona,
    setCurrentRoute,
    workerProfiles,
    disputes,
    bookings,
    notifications,
  } = useApp();

  const [currentSection, setCurrentSection] = useState<AdminSection>('OVERVIEW');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Pending counts for badges
  const pendingVerificationsCount = workerProfiles.filter(
    (w) => w.verificationStatus === 'PENDING_REVIEW'
  ).length;

  const openDisputesCount = disputes.filter(
    (d) => d.status === 'OPEN' || d.status === 'IN_REVIEW'
  ).length;

  const inProgressBookingsCount = bookings.filter(
    (b) => b.status === 'IN_PROGRESS' || b.status === 'WORKER_ARRIVED'
  ).length;

  const navItems: NavItem[] = [
    {
      id: 'OVERVIEW',
      label: 'Overview & KPIs',
      icon: <LayoutDashboard className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'DISPUTES_VERIFICATION', 'ACCOUNTS_FINANCE', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'VERIFICATION',
      label: 'Worker Verification',
      icon: <ShieldCheck className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'DISPUTES_VERIFICATION'],
      badge: pendingVerificationsCount > 0 ? pendingVerificationsCount : undefined,
    },
    {
      id: 'DISPUTES',
      label: 'Disputes & Complaints',
      icon: <AlertTriangle className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'DISPUTES_VERIFICATION'],
      badge: openDisputesCount > 0 ? openDisputesCount : undefined,
    },
    {
      id: 'BOOKINGS',
      label: 'Booking Monitor',
      icon: <Calendar className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
      badge: inProgressBookingsCount > 0 ? inProgressBookingsCount : undefined,
    },
    {
      id: 'CUSTOMERS',
      label: 'Customer Directory',
      icon: <Users className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'WORKERS',
      label: 'Worker Directory',
      icon: <HardHat className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT', 'DISPUTES_VERIFICATION'],
    },
    {
      id: 'CATEGORIES',
      label: 'Categories & Services',
      icon: <FolderTree className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'SERVICE_AREAS',
      label: 'Bengaluru Service Areas',
      icon: <MapPin className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'FINANCE',
      label: 'Payments & Settlements',
      icon: <CreditCard className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'ACCOUNTS_FINANCE'],
    },
    {
      id: 'SUPPORT',
      label: 'Support Tickets Desk',
      icon: <Headphones className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'PROMOTIONS',
      label: 'Promo Codes & Incentives',
      icon: <Tag className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'REPORTS',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'ACCOUNTS_FINANCE'],
    },
    {
      id: 'STAFF',
      label: 'Staff & Roles Matrix',
      icon: <UserCheck className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN'], // Super Admin Only!
    },
    {
      id: 'AUDIT_LOG',
      label: 'Privileged Audit Log',
      icon: <History className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'DISPUTES_VERIFICATION', 'ACCOUNTS_FINANCE', 'OPERATIONS_SUPPORT'],
    },
    {
      id: 'SETTINGS',
      label: 'Platform Settings',
      icon: <Settings className="w-4 h-4" />,
      allowedRoles: ['SUPER_ADMIN', 'OPERATIONS_SUPPORT'],
    },
  ];

  // Check if current user role has access to selected section
  const currentNavItem = navItems.find((n) => n.id === currentSection);
  const isAllowed = currentNavItem ? currentNavItem.allowedRoles.includes(currentUser.role) : false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <div className="flex-1 flex overflow-hidden">
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 flex-col bg-brand-charcoal text-white shrink-0 border-r border-gray-800">
          {/* Logo & Portal title */}
          <div className="p-4 border-b border-gray-800/80 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-brand-accent tracking-wider text-xs uppercase">
                  {APP_CONFIG.parentCompany}
                </span>
                <span className="text-gray-500 text-xs">/</span>
                <span className="text-xs font-semibold text-white/90">Admin Console</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">Bengaluru Regional Operations</p>
            </div>
            <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[9px] font-mono">
              Live Mock
            </span>
          </div>

          {/* Active Admin Persona Indicator */}
          <div className="p-3 mx-3 my-2.5 bg-white/5 rounded-xl border border-white/5 flex items-center gap-2.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-lg object-cover border border-white/20"
            />
            <div className="truncate flex-1">
              <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
              <span className="text-[10px] text-brand-accent font-semibold block truncate">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 text-xs">
            {navItems.map((item) => {
              const hasAccess = item.allowedRoles.includes(currentUser.role);
              const isCurrent = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentSection(item.id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-left transition-all ${
                    isCurrent
                      ? 'bg-brand-dark text-white font-bold shadow-xs'
                      : hasAccess
                      ? 'text-gray-300 hover:bg-white/5 hover:text-white'
                      : 'text-gray-500 opacity-60 hover:opacity-100 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={isCurrent ? 'text-brand-accent' : hasAccess ? 'text-gray-400' : 'text-gray-600'}>
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!hasAccess && (
                      <span className="text-[9px] text-amber-500/80 font-mono" title="Restricted for this staff role">
                        🔒
                      </span>
                    )}
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-brand-accent text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          {/* Quick jump to Customer & Worker preview */}
          <div className="p-3 border-t border-gray-800 space-y-1 text-xs">
            <button
              onClick={() => setCurrentRoute('/customer')}
              className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-between text-[11px] transition-colors"
            >
              <span>View Customer App</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>
            <button
              onClick={() => setCurrentRoute('/worker')}
              className="w-full py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-between text-[11px] transition-colors"
            >
              <span>View Worker App</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </aside>

        {/* MOBILE SIDEBAR MODAL */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60">
            <div className="w-64 bg-brand-charcoal text-white flex flex-col p-3 h-full animate-in slide-in-from-left">
              <div className="flex items-center justify-between pb-3 border-b border-gray-800">
                <span className="font-bold text-xs text-brand-accent">Menu</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1 text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-2 space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setCurrentSection(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full py-2 px-3 rounded-xl flex items-center justify-between text-left text-xs ${
                      currentSection === item.id ? 'bg-brand-dark text-white font-bold' : 'text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full bg-brand-accent text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN DESKTOP CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="font-semibold text-gray-900">Admin</span>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-bold text-brand-dark">{currentNavItem?.label}</span>
              </div>
            </div>

            {/* Top Bar Right: Staff Role Indicator & Persona Switcher */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1.5 bg-brand-bg px-2.5 py-1 rounded-lg border border-gray-200 text-xs text-gray-700">
                <Shield className="w-3.5 h-3.5 text-brand-dark" />
                <span>Role:</span>
                <span className="font-bold text-brand-dark">{currentUser.role.replace('_', ' ')}</span>
              </div>

              <button
                onClick={() => setCurrentRoute('/customer')}
                className="py-1 px-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                title="Switch to Mobile App Preview"
              >
                <span>Mobile Preview</span>
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </header>

          {/* Section Body */}
          <div className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
            {!isAllowed && currentNavItem ? (
              <AccessDenied
                requiredRoles={currentNavItem.allowedRoles}
                moduleName={currentNavItem.label}
              />
            ) : (
              <>
                {currentSection === 'OVERVIEW' && (
                  <AdminDashboard
                    onNavigateTo={(sec) => setCurrentSection(sec)}
                  />
                )}
                {currentSection === 'VERIFICATION' && <AdminVerification />}
                {currentSection === 'DISPUTES' && <AdminDisputes />}
                {currentSection === 'BOOKINGS' && <AdminBookings />}
                {currentSection === 'CUSTOMERS' && <AdminCustomers />}
                {currentSection === 'WORKERS' && <AdminWorkers />}
                {currentSection === 'CATEGORIES' && <AdminCategories />}
                {currentSection === 'SERVICE_AREAS' && <AdminServiceAreas />}
                {currentSection === 'FINANCE' && <AdminFinance />}
                {currentSection === 'SUPPORT' && <AdminSupport />}
                {currentSection === 'STAFF' && <AdminStaff />}
                {currentSection === 'REPORTS' && <AdminReports />}
                {currentSection === 'AUDIT_LOG' && <AdminAuditLog />}
                {currentSection === 'PROMOTIONS' && <AdminPromotions />}
                {currentSection === 'SETTINGS' && <AdminSettings />}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

