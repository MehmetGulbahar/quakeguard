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

## Contributing

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request
