// Demo dataset for the country → state → city cascade — in production this
// should plug into a real geo API instead of this fixed object.
export const LOCATION_DATA = {
  India: {
    Maharashtra: ['Pune', 'Mumbai', 'Nagpur'],
    Karnataka: ['Bengaluru', 'Mysuru'],
    Delhi: ['New Delhi'],
  },
  'United States': {
    California: ['Los Angeles', 'San Francisco'],
    'New York': ['New York City', 'Buffalo'],
  },
  'United Kingdom': {
    England: ['London', 'Manchester'],
  },
};

export const DIAL_CODES = ['+91', '+1', '+44', '+971', '+61', '+65'];

export const THEME_GRADIENTS = [
  { value: 'linear-gradient(135deg,#1d4ed8,#7C3AED)', isPremium: false }, // Blue-Purple
  { value: 'linear-gradient(135deg,#0f172a,#1d4ed8)', isPremium: false }, // Dark Blue
  { value: 'linear-gradient(135deg,#065f46,#059669)', isPremium: false }, // Green
  { value: 'linear-gradient(135deg,#dc2626,#f97316)', isPremium: false }, // Orange-Red
  { value: 'linear-gradient(135deg,#0891b2,#06b6d4)', isPremium: true },  // Cyan (Pro)
  { value: 'linear-gradient(135deg,#1a1a2e,#16213e)', isPremium: true },  // Dark Indigo (Pro)
  { value: 'linear-gradient(135deg,#db2777,#9333ea)', isPremium: true },  // Pink-Purple (Pro)
  { value: 'linear-gradient(135deg,#d97706,#f59e0b)', isPremium: true },  // Gold (Pro)
];
