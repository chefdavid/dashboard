// Mock data for development/demo
import { DailySales, ServerTips, ItemSales } from './types';

// Generate mock daily sales for the past 14 days
export function generateMockDailySales(): DailySales[] {
  const data: DailySales[] = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    
    // Weekend boost
    const weekendMultiplier = (dayOfWeek === 0 || dayOfWeek === 6) ? 1.4 : 1;
    
    // Hill Donut - higher volume
    const hdBase = 800 + Math.random() * 400;
    const hdSales = Math.round(hdBase * weekendMultiplier * 100) / 100;
    const hdCash = Math.round(hdSales * (0.08 + Math.random() * 0.05) * 100) / 100;
    const hdCredit = Math.round((hdSales - hdCash) * 100) / 100;
    const hdTips = Math.round(hdCredit * (0.08 + Math.random() * 0.04) * 100) / 100;
    
    data.push({
      id: `hd-${dateStr}`,
      date: dateStr,
      location: 'hill_donut',
      net_sales: hdSales,
      cash_sales: hdCash,
      credit_card_sales: hdCredit,
      credit_card_tips: hdTips,
      net_cash: Math.round((hdCash - hdTips) * 100) / 100,
      check_count: Math.floor(hdSales / 15) + Math.floor(Math.random() * 10),
      guest_count: Math.floor(hdSales / 12) + Math.floor(Math.random() * 15),
      check_average: Math.round((hdSales / (Math.floor(hdSales / 15) + 5)) * 100) / 100,
      created_at: new Date().toISOString()
    });
    
    // Red Barn - lower volume, has online
    const rbBase = 400 + Math.random() * 300;
    const rbSales = Math.round(rbBase * weekendMultiplier * 100) / 100;
    const rbCash = Math.round(rbSales * (0.05 + Math.random() * 0.08) * 100) / 100;
    const rbCredit = Math.round((rbSales - rbCash) * 100) / 100;
    const rbTips = Math.round(rbCredit * (0.06 + Math.random() * 0.05) * 100) / 100;
    const rbOnline = Math.round((50 + Math.random() * 150) * weekendMultiplier * 100) / 100;
    
    data.push({
      id: `rb-${dateStr}`,
      date: dateStr,
      location: 'red_barn',
      net_sales: rbSales,
      cash_sales: rbCash,
      credit_card_sales: rbCredit,
      credit_card_tips: rbTips,
      net_cash: Math.round((rbCash - rbTips) * 100) / 100,
      check_count: Math.floor(rbSales / 25) + Math.floor(Math.random() * 8),
      guest_count: Math.floor(rbSales / 20) + Math.floor(Math.random() * 10),
      check_average: Math.round((rbSales / (Math.floor(rbSales / 25) + 3)) * 100) / 100,
      online_sales: rbOnline,
      online_order_count: Math.floor(rbOnline / 35) + Math.floor(Math.random() * 3),
      online_failed_count: Math.random() > 0.7 ? Math.floor(Math.random() * 3) : 0,
      created_at: new Date().toISOString()
    });
  }
  
  return data;
}

// Mock server tips
export function generateMockServerTips(): ServerTips[] {
  const data: ServerTips[] = [];
  const today = new Date();
  
  const hdServers = ['Taylor Wilkes', 'Antonio Medina', 'Sarah Johnson'];
  const rbServers = ['Mike Chen', 'Jessica Torres'];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Hill Donut servers
    hdServers.forEach((name, idx) => {
      const cardTips = Math.round((40 + Math.random() * 60) * 100) / 100;
      data.push({
        id: `hd-tips-${dateStr}-${idx}`,
        date: dateStr,
        location: 'hill_donut',
        server_name: name,
        job_title: idx === 1 ? 'Prep' : 'Server',
        cash_tips: 0,
        card_tips: idx === 1 ? 0 : cardTips,
        total_tips: idx === 1 ? 0 : cardTips
      });
    });
    
    // Red Barn servers (sometimes owner-operated = no tips)
    if (Math.random() > 0.3) {
      rbServers.forEach((name, idx) => {
        const cardTips = Math.round((25 + Math.random() * 40) * 100) / 100;
        data.push({
          id: `rb-tips-${dateStr}-${idx}`,
          date: dateStr,
          location: 'red_barn',
          server_name: name,
          job_title: 'Server',
          cash_tips: 0,
          card_tips: cardTips,
          total_tips: cardTips
        });
      });
    }
  }
  
  return data;
}

// Mock top items
export function generateMockItemSales(): ItemSales[] {
  const hdItems = [
    { name: 'Glazed Donut', category: 'Donuts', baseQty: 45, basePrice: 2.50 },
    { name: 'Pancake Stack', category: 'Breakfast', baseQty: 28, basePrice: 12.99 },
    { name: 'Coffee (Large)', category: 'Beverages', baseQty: 65, basePrice: 3.50 },
    { name: 'Bacon Egg & Cheese', category: 'Breakfast', baseQty: 22, basePrice: 9.99 },
    { name: 'Apple Fritter', category: 'Donuts', baseQty: 18, basePrice: 3.99 },
  ];
  
  const rbItems = [
    { name: 'Bacon Barn Burger', category: 'Burgers', baseQty: 15, basePrice: 14.99 },
    { name: 'Classic Burger', category: 'Burgers', baseQty: 12, basePrice: 12.99 },
    { name: 'Bacon Mac Attack', category: 'Burgers', baseQty: 10, basePrice: 15.99 },
    { name: 'Smoked Wings (12ct)', category: 'Appetizers', baseQty: 8, basePrice: 16.99 },
    { name: 'Fresh Lemonade', category: 'Beverages', baseQty: 25, basePrice: 4.50 },
    { name: 'Apple Cider Donuts', category: 'Desserts', baseQty: 20, basePrice: 5.99 },
  ];
  
  const data: ItemSales[] = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    hdItems.forEach((item, idx) => {
      const qty = Math.floor(item.baseQty * (0.7 + Math.random() * 0.6));
      data.push({
        id: `hd-item-${dateStr}-${idx}`,
        date: dateStr,
        location: 'hill_donut',
        item_name: item.name,
        category: item.category,
        quantity_sold: qty,
        gross_sales: Math.round(qty * item.basePrice * 100) / 100
      });
    });
    
    rbItems.forEach((item, idx) => {
      const qty = Math.floor(item.baseQty * (0.6 + Math.random() * 0.8));
      data.push({
        id: `rb-item-${dateStr}-${idx}`,
        date: dateStr,
        location: 'red_barn',
        item_name: item.name,
        category: item.category,
        quantity_sold: qty,
        gross_sales: Math.round(qty * item.basePrice * 100) / 100
      });
    });
  }
  
  return data;
}
