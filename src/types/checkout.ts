export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  deviceType: 'PC' | 'MAC';
  deviceBrand: string;
  deviceModel: string;
  customBrand?: string;
  customModel?: string;
  phone?: string;
}

export interface CheckoutState {
  step: 'cart' | 'customer-info' | 'payment' | 'confirmation';
  customerInfo: CustomerInfo | null;
  isProcessing: boolean;
}

export interface DeviceBrand {
  name: string;
  models: string[];
}

export const PC_BRANDS: DeviceBrand[] = [
  {
    name: 'Dell',
    models: ['Inspiron', 'XPS', 'Latitude', 'OptiPlex', 'Precision', 'Alienware', 'Vostro']
  },
  {
    name: 'HP',
    models: ['Pavilion', 'Envy', 'Spectre', 'EliteBook', 'ProBook', 'Omen', 'ZBook']
  },
  {
    name: 'Lenovo',
    models: ['ThinkPad', 'IdeaPad', 'Legion', 'Yoga', 'ThinkCentre', 'IdeaCentre']
  },
  {
    name: 'ASUS',
    models: ['VivoBook', 'ZenBook', 'ROG', 'TUF Gaming', 'ExpertBook', 'ProArt']
  },
  {
    name: 'Acer',
    models: ['Aspire', 'Swift', 'Spin', 'Predator', 'Nitro', 'TravelMate']
  },
  {
    name: 'MSI',
    models: ['Gaming', 'Creator', 'Business', 'Modern', 'Prestige', 'Summit']
  },
  {
    name: 'Microsoft',
    models: ['Surface Pro', 'Surface Laptop', 'Surface Book', 'Surface Studio']
  },
  {
    name: 'Custom Built',
    models: ['Gaming PC', 'Workstation', 'Office PC', 'Home PC', 'Other']
  },
  {
    name: 'Other',
    models: ['Please specify in custom fields below']
  }
];

export const MAC_BRANDS: DeviceBrand[] = [
  {
    name: 'Apple',
    models: [
      'MacBook Air (M1)',
      'MacBook Air (M2)',
      'MacBook Air (M3)',
      'MacBook Pro 13" (M1)',
      'MacBook Pro 13" (M2)',
      'MacBook Pro 14" (M1 Pro/Max)',
      'MacBook Pro 14" (M2 Pro/Max)',
      'MacBook Pro 14" (M3 Pro/Max)',
      'MacBook Pro 16" (M1 Pro/Max)',
      'MacBook Pro 16" (M2 Pro/Max)',
      'MacBook Pro 16" (M3 Pro/Max)',
      'iMac 24" (M1)',
      'iMac 24" (M3)',
      'Mac Mini (M1)',
      'Mac Mini (M2)',
      'Mac Studio (M1 Max/Ultra)',
      'Mac Studio (M2 Max/Ultra)',
      'Mac Pro (Intel)',
      'Mac Pro (M2 Ultra)',
      'iMac Pro (Intel - Discontinued)',
      'MacBook Pro (Intel - Older Models)'
    ]
  },
  {
    name: 'Other',
    models: ['Please specify in custom fields below']
  }
];

// Canadian Provinces and Territories
export const CANADIAN_PROVINCES = [
  { code: 'AB', name: 'Alberta' },
  { code: 'BC', name: 'British Columbia' },
  { code: 'MB', name: 'Manitoba' },
  { code: 'NB', name: 'New Brunswick' },
  { code: 'NL', name: 'Newfoundland and Labrador' },
  { code: 'NS', name: 'Nova Scotia' },
  { code: 'ON', name: 'Ontario' },
  { code: 'PE', name: 'Prince Edward Island' },
  { code: 'QC', name: 'Quebec' },
  { code: 'SK', name: 'Saskatchewan' },
  { code: 'NT', name: 'Northwest Territories' },
  { code: 'NU', name: 'Nunavut' },
  { code: 'YT', name: 'Yukon' }
];

// US States
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
  { code: 'DC', name: 'District of Columbia' }
];