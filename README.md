# Shelfie Mobile - Buyer App

A React Native mobile application for the Shelfie marketplace platform, built with Expo.

## Features

- 🏠 **Home Screen** - Browse livestock listings and featured farms
- 🔍 **Search Functionality** - Real-time search across listings and farms
- 📱 **Tab Navigation** - Easy navigation between Home, Search, Saved, and Profile
- 🎨 **Modern UI** - Built with NativeWind (TailwindCSS for React Native)
- 📦 **Component Library** - Reusable UI components with class-variance-authority
- 🎯 **Type-Safe** - Full TypeScript support

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (TailwindCSS)
- **Components**: class-variance-authority for variant management
- **Icons**: lucide-react-native
- **Language**: TypeScript

## Project Structure

```
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation screens
│   │   ├── index.tsx        # Home screen
│   │   ├── search.tsx       # Search screen
│   │   ├── saved.tsx        # Saved items screen
│   │   └── profile.tsx      # Profile screen
│   ├── _layout.tsx          # Root layout
│   └── +not-found.tsx       # 404 page
├── components/              # Reusable components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingSpinner.tsx
│   ├── ListingCard.tsx      # Livestock listing card
│   ├── FarmCard.tsx         # Farm card
│   └── LoadingScreen.tsx    # Custom loading screen
├── lib/                     # Utilities and data
│   ├── types/               # TypeScript types
│   │   ├── listing.ts
│   │   └── farm.ts
│   ├── data/                # Mock data
│   │   ├── mockListings.ts
│   │   └── mockFarms.ts
│   └── utils.ts             # Utility functions
└── assets/                  # Static assets

```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- Yarn or npm
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

```bash
# Install dependencies
yarn install

# Start the development server
yarn start

# Run on iOS
yarn ios

# Run on Android
yarn android

# Run on web
yarn web
```

## Brand Colors

- **Primary**: `#D2B48C` (Shelfie beige)
- **Primary Dark**: `#A0826D`
- **Primary Light**: `#E8D4B8`

## Components

### UI Components

All UI components use class-variance-authority for consistent variant management:

- **Button**: Primary, secondary, outline, ghost, and danger variants
- **Input**: Text input with label and error state support
- **Card**: Container component with elevation variants
- **LoadingSpinner**: Animated loading indicator

### Feature Components

- **ListingCard**: Displays livestock listings with image, price, location, and save functionality
- **FarmCard**: Shows farm information with rating and location
- **LoadingScreen**: Custom branded loading screen with logo

## API Integration

The app is integrated with Shelfie APIs:

### API Configuration

Configure API endpoints in `lib/config/api.ts` or use environment variables:

```bash
# .env file
EXPO_PUBLIC_MARKETPLACE_API_URL=https://your-marketplace-api.com
EXPO_PUBLIC_CORE_API_URL=https://your-core-api.com
```

### APIs

- **Marketplace API**: Handles listings, recommendations, searches
- **Core API**: Handles farms, user profiles, authentication

### Available Hooks

#### Listings
```typescript
import { useListings, useListing } from './lib/hooks/useListings';

// Get all listings with filters
const { listings, isLoading } = useListings({ 
  category: 'cattle',
  limit: 20 
});

// Get single listing
const { listing } = useListing(listingId);
```

#### Farms
```typescript
import { useFarms, useTopRatedFarms } from './lib/hooks/useFarms';

// Get all farms
const { farms, isLoading } = useFarms({ limit: 20 });

// Get top rated farms
const { farms } = useTopRatedFarms({ limit: 10 });
```

#### Recommendation Buckets
```typescript
import { useRecommendationBuckets } from './lib/hooks/useRecommendationBuckets';

const { buckets, isLoading } = useRecommendationBuckets();
```

### Mock Data Fallback

If APIs are unavailable, mock data is still available in:
- `lib/data/mockListings.ts`
- `lib/data/mockFarms.ts`

## Search Functionality

The search feature filters both listings and farms in real-time based on:

- Listing title
- Farm name
- Category
- Location
- Breed

Search is performed both server-side (via API) and client-side for instant feedback.

## Next Steps

- [ ] Integrate with real API
- [ ] Add authentication
- [ ] Implement saved items persistence
- [ ] Add listing detail pages
- [ ] Add farm detail pages
- [ ] Implement filters and sorting
- [ ] Add user profile management
- [ ] Implement messaging between buyers and sellers

## License

0BSD

# shelfie-mobile-buyer
