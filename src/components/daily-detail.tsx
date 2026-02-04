'use client';
import { DailySales, LOCATIONS } from '@/lib/types';
import { X, Banknote, CreditCard, Globe, Store } from 'lucide-react';

interface DailyDetailProps { sale: DailySales; onClose: () => void; }

export function DailyDetail({ sale, onClose }: DailyDetailProps) {
  const location = LOCATIONS.find(l => l.id === sale.location);
  const formatCurrency = (v: number) => `$${v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const grandTotal = sale.net_sales + (sale.online_sales || 0);
  const isRedBarn = sale.location === 'red_barn';
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 text-white rounded-t-xl" style={{ backgroundColor: location?.color || '#333' }}>
          <div className="flex justify-between items-start">
            <div>
              <div className="text-3xl mb-1">{location?.emoji}</div>
              <h2 className="text-xl font-bold">{location?.short_name}</h2>
              <p className="text-white/80">{new Date(sale.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1"><X className="h-6 w-6" /></button>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold">{formatCurrency(grandTotal)}</div>
            <div className="text-white/80 text-sm">Grand Total</div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Sales Breakdown for Red Barn */}
          {isRedBarn && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Sales Breakdown</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="flex items-center gap-2 text-gray-700"><Store className="h-4 w-4" /> POS Sales</span>
                  <span className="font-bold text-lg">{formatCurrency(sale.net_sales)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="flex items-center gap-2 text-blue-700"><Globe className="h-4 w-4" /> Online Sales</span>
                  <span className="font-bold text-lg text-blue-700">{formatCurrency(sale.online_sales || 0)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-100 rounded-lg border-2 border-green-500">
                  <span className="font-semibold text-green-800">GRAND TOTAL</span>
                  <span className="font-bold text-xl text-green-700">{formatCurrency(grandTotal)}</span>
                </div>
              </div>
              {sale.online_order_count !== undefined && sale.online_order_count > 0 && (
                <div className="mt-2 text-sm text-blue-600">
                  {sale.online_order_count} online orders • Avg: {formatCurrency((sale.online_sales || 0) / sale.online_order_count)}
                </div>
              )}
              {sale.online_failed_count !== undefined && sale.online_failed_count > 0 && (
                <div className="mt-1 text-sm text-red-500">⚠️ {sale.online_failed_count} failed orders</div>
              )}
            </div>
          )}
          
          {/* Payment Breakdown */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">POS Payment Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-600"><Banknote className="h-4 w-4" /> Cash</span><span className="font-semibold">{formatCurrency(sale.cash_sales)}</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-600"><CreditCard className="h-4 w-4" /> Credit Card</span><span className="font-semibold">{formatCurrency(sale.credit_card_sales)}</span></div>
              <div className="flex justify-between"><span className="flex items-center gap-2 text-gray-600"><CreditCard className="h-4 w-4" /> CC Tips</span><span className="font-semibold text-orange-600">{formatCurrency(sale.credit_card_tips)}</span></div>
            </div>
          </div>
          
          {/* Metrics */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-sm text-gray-500">POS Checks</div><div className="text-xl font-bold">{sale.check_count}</div></div>
              <div className="bg-gray-50 rounded-lg p-3"><div className="text-sm text-gray-500">Avg Check</div><div className="text-xl font-bold">{formatCurrency(sale.check_average)}</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
