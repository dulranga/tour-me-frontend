# TourMe Frontend

A platform connecting tourists with reliable drivers. Create itineraries, get competitive bids, and travel with confidence.

## What is this project?

This is the frontend for **TourMe**, a multi-role platform that allows:

- **Tourists**: Create itineraries, receive driver bids, manage trips, view receipts
- **Drivers**: Bid on tourist requests, manage trip schedules, verify vehicles
- **Admins**: Oversee disputes, manage users, monitor all activity

### Key Features

- Multi-role authentication (Tourist, Driver, Admin)
- Real-time bidding system for trips
- Dashboard interfaces for each user role
- Map integration for route visualization
- Secure payment and dispute management

## How to Run It

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start development server**:

   ```bash
   npm run dev
   ```

   - Runs on port `8012` by default
   - Requires backend API running at `http://localhost:8010`

3. **Build for production**:

   ```bash
   npm run build
   ```

4. **Preview production build**:
   ```bash
   npm run preview
   ```

## How to Make Changes

### Adding New Routes

Routes use file-based routing with TanStack Router. To add a new page:

1. Create a `.tsx` file in `src/routes/` (e.g., `new-page.tsx`)
2. Export a route using `createFileRoute`
3. The route will be automatically available at `/new-page`

Example:

```tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/new-page')({
  component: NewPageComponent,
})

function NewPageComponent() {
  return <div>New Page</div>
}
```

### Adding Components

- Place reusable UI in `src/components/`
- Follow existing naming conventions (e.g., ` HeroSection.tsx`, `DashboardShell.tsx`)
- Use Tailwind CSS for styling
- Check `src/components/ui/` for pre-built UI primitives

### Modifying Authentication

- Edit `src/lib/auth.ts` for auth logic
- Dashboard redirects are handled in `src/routes/dashboard.tsx`

## Architecture & Folder Structure

```
src/
├── routes/                 # File-based routing (each file = a route)
│   ├── index.tsx          # Home page
│   ├── dashboard.tsx      # Dashboard layout & redirects
│   ├── about.tsx          # Static pages
│   └── dashboard/         # Role-specific dashboards
│       ├── tourist/       # Tourist dashboard routes
│       ├── driver/        # Driver dashboard routes
│       └── admin/         # Admin dashboard routes
├── components/            # Reusable UI components
│   ├── home/             # Landing page sections
│   ├── dashboard/        # Dashboard-specific components
│   ├── auth/             # Authentication forms
│   └── ui/               # UI primitives (Button, Card, Dialog)
├── lib/                  # Core application logic
│   ├── api/              # API client functions
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Helper functions
└── styles.css            # Tailwind CSS imports
```

### Key Files

| File                      | Purpose                         |
| ------------------------- | ------------------------------- |
| `src/router.tsx`          | Router configuration            |
| `src/routes/__root.tsx`   | Root layout (HTML structure)    |
| `src/lib/api/client.ts`   | API request utilities           |
| `src/lib/AuthContext.tsx` | Authentication context provider |

## Development Guidelines

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run preview  # Preview production build
npm run test     # Run tests (Vitest)
npm run lint     # Run ESLint
npm run format   # Check Prettier formatting
npm run check    # Format and fix with Prettier + ESLint
```

### Code Quality

- Run `npm run check` before committing
- Tests use Vitest with React Testing Library
- Follow existing code patterns and naming conventions

### Environment Variables

Configure in `.env`:

```
VITE_API_BASE_URL=http://localhost:8010
```

## Dependencies

### Main

- React 19, React DOM 19
- TanStack Router (file-based routing)
- TanStack Query (data fetching)
- Tailwind CSS (styling)
- Radix UI (accessible UI primitives)
- Leaflet (maps)
- Zod (validation)

### Development

- TypeScript, Vite, ESLint, Prettier
- Vitest (testing)

## Notes for Contributors

1. **API Integration**: The frontend expects a backend API at `VITE_API_BASE_URL`
2. **Role-based Access**: Dashboards redirect based on user role (tourist/driver/admin)
3. **Map Features**: Uses OSRM for routing (see `src/lib/osrm.ts`)
4. **UI Components**: Built with Radix UI primitives + Tailwind
5. **File Structure**: Do not modify auto-generated files like `routeTree.gen.ts`

## Learn More

- [TanStack Router Documentation](https://tanstack.com/router)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
