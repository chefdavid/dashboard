// Data types for the sales dashboard

export interface DailySales {
  id: string;
  date: string; // YYYY-MM-DD
  location: 'hill_donut' | 'red_barn';
  
  // Sales totals
  net_sales: number;
  cash_sales: number;
  credit_card_sales: number;
  
  // Tips
  credit_card_tips: number;
  
  // Cash reconciliation
  net_cash: number;
  
  // Guest metrics
  check_count: number;
  guest_count: number;
  check_average: number;
  
  // Online orders (Red Barn only)
  online_sales?: number;
  online_order_count?: number;
  online_failed_count?: number;
  
  // Timestamps
  created_at: string;
}

export interface ServerTips {
  id: string;
  date: string;
  location: 'hill_donut' | 'red_barn';
  server_name: string;
  job_title: string;
  cash_tips: number;
  card_tips: number;
  total_tips: number;
}

export interface ItemSales {
  id: string;
  date: string;
  location: 'hill_donut' | 'red_barn';
  item_name: string;
  category: string;
  quantity_sold: number;
  gross_sales: number;
}

export interface LocationInfo {
  id: 'hill_donut' | 'red_barn';
  name: string;
  short_name: string;
  city: string;
  emoji: string;
  color: string;
}

export const LOCATIONS: LocationInfo[] = [
  {
    id: 'hill_donut',
    name: 'Hill Donut Co & Pancake House',
    short_name: 'Hill Donut',
    city: 'Wilmington, DE',
    emoji: '🍩',
    color: '#d4a574'
  },
  {
    id: 'red_barn',
    name: 'Red Barn Burgers',
    short_name: 'Red Barn',
    city: 'Mullica Hill, NJ',
    emoji: '🍔',
    color: '#c41e3a'
  }
];

export interface DateRange {
  from: Date;
  to: Date;
}

// Aggregated data for charts
export interface SalesSummary {
  total_net_sales: number;
  total_cash_sales: number;
  total_credit_sales: number;
  total_tips: number;
  total_online_sales: number;
  total_checks: number;
  average_check: number;
  days_count: number;
}
