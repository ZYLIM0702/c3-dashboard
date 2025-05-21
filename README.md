# C3 Dashboard

A modern, open-source Next.js dashboard for device and network management, built for humanitarian and field operations. Features real-time device monitoring, map and mesh network visualizations, team and alert management, and seamless integration with Supabase.

## Features

- **Device Management**: Add, view, edit, and delete devices. Monitor device status, battery, and location.
- **Team Management**: CRUD operations for teams, including leader assignment and member tracking.
- **Alert & Event Management**: View, acknowledge, and resolve alerts. Track system events and incidents.
- **Map & Mesh Network Visualization**: Embedded OpenStreetMap and 3D globe visualizations for network and device locations.
- **Analytics & System Health**: Overview charts, device status breakdowns, and system health metrics.
- **Supabase Integration**: Uses Supabase for authentication, database, and real-time data.
- **Modern UI**: Built with Next.js App Router, Tailwind CSS, and Radix UI components. Fully responsive and dark mode ready.

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn/bun)
- [Supabase](https://supabase.com/) project (free tier is sufficient)

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/c3-dashboard.git
   cd c3-dashboard
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Configure environment variables:**
   Create a `.env.local` file in the project root:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
   Get these values from your Supabase project dashboard.

4. **Run the development server:**
   ```bash
   pnpm dev
   # or npm run dev, yarn dev, bun dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Deploy on Vercel (Recommended)

1. **Push your code to GitHub.**
2. Go to [Vercel](https://vercel.com/new) and import your repository.
3. Set the following environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will handle builds and hosting automatically.

### Manual Deployment

- **Docker:** (Optional, add Dockerfile if needed)
- **Other platforms:** Any platform that supports Node.js and environment variables can run this dashboard.

## Project Structure

- `app/` — Next.js App Router pages and layouts
- `components/` — UI and dashboard components
- `lib/` — Utility functions and Supabase service
- `services/` — Client-side Supabase service
- `public/` — Static assets
- `styles/` — Global styles (Tailwind CSS)

## Contributing

Contributions are welcome! Please open issues or pull requests for bug fixes, features, or improvements.

1. Fork the repo and create your branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -m 'Add some feature'`
3. Push to your fork: `git push origin feature/your-feature`
4. Open a pull request on GitHub

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Made with ❤️ using Next.js, Supabase, and open-source tools.**
