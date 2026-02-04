'use client';

import { useState, useMemo, useEffect } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Users, 
  CreditCard,
  Globe,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { KPICard } from '@/components/kpi-card';
import { SalesChart } from '@/components/sales-chart';
import { TopItems } from '@/components/top-items';
import { LocationComparison } from '@/components/location-comparison';
import { DailyDetail } from '@/components/daily-detail';
import { OnlineComparison } from '@/components/online-comparison';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { getDailySales } from '@/lib/supabase';
import { generateMockItemSales } from '@/lib/mock-data';
import { DailySales, LOCATIONS } from '@/lib/types';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<'7d' | '14d' | '30d'>('14d');
  const [salesData, setSalesData] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  // Item sales still uses mock data until we build that sync
  const itemsData = useMemo(() => generateMockItemSales(), []);
  
  // Fetch real data from Supabase
  const fetchData = async () => {
    setLoading(true);
    try {
      const days = dateRange === '7d' ? 7 : dateRange === '14d' ? 14 : 30;
      const data = await getDailySales(days);
      setSalesData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [dateRange]);
  
  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalSales = salesData.reduce((sum, s) => sum + s.net_sales, 0);
    const totalOnline = salesData.reduce((sum, s) => sum + (s.online_sales || 0), 0);
    const totalTips = salesData.reduce((sum, s) => sum + s.credit_card_tips, 0);
    const totalChecks = salesData.reduce((sum, s) => sum + s.check_count, 0);
    const avgCheck = totalChecks > 0 ? totalSales / totalChecks : 0;
    const daysCount = new Set(salesData.map(s => s.date)).size;
    const dailyAvg = daysCount > 0 ? totalSales / daysCount : 0;
    
    return {
      totalSales,
      totalOnline,
      totalTips,
      totalChecks,
      avgCheck,
      dailyAvg
    };
  }, [salesData]);
  
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
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={fetchData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
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
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading or Empty State */}
        {loading && salesData.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : salesData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-xl font-semibold text-gray-700">No data yet</h2>
            <p className="text-gray-500 mt-2">Sales data will appear here once synced from SpotOn</p>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <KPICard
                title="Total Sales"
                value={formatCurrency(kpis.totalSales)}
                icon={DollarSign}
                color="#16a34a"
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
              <SalesChart data={salesData} />
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
                  <LocationComparison data={salesData} />
                  <TopItems data={itemsData} location="all" />
                </div>
              </TabsContent>
              
              <TabsContent value="hill_donut">
                <div className="grid lg:grid-cols-2 gap-6">
                  <TopItems data={itemsData} location="hill_donut" />
                  <div className="space-y-4">
                    {salesData
                      .filter(s => s.location === 'hill_donut')
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 7)
                      .map(sale => (
                        <div key={sale.id} className="bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{new Date(sale.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
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
                    {salesData
                      .filter(s => s.location === 'red_barn')
                      .sort((a, b) => b.date.localeCompare(a.date))
                      .slice(0, 7)
                      .map(sale => (
                        <div key={sale.id} className="bg-white rounded-lg border p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="font-medium">{new Date(sale.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
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
                            {sale.online_sales !== undefined && sale.online_sales > 0 && (
                              <span className="text-blue-600">🌐 Online: {formatCurrency(sale.online_sales)}</span>
                            )}
                          </div>
                          {sale.online_failed_count !== undefined && sale.online_failed_count > 0 && (
                            <div className="text-xs text-red-500 mt-1">
                              ⚠️ {sale.online_failed_count} failed online orders
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="border-t bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
          Data synced from SpotOn POS + Red Barn Website
          {lastUpdated && (
            <span> • Last refreshed: {lastUpdated.toLocaleTimeString()}</span>
          )}
        </div>
      </footer>
    </div>
  );
}
