// Central Branding & Configuration
// As specified: "ACubeX is the parent company, not the consumer-facing app name."
// "Consumer-facing name is undecided. Use one configurable placeholder (“Marketplace” or “App Name”) from a central config."

export interface AppBrandingConfig {
  parentCompany: string;
  appDisplayNamePlaceholder: string;
  shortTagline: string;
  cityDefault: string;
  currencySymbol: string;
  currencyCode: string;
  defaultSupportEmail: string;
  defaultSupportPhone: string;
}

export const APP_CONFIG: AppBrandingConfig = {
  parentCompany: 'ACubeX',
  appDisplayNamePlaceholder: 'Marketplace', // Configurable placeholder as required
  shortTagline: 'Verified Local Services on Demand',
  cityDefault: 'Bengaluru, Karnataka',
  currencySymbol: '₹',
  currencyCode: 'INR',
  defaultSupportEmail: 'support-demo@acubex-marketplace.local',
  defaultSupportPhone: '+91 80 4900 1200',
};

