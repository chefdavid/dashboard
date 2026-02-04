-- 322 BBQ Dashboard Schema

-- Daily sales data from SpotOn POS
CREATE TABLE IF NOT EXISTS daily_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('hill_donut', 'red_barn')),
  
  -- Sales totals
  net_sales DECIMAL(10,2) DEFAULT 0,
  cash_sales DECIMAL(10,2) DEFAULT 0,
  credit_card_sales DECIMAL(10,2) DEFAULT 0,
  
  -- Tips
  credit_card_tips DECIMAL(10,2) DEFAULT 0,
  
  -- Cash reconciliation  
  net_cash DECIMAL(10,2) DEFAULT 0,
  
  -- Guest metrics
  check_count INTEGER DEFAULT 0,
  guest_count INTEGER DEFAULT 0,
  check_average DECIMAL(10,2) DEFAULT 0,
  
  -- Online orders (Red Barn only)
  online_sales DECIMAL(10,2) DEFAULT 0,
  online_order_count INTEGER DEFAULT 0,
  online_failed_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint per location per day
  UNIQUE(date, location)
);

-- Server tips breakdown
CREATE TABLE IF NOT EXISTS server_tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('hill_donut', 'red_barn')),
  server_name TEXT NOT NULL,
  job_title TEXT,
  cash_tips DECIMAL(10,2) DEFAULT 0,
  card_tips DECIMAL(10,2) DEFAULT 0,
  total_tips DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(date, location, server_name)
);

-- Item sales for top sellers
CREATE TABLE IF NOT EXISTS item_sales (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  location TEXT NOT NULL CHECK (location IN ('hill_donut', 'red_barn')),
  item_name TEXT NOT NULL,
  category TEXT,
  quantity_sold INTEGER DEFAULT 0,
  gross_sales DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(date, location, item_name)
);

-- Enable Row Level Security
ALTER TABLE daily_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE server_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_sales ENABLE ROW LEVEL SECURITY;

-- Allow read access for anon users (dashboard)
CREATE POLICY "Allow read access" ON daily_sales FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON server_tips FOR SELECT USING (true);
CREATE POLICY "Allow read access" ON item_sales FOR SELECT USING (true);

-- Allow full access for service role (data sync)
CREATE POLICY "Allow service role full access" ON daily_sales FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON server_tips FOR ALL USING (true);
CREATE POLICY "Allow service role full access" ON item_sales FOR ALL USING (true);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_daily_sales_date ON daily_sales(date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_sales_location ON daily_sales(location);
CREATE INDEX IF NOT EXISTS idx_server_tips_date ON server_tips(date DESC);
CREATE INDEX IF NOT EXISTS idx_item_sales_date ON item_sales(date DESC);
