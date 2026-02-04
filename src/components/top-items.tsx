'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ItemSales, LOCATIONS } from '@/lib/types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface TopItemsProps {
  data: ItemSales[];
  location?: 'hill_donut' | 'red_barn' | 'all';
}

export function TopItems({ data, location = 'all' }: TopItemsProps) {
  // Filter by location if specified
  const filteredData = location === 'all' 
    ? data 
    : data.filter(d => d.location === location);
  
  // Aggregate by item
  const aggregated = filteredData.reduce((acc, item) => {
    const key = `${item.location}-${item.item_name}`;
    if (acc[key]) {
      acc[key].quantity_sold += item.quantity_sold;
      acc[key].gross_sales += item.gross_sales;
    } else {
      acc[key] = { ...item };
    }
    return acc;
  }, {} as Record<string, ItemSales>);
  
  // Sort by gross sales and take top 10
  const topItems = Object.values(aggregated)
    .sort((a, b) => b.gross_sales - a.gross_sales)
    .slice(0, 10)
    .map(item => ({
      ...item,
      name: item.item_name,
      sales: Math.round(item.gross_sales * 100) / 100,
      locationInfo: LOCATIONS.find(l => l.id === item.location)
    }));
  
  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Top Selling Items
          {location !== 'all' && (
            <Badge variant="outline">
              {LOCATIONS.find(l => l.id === location)?.emoji} {LOCATIONS.find(l => l.id === location)?.short_name}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={topItems} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" horizontal={false} />
              <XAxis 
                type="number" 
                tickFormatter={formatCurrency}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                width={95}
              />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelStyle={{ fontWeight: 'bold' }}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="sales" name="Sales" radius={[0, 4, 4, 0]}>
                {topItems.map((item, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={item.locationInfo?.color || '#666'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-4 justify-center text-sm">
          {LOCATIONS.map(loc => (
            <div key={loc.id} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ backgroundColor: loc.color }} />
              <span>{loc.emoji} {loc.short_name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
