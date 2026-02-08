-- Enhanced schema for comprehensive data sync

-- Main daily sales table (enhanced)
CREATE TABLE IF NOT EXISTS daily_sales (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  
  -- Core sales metrics
  revenue DECIMAL(10,2) DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  avg_ticket DECIMAL(10,2) DEFAULT 0,
  
  -- Payment breakdown
  cash_sales DECIMAL(10,2) DEFAULT 0,
  card_sales DECIMAL(10,2) DEFAULT 0,
  tips DECIMAL(10,2) DEFAULT 0,
  
  -- Additional sales metrics
  tax DECIMAL(10,2) DEFAULT 0,
  refunds DECIMAL(10,2) DEFAULT 0,
  discounts DECIMAL(10,2) DEFAULT 0,
  
  -- Labor metrics
  labor_hours DECIMAL(8,2) DEFAULT 0,
  labor_cost DECIMAL(10,2) DEFAULT 0,
  
  -- Online ordering (Red Barn specific)
  online_revenue DECIMAL(10,2) DEFAULT 0,
  online_orders INTEGER DEFAULT 0,
  online_avg_ticket DECIMAL(10,2) DEFAULT 0,
  
  -- Metadata
  raw_data JSONB, -- Store full extracted data
  synced_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date)
);

-- Item sales details
CREATE TABLE IF NOT EXISTS item_sales (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  item_name TEXT NOT NULL,
  category TEXT,
  quantity_sold INTEGER DEFAULT 0,
  revenue DECIMAL(10,2) DEFAULT 0,
  avg_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date, item_name)
);

-- Employee/server details
CREATE TABLE IF NOT EXISTS employee_sales (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  employee_name TEXT NOT NULL,
  employee_id TEXT,
  
  -- Sales performance
  sales DECIMAL(10,2) DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  
  -- Tips
  cash_tips DECIMAL(10,2) DEFAULT 0,
  card_tips DECIMAL(10,2) DEFAULT 0,
  total_tips DECIMAL(10,2) DEFAULT 0,
  
  -- Labor
  hours_worked DECIMAL(6,2) DEFAULT 0,
  hourly_rate DECIMAL(6,2) DEFAULT 0,
  total_pay DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date, employee_name)
);

-- Category performance
CREATE TABLE IF NOT EXISTS category_sales (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  category_name TEXT NOT NULL,
  
  -- Performance metrics
  revenue DECIMAL(10,2) DEFAULT 0,
  quantity_sold INTEGER DEFAULT 0,
  avg_price DECIMAL(10,2) DEFAULT 0,
  percentage_of_sales DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date, category_name)
);

-- Hourly sales breakdown
CREATE TABLE IF NOT EXISTS hourly_sales (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  
  revenue DECIMAL(10,2) DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  avg_ticket DECIMAL(10,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date, hour)
);

-- Payment method breakdown
CREATE TABLE IF NOT EXISTS payment_methods (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  payment_type TEXT NOT NULL, -- 'cash', 'visa', 'mastercard', 'amex', 'discover', 'other'
  
  revenue DECIMAL(10,2) DEFAULT 0,
  transactions INTEGER DEFAULT 0,
  percentage DECIMAL(5,2) DEFAULT 0,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(location_id, date, payment_type)
);

-- Sync log for tracking data pulls
CREATE TABLE IF NOT EXISTS sync_log (
  id SERIAL PRIMARY KEY,
  location_id TEXT NOT NULL,
  date DATE NOT NULL,
  sync_type TEXT NOT NULL, -- 'sales', 'labor', 'items', 'full'
  status TEXT NOT NULL, -- 'success', 'error', 'partial'
  error_message TEXT,
  records_synced INTEGER DEFAULT 0,
  duration_ms INTEGER,
  synced_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_daily_sales_location_date ON daily_sales(location_id, date);
CREATE INDEX IF NOT EXISTS idx_item_sales_location_date ON item_sales(location_id, date);
CREATE INDEX IF NOT EXISTS idx_employee_sales_location_date ON employee_sales(location_id, date);
CREATE INDEX IF NOT EXISTS idx_category_sales_location_date ON category_sales(location_id, date);
CREATE INDEX IF NOT EXISTS idx_hourly_sales_location_date ON hourly_sales(location_id, date);
CREATE INDEX IF NOT EXISTS idx_sync_log_location_date ON sync_log(location_id, date);

-- Updated trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_daily_sales_updated_at BEFORE UPDATE ON daily_sales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();