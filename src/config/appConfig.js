// SBM Job Report Application Configuration

export const CUSTOMER = {
  name: 'SBM',
  fullName: 'SBM Offshore',
  logo: '/sbm-logo.png'
};

export const VESSELS = [
  { id: 'saxi', name: 'Saxi', code: 'SAX' },
  { id: 'mondo', name: 'Mondo', code: 'MON' },
  { id: 'ngoma', name: 'Ngoma', code: 'NGO' }
];

export const TECHNOLOGIES = [
  { id: 'vibration', name: 'Vibration', icon: 'Activity' },
  { id: 'oil', name: 'Oil', icon: 'Droplet' },
  { id: 'thermography', name: 'Thermography', icon: 'Thermometer' },
  { id: 'balancing', name: 'Balancing and Alignment', icon: 'Target' },
  { id: 'visual', name: 'Visual Inspection', icon: 'Eye' }
];

export const TECHNICIANS = [
  { id: 'peet', name: 'Peet Peacock', email: 'peet.peacock@wearcheck.com' },
  { id: 'deon', name: 'Deon Gaarkeuken', email: 'deon.gaarkeuken@wearcheck.com' },
  { id: 'jaco', name: 'Jaco Willer', email: 'jaco.willer@wearcheck.com' },
  { id: 'marcel', name: 'Marcel Schoeman', email: 'marcel.schoeman@wearcheck.com' },
  { id: 'edward', name: 'Edward Pieterse Jnr', email: 'edward.pieterse@wearcheck.com' },
  { id: 'dave', name: 'Dave Viljoen', email: 'dave.viljoen@wearcheck.com' }
];

export const JOB_STATUSES = [
  { id: 'draft', name: 'Draft', color: '#6b7280' },
  { id: 'in_progress', name: 'In Progress', color: '#f59e0b' },
  { id: 'completed', name: 'Completed', color: '#10b981' },
  { id: 'approved', name: 'Approved', color: '#3b82f6' }
];

export const USER_ROLES = [
  { id: 'technician', name: 'Technician', level: 1 },
  { id: 'manager', name: 'Manager', level: 2 },
  { id: 'super_admin', name: 'Super Admin', level: 3 }
];

export const ROLE_PERMISSIONS = {
  technician: {
    canCreateJobCard: true,
    canEditOwnJobCard: true,
    canEditAnyJobCard: false,
    canDeleteJobCard: false,
    canApproveJobCard: false,
    canManageEquipment: false,
    canManageUsers: false,
    canApproveRequests: false,
    canRequestEquipment: true,
    canViewAnalytics: false,
    canViewAllJobCards: false
  },
  manager: {
    canCreateJobCard: true,
    canEditOwnJobCard: true,
    canEditAnyJobCard: true,
    canDeleteJobCard: true,
    canApproveJobCard: true,
    canManageEquipment: true,
    canManageUsers: false,
    canApproveRequests: true,
    canRequestEquipment: true,
    canViewAnalytics: true,
    canViewAllJobCards: true
  },
  super_admin: {
    canCreateJobCard: true,
    canEditOwnJobCard: true,
    canEditAnyJobCard: true,
    canDeleteJobCard: true,
    canApproveJobCard: true,
    canManageEquipment: true,
    canManageUsers: true,
    canApproveRequests: true,
    canRequestEquipment: true,
    canViewAnalytics: true,
    canViewAllJobCards: true
  }
};

export const EQUIPMENT_FILE_MAP = {
  saxi: {
    vibration: 'saxi-equipment.json',
    thermography: 'saxi-thermography.json'
  },
  mondo: {
    vibration: 'mondo-equipment.json',
    thermography: 'mondo-thermography.json'
  },
  ngoma: {
    vibration: 'ngoma-equipment.json',
    thermography: 'ngoma-thermography.json'
  }
};

export const APP_VERSION = '1.0.0';
