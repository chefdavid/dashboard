'use client';

import { useState, useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Globe,
  Calendar
} from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { SalesChart } from '@/components/sales-chart';
import { TopItems } from '@/components/top-items';
import { LocationComparison } from '@/components/location-comparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  generateMockDailySales, 
  generateMockItemSales 
} from '@/lib/mock-data';
import { LOCATIONS } from '@/lib/types';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('14d');
  
  // In production, this would fetch from Supabase
  const salesData = useMemo(() => generateMockDailySales(), []);
  const itemsData = useMemo(() => generateMockItemSales(), []);
  
  // Filter data by date range
  const filteredSales = useMemo(() => {
    const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return salesData.filter(s => new Date(s.date) >= cutoff);
  }, [salesData, dateRange]);
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSales = filteredSales.reduce((sum, s) => sum + s.net_sales, 0);
    const totalOnline = filteredSales.reduce((sum, s) => sum + (s.online_sales || 0), 0);
    const totalTips = filteredSales.reduce((sum, s) => sum + s.credit_card_tips, 0);
    const totalChecks = filteredSales.reduce((sum, s) => sum + s.check_count, 0);
    const avgCheck = totalChecks > 0 ? totalSales / totalChecks : 0;
    const daysCount = new Set(filteredSales.map(s => s.date)).size;
    const dailyAvg = daysCount > 0 ? totalSales / daysCount : 0;
    
    return {
      totalSales,
      totalOnline,
      totalTips,
      totalChecks,
      avgCheck,
      dailyAvg
    };
  }, [filteredSales]);
  
  const formatCurrency = (value: number) => 
    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="text-2xl">🍩🍔</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">322 BBQ Dashboard</h1>
                <p className="text-xs text-gray-500">Hill Donut • Red Barn Burgers</p>
              </div>
            </div>
            
            {/* Date Range Selector */}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['7d', '14d', '30d'] as const).map((range) => (
                  <Button
                    key={range}
                    variant={dateRange === range ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDateRange(range)}
                    className="text-xs"
                  >
                    {range === '7d' ? '7 Days' : range === '14d' ? '14 Days' : '30 Days'}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <KPICard
            title="Total Sales"
            value={formatCurrency(kpis.totalSales)}
            icon={DollarSign}
            color="#16a34a"
            trend={{ value: 12.5, label: 'vs last period' }}
          />
          <KPICard
            title="Daily Average"
            value={formatCurrency(kpis.dailyAvg)}
            icon={TrendingUp}
            color="#2563eb"
          />
          <KPICard
            title="Online Sales"
            value={formatCurrency(kpis.totalOnline)}
            subtitle="Red Barn website"
            icon={Globe}
            color="#7c3aed"
          />
          <KPICard
            title="CC Tips"
            value={formatCurrency(kpis.totalTips)}
            icon={CreditCard}
            color="#ea580c"
          />
          <KPICard
            title="Total Checks"
            value={kpis.totalChecks.toLocaleString()}
            icon={Users}
            color="#0891b2"
          />
          <KPICard
            title="Avg Check"
            value={formatCurrency(kpis.avgCheck)}
            icon={DollarSign}
            color="#65a30d"
          />
        </div>
        
        {/* Sales Chart */}
        <div className="mb-8">
          <SalesChart data={filteredSales} />
        </div>
        
        {/* Location Tabs */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="hill_donut">🍩 Hill Donut</TabsTrigger>
            <TabsTrigger value="red_barn">🍔 Red Barn</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              <LocationComparison data={filteredSales} />
              <TopItems data={itemsData} location="all" />
            </div>
          </TabsContent>
          
          <TabsContent value="hill_donut">
            <div className="grid lg:grid-cols-2 gap-6">
              <TopItems data={itemsData} location="hill_donut" />
              <div className="space-y-4">
                {filteredSales
                  .filter(s => s.location === 'hill_donut')
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 7)
                  .map(sale => (
                    <div key={sale.id} className="bg-white rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{new Date(sale.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="text-sm text-gray-500">{sale.check_count} checks</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(sale.net_sales)}</div>
                          <div className="text-xs text-gray-500">Tips: {formatCurrency(sale.credit_card_tips)}</div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>💵 Cash: {formatCurrency(sale.cash_sales)}</span>
                        <span>💳 Card: {formatCurrency(sale.credit_card_sales)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="red_barn">
            <div className="grid lg:grid-cols-2 gap-6">
              <TopItems data={itemsData} location="red_barn" />
              <div className="space-y-4">
                {filteredSales
                  .filter(s => s.location === 'red_barn')
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .slice(0, 7)
                  .map(sale => (
                    <div key={sale.id} className="bg-white rounded-lg border p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">{new Date(sale.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                          <div className="text-sm text-gray-500">{sale.check_count} checks</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">{formatCurrency(sale.net_sales)}</div>
                          <div className="text-xs text-gray-500">Tips: {formatCurrency(sale.credit_card_tips)}</div>
                        </div>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>💵 Cash: {formatCurrency(sale.cash_sales)}</span>
                        <span>💳 Card: {formatCurrency(sale.credit_card_sales)}</span>
                        {sale.online_sales && sale.online_sales > 0 && (
                          <span className="text-blue-600">🌐 Online: {formatCurrency(sale.online_sales)}</span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Data synced from SpotOn POS + Red Barn Website • Last updated: {new Date().toLocaleString()}
        </div>
      </footer>
    </div>
  );
}
