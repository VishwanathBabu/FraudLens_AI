
import { TransactionCategory } from './types';

export const CATEGORIES = Object.values(TransactionCategory);

export const STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const JOBS = [
  'Software Engineer', 'Nurse', 'Systems Architect', 'Teacher', 'Graphic Designer',
  'Marketing Manager', 'Chef', 'Accountant', 'Sales Representative', 'Physician',
  'Carpenter', 'Electrician', 'Truck Driver', 'Data Scientist', 'Barista',
  'Project Manager', 'Librarian', 'Pharmacist', 'Attorney', 'Mechanical Engineer'
];

export const MERCHANTS = [
  'fraud_Kroger', 'fraud_Wal-Mart', 'amazon.com', 'starbucks', 'target_pos',
  'netflix_subscription', 'uber_rides', 'shell_gas', 'cvs_pharmacy', 'apple_itunes',
  'ebay_marketplace', 'mcdonalds_pos', 'delta_airlines', 'best_buy_pos', 'home_depot'
];

export const SAMPLE_CITIES = [
  { city: 'New York', state: 'NY', lat: 40.7128, long: -74.0060, pop: 8336000 },
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, long: -118.2437, pop: 3822000 },
  { city: 'Chicago', state: 'IL', lat: 41.8781, long: -87.6298, pop: 2665000 },
  { city: 'Houston', state: 'TX', lat: 29.7604, long: -95.3698, pop: 2302000 },
  { city: 'Phoenix', state: 'AZ', lat: 33.4484, long: -112.0740, pop: 1608000 },
  { city: 'Philadelphia', state: 'PA', lat: 39.9526, long: -75.1652, pop: 1567000 },
  { city: 'San Antonio', state: 'TX', lat: 29.4241, long: -98.4936, pop: 1434000 },
  { city: 'San Diego', state: 'CA', lat: 32.7157, long: -117.1611, pop: 1386000 }
];

export const INITIAL_FORM_DATA = {
  amt: 45.20,
  category: TransactionCategory.GROCERY_POS,
  trans_date_trans_time: new Date().toISOString().slice(0, 16),
  gender: 'F' as const,
  city: 'New York',
  state: 'NY',
  job: 'Software Engineer',
  dob: '1985-05-20',
  merchant: 'fraud_Kroger',
  merch_lat: 40.7128,
  merch_long: -74.0060,
  lat: 40.7306,
  long: -73.9352,
  city_pop: 8000000
};
