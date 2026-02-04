import { createClient } from '@supabase/supabase-js';
import { DailySales } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://abojvwccmpkxruwvzhbk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFib2p2d2NjbXBreHJ1d3Z6aGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyMTYyMzYsImV4cCI6MjA4NTc5MjIzNn0.KTsuDLagucqDKRILRGi8tMDThFGjnVUEB9v6VbOxN4Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getDailySales(days: number = 14): Promise<DailySales[]> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  const cutoffStr = cutoffDate.toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('daily_sales')
    .select('*')
    .gte('date', cutoffStr)
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching sales:', error);
    return [];
  }
  
  return (data || []).map(row => ({
    id: row.id,
    date: row.date,
    location: row.location as 'hill_donut' | 'red_barn',
    net_sales: Number(row.net_sales),
    cash_sales: Number(row.cash_sales),
    credit_card_sales: Number(row.credit_card_sales),
    credit_card_tips: Number(row.credit_card_tips),
    net_cash: Number(row.net_cash),
    check_count: Number(row.check_count),
    guest_count: Number(row.guest_count),
    check_average: Number(row.check_average),
    online_sales: row.online_sales ? Number(row.online_sales) : undefined,
    online_order_count: row.online_order_count ? Number(row.online_order_count) : undefined,
    online_failed_count: row.online_failed_count ? Number(row.online_failed_count) : undefined,
    created_at: row.created_at
  }));
}
