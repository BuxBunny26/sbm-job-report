# SBM Job Report Application

A comprehensive job report management system for SBM vessels built with React + Vite.

## Features

- **Job Card Management**: Create, edit, and manage job cards for equipment inspections
- **Equipment Database**: Manage equipment lists for each vessel and technology type
- **User Authentication**: Role-based access control (Technician, Supervisor, Admin)
- **Draft Saving**: Offline draft storage using IndexedDB
- **PDF Generation**: Generate professional job card PDFs
- **Analytics Dashboard**: View statistics and trends
- **KPI Tracking**: Monitor key performance indicators over time
- **Deviation Management**: Track and manage equipment deviations

## Vessels

- **Saxi** (Code: SAX)
- **Mondo** (Code: MON)
- **Ngoma** (Code: NGO)

## Technologies

- Vibration Analysis
- Thermography

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and configure your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase URL and anon key:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Supabase Setup

Create the following tables in your Supabase project:

### user_profiles
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  role TEXT DEFAULT 'technician',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### job_cards
```sql
CREATE TABLE job_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_number TEXT UNIQUE,
  vessel TEXT,
  technology TEXT,
  technician TEXT,
  date DATE,
  status TEXT DEFAULT 'draft',
  equipment JSONB,
  notes TEXT,
  findings TEXT,
  recommendations TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### equipment_requests
```sql
CREATE TABLE equipment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vessel TEXT,
  technology TEXT,
  equipment JSONB,
  requested_by UUID REFERENCES auth.users(id),
  requested_by_email TEXT,
  status TEXT DEFAULT 'pending',
  reviewed_at TIMESTAMP WITH TIME ZONE,
  review_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

### Netlify

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
├── config/              # Configuration files
│   ├── appConfig.js
│   └── supabaseClient.js
├── context/             # React contexts
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx
├── data/                # Equipment JSON data
├── pages/               # Page components
├── services/            # Service modules
│   ├── draftService.js
│   ├── equipmentService.js
│   └── pdfService.js
├── App.jsx
├── main.jsx
└── index.css
```

## User Roles & Permissions

| Permission | Technician | Supervisor | Admin |
|------------|------------|------------|-------|
| Create Job Card | ✓ | ✓ | ✓ |
| Edit Own Job Card | ✓ | ✓ | ✓ |
| Approve Job Card | ✗ | ✓ | ✓ |
| Manage Equipment | ✗ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✓ |
| Approve Requests | ✗ | ✓ | ✓ |
| Request Equipment | ✓ | ✓ | ✓ |
| View Analytics | ✓ | ✓ | ✓ |

## License

© 2026 WearCheck Reliability Solutions
