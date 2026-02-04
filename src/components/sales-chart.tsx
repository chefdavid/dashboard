'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { DailySales, LOCATIONS } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface SalesChartProps {
  data: DailySales[];
  title?: string;
}

export function SalesChart({ data, title = 'Sales Trend' }: SalesChartProps) {
  // Group data by date
  const chartData = data.reduce((acc, sale) => {
    const existing = acc.find(d => d.date === sale.date);
    if (existing) {
      if (sale.location === 'hill_donut') {
        existing.hill_donut = sale.net_sales;
      } else {
        existing.red_barn = sale.net_sales;
        existing.online = sale.online_sales || 0;
      }
    } else {
      acc.push({
        date: sale.date,
        dateLabel: format(parseISO(sale.date), 'MMM d'),
        hill_donut: sale.location === 'hill_donut' ? sale.net_sales : 0,
        red_barn: sale.location === 'red_barn' ? sale.net_sales : 0,
        online: sale.location === 'red_barn' ? (sale.online_sales || 0) : 0,
      });
    }
    return acc;
  }, [] as { date: string; dateLabel: string; hill_donut: number; red_barn: number; online: number }[]);
  
  // Sort by date
  chartData.sort((a, b) => a.date.localeCompare(b.date));
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorHillDonut" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4a574" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d4a574" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorRedBarn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#c41e3a" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#c41e3a" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="dateLabel" 
                tick={{ fontSize: 12 }}
                tickLine={false}
              />
              <YAxis 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="hill_donut" 
                name="🍩 Hill Donut" 
                stroke="#d4a574" 
                fillOpacity={1} 
                fill="url(#colorHillDonut)" 
              />
              <Area 
                type="monotone" 
                dataKey="red_barn" 
                name="🍔 Red Barn (POS)" 
                stroke="#c41e3a" 
                fillOpacity={1} 
                fill="url(#colorRedBarn)" 
              />
              <Area 
                type="monotone" 
                dataKey="online" 
                name="🌐 Red Barn (Online)" 
                stroke="#2563eb" 
                fillOpacity={1} 
                fill="url(#colorOnline)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
