# 322 BBQ Sales Dashboard

Real-time sales analytics dashboard for Hill Donut Co & Red Barn Burgers.

![Dashboard Preview](https://via.placeholder.com/800x400?text=322+BBQ+Dashboard)

## Features

- 📊 **Real-time KPIs** - Total sales, daily averages, tips, check counts
- 📈 **Sales Trends** - Interactive area charts showing performance over time
- 🏪 **Location Comparison** - Side-by-side metrics for both locations
- 🍔 **Top Selling Items** - See what's performing best
- 🌐 **Online Orders** - Track Red Barn website orders separately
- 📱 **Mobile Friendly** - Works on any device

## Data Sources

- **SpotOn POS** - Point of sale data for both locations
- **Red Barn Website** - Online ordering data (redbarnburgers.com)

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Recharts](https://recharts.org/) - Charts
- [Supabase](https://supabase.com/) - Database (coming soon)

## Deploy to Netlify

1. Push this repo to GitHub
2. Connect to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `.next`
5. Deploy!

Or use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

For production, add these to Netlify:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Data Sync

Data is synced daily via OpenClaw automation:
- Pulls from SpotOn POS reports
- Pulls from Red Barn website admin
- Pushes to Supabase database

---

Built with ❤️ for 322 BBQ
