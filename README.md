# PDF Reader with Text-to-Speech

A web application that allows users to read PDFs page by page with integrated Text-to-Speech (TTS) functionality for audio playback.

## Features

- PDF document upload and storage
- Page-by-page PDF viewing
- Text-to-Speech functionality for each page
- Document management and organization
- Responsive design for various screen sizes

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS
- **Backend**: Next.js Route Handlers and Next.js Server Components
- **Database**: PostgreSQL (via Prisma ORM)
- **Storage**: Vercel Blob Storage for PDF files
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Vercel account (for Blob storage)

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
NEXT_PUBLIC_PLAY_AI_KEY=your_play_ai_key
NEXT_PUBLIC_USER_ID=your_user_id
DATABASE_URL=your_postgres_connection_string
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd pdf-viewer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up the database:
```bash
npx prisma generate or npm run generate-schema
npx prisma migrate or npm run migrate
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Design Decisions

1. [Your design decision #1]
2. [Your design decision #2]
3. [Your design decision #3]
...

