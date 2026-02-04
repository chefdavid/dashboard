'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailySales, LOCATIONS, SalesSummary } from '@/lib/types';
import { TrendingUp, Users, CreditCard, Banknote, Globe } from 'lucide-react';

interface LocationComparisonProps {
  data: DailySales[];
}

function calculateSummary(sales: DailySales[]): SalesSummary {
  return sales.reduce((acc, sale) => ({
    total_net_sales: acc.total_net_sales + sale.net_sales,
    total_cash_sales: acc.total_cash_sales + sale.cash_sales,
    total_credit_sales: acc.total_credit_sales + sale.credit_card_sales,
    total_tips: acc.total_tips + sale.credit_card_tips,
    total_online_sales: acc.total_online_sales + (sale.online_sales || 0),
    total_checks: acc.total_checks + sale.check_count,
    average_check: 0, // calculated after
    days_count: acc.days_count + 1
  }), {
    total_net_sales: 0,
    total_cash_sales: 0,
    total_credit_sales: 0,
    total_tips: 0,
    total_online_sales: 0,
    total_checks: 0,
    average_check: 0,
    days_count: 0
  });
}

function StatRow({ 
  label, 
  hdValue, 
  rbValue, 
  format = 'currency',
  icon: Icon 
}: { 
  label: string; 
  hdValue: number; 
  rbValue: number;
  format?: 'currency' | 'number' | 'percent';
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const formatValue = (v: number) => {
    if (format === 'currency') return `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (format === 'percent') return `${v.toFixed(1)}%`;
    return v.toLocaleString();
  };
  
  const total = hdValue + rbValue;
  const hdPercent = total > 0 ? (hdValue / total) * 100 : 50;
  
  return (
    <div className="py-3 border-b last:border-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </span>
        <span className="text-sm font-semibold">{formatValue(total)}</span>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex-1">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${hdPercent}%`,
                backgroundColor: LOCATIONS[0].color
              }}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs">
        <span style={{ color: LOCATIONS[0].color }}>
          🍩 {formatValue(hdValue)}
        </span>
        <span style={{ color: LOCATIONS[1].color }}>
          🍔 {formatValue(rbValue)}
        </span>
      </div>
    </div>
  );
}

export function LocationComparison({ data }: LocationComparisonProps) {
  const hdData = data.filter(d => d.location === 'hill_donut');
  const rbData = data.filter(d => d.location === 'red_barn');
  
  const hdSummary = calculateSummary(hdData);
  const rbSummary = calculateSummary(rbData);
  
  hdSummary.average_check = hdSummary.total_checks > 0 
    ? hdSummary.total_net_sales / hdSummary.total_checks 
    : 0;
  rbSummary.average_check = rbSummary.total_checks > 0 
    ? rbSummary.total_net_sales / rbSummary.total_checks 
    : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Location Comparison</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        <StatRow 
          label="Net Sales" 
          hdValue={hdSummary.total_net_sales} 
          rbValue={rbSummary.total_net_sales}
          icon={TrendingUp}
        />
        <StatRow 
          label="Cash Sales" 
          hdValue={hdSummary.total_cash_sales} 
          rbValue={rbSummary.total_cash_sales}
          icon={Banknote}
        />
        <StatRow 
          label="Credit Sales" 
          hdValue={hdSummary.total_credit_sales} 
          rbValue={rbSummary.total_credit_sales}
          icon={CreditCard}
        />
        <StatRow 
          label="CC Tips" 
          hdValue={hdSummary.total_tips} 
          rbValue={rbSummary.total_tips}
        />
        <StatRow 
          label="Online Sales" 
          hdValue={0} 
          rbValue={rbSummary.total_online_sales}
          icon={Globe}
        />
        <StatRow 
          label="Checks" 
          hdValue={hdSummary.total_checks} 
          rbValue={rbSummary.total_checks}
          format="number"
          icon={Users}
        />
        <StatRow 
          label="Avg Check" 
          hdValue={hdSummary.average_check} 
          rbValue={rbSummary.average_check}
        />
      </CardContent>
    </Card>
  );
}
