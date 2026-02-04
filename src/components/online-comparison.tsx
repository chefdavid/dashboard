'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySales } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  Line,
  ComposedChart
} from 'recharts';
import { format, parseISO } from 'date-fns';

interface OnlineComparisonProps {
  data: DailySales[];
}

export function OnlineComparison({ data }: OnlineComparisonProps) {
  // Get Red Barn data with online orders
  const rbData = data
    .filter(d => d.location === 'red_barn' && d.online_order_count && d.online_order_count > 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(d => ({
      date: d.date,
      dateLabel: format(parseISO(d.date), 'MMM d'),
      onlineSales: d.online_sales || 0,
      orderCount: d.online_order_count || 0,
      avgOrder: d.online_order_count && d.online_order_count > 0 
        ? Math.round(((d.online_sales || 0) / d.online_order_count) * 100) / 100 
        : 0,
      posAvgCheck: d.check_average
    }));
  
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
  
  // Calculate averages
  const avgOnlineOrder = rbData.length > 0 
    ? rbData.reduce((sum, d) => sum + d.avgOrder, 0) / rbData.length 
    : 0;
  const avgPOSCheck = rbData.length > 0 
    ? rbData.reduce((sum, d) => sum + d.posAvgCheck, 0) / rbData.length 
    : 0;
  
  if (rbData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>🌐 Online Order Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">No online order data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>🌐 Online vs In-Store (Red Barn)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-blue-600 mb-1">Avg Online Order</div>
            <div className="text-2xl font-bold text-blue-700">{formatCurrency(avgOnlineOrder)}</div>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-sm text-red-600 mb-1">Avg POS Check</div>
            <div className="text-2xl font-bold text-red-700">{formatCurrency(avgPOSCheck)}</div>
          </div>
        </div>
        
        <div className="text-center text-sm mb-4">
          {avgOnlineOrder > avgPOSCheck ? (
            <span className="text-green-600">
              ✅ Online orders average <strong>{formatCurrency(avgOnlineOrder - avgPOSCheck)}</strong> more than in-store
            </span>
          ) : (
            <span className="text-orange-600">
              📊 In-store checks average <strong>{formatCurrency(avgPOSCheck - avgOnlineOrder)}</strong> more than online
            </span>
          )}
        </div>
        
        {/* Chart */}
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rbData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
              <YAxis 
                yAxisId="left"
                tickFormatter={formatCurrency} 
                tick={{ fontSize: 11 }}
                domain={[0, 'auto']}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fontSize: 11 }}
                domain={[0, 'auto']}
              />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'orderCount') return [value, 'Orders'];
                  return [formatCurrency(Number(value)), name];
                }}
              />
              <Legend />
              <Bar 
                yAxisId="right"
                dataKey="orderCount" 
                name="Online Orders" 
                fill="#93c5fd" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="avgOrder" 
                name="Avg Online Order" 
                stroke="#2563eb" 
                strokeWidth={2}
                dot={{ fill: '#2563eb' }}
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="posAvgCheck" 
                name="Avg POS Check" 
                stroke="#c41e3a" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#c41e3a' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
