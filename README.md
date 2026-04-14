# QuakeGuard - Earthquake Monitoring System

QuakeGuard is a modern web application that allows you to monitor earthquakes in Turkey and around the world in real-time. It combines data from multiple sources including Kandilli Observatory, AFAD, USGS, GEOFON, and EMSC to provide users with a comprehensive earthquake monitoring experience.

## Features

- 🌍 **Real-Time Map**: View earthquakes on an interactive map
- 📊 **Multiple Data Sources**: Combine earthquake data from Kandilli Observatory, AFAD, USGS, GEOFON, and EMSC in one platform
- 📱 **Mobile Compatible**: Responsive design that works seamlessly on all devices
- 🌓 **Dark/Light Mode**: Theme options that reduce eye strain
- ⚡ **Instant Updates**: Automatic data updates every 5 minutes
- 🔍 **Detailed Information**: View detailed information for each earthquake
- 📍 **Location-Based**: View earthquakes with their locations on the map
- 🎯 **Filtering**: Filter earthquake data by source

## Technologies

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Shadcn UI
- **Map**: Leaflet
- **State Management**: React Query
- **Animations**: Framer Motion
- **Data Fetching**: Server-side and Client-side fetching
- **Performance**: Vercel Speed Insights

## Getting Started

To start the development server:

```bash
# Install dependencies
npm install

# Start development server
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

You can view the application by opening [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. View recent earthquakes on the home page
2. Switch to the map view to examine earthquakes with their locations
3. Filter the data source as Kandilli, AFAD, USGS, GEOFON, or EMSC
4. Click on the map icon on any earthquake card to view that earthquake on the map
5. Toggle between dark/light mode to customize your experience

## More Information

For more information about Next.js:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - An interactive Next.js tutorial.

## Deployment on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## PWA and Push Notification Setup

QuakeGuard is configured as a Progressive Web App with offline support, install prompt UX,
service worker caching, background sync, and Web Push notifications.

### 1) VAPID Keys

Generate VAPID keys once and set them as environment variables:

```bash
npx web-push generate-vapid-keys
```

Set these in `.env.local` and Vercel project settings:

```bash
NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
VAPID_PRIVATE_KEY=...
VAPID_SUBJECT=mailto:alerts@quakeguard.app
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

### 2) Service Worker

Custom service worker file:

- `public/sw.js`

Implemented features:

- App shell caching (`/`, `/list`, `/map`, `/info`, `/offline`)
- Static asset caching (JS/CSS/font/image)
- API stale-while-revalidate for `/api/earthquakes`
- Map tile caching (`tile.openstreetmap.org`)
- Offline fallback to `/offline`
- Push event handling and notification click routing
- Background sync (`sync-earthquakes`) on reconnect

### 3) Manifest

Static manifest for installability:

- `public/manifest.json`

Includes:

- standalone display mode
- 192x192 and 512x512 icons
- maskable icon
- install screenshots

### 4) Push API Endpoints

- `GET /api/push/vapid-public-key`
- `POST /api/push/subscribe`
- `POST /api/push/unsubscribe`
- `POST /api/push/test`
- `POST /api/push/broadcast`

`/api/push/test` can be used to validate notification delivery in production.
`/api/push/broadcast` sends an alert payload to all active subscriptions.

### 5) Lighthouse Targets

For high PWA Lighthouse score:

- Build with `npm run build`
- Serve with `npm run start`
- Run Lighthouse against production build

Recommended checks:

- Installability
- Service worker active and controlling the page
- Offline route works (`/offline`)
- Push permission and test notification flow

### 6) Notes for Production

- The current subscription store is in-memory and resets on process restart.
- For production reliability, persist subscriptions in a durable database (Postgres/Redis).
- Trigger earthquake alerts from backend events by calling `web-push` with saved subscriptions.
- Keep VAPID private key server-side only.

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request
