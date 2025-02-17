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

1. **Usage of Server and Client Components**: I used server components for top level pages for better initial page load, and used client components for more interactive and user facing features, as that is where client components shine. I also used dynamic imports (aka lazy loading) to help split app bundle size into smaller chunks for better initial page load and reduced build times.

2. **Preloading of Audio Data**: When a user moves to a new page, once the text ha been parsed by the PDF viewer it attempts to start fetching the audio bundle before the play button is pressed. This woule ensure the audio is ready once the user is ready to use the TTS feature. Although this comes at a cost of an extra call to download audio that the user does not not play, but since the text on the page is large, preloading improves UX. 

3. **File Upload UI**: To improve UX, I leveraged a drag and drop library to help users drag files they might already be looking at instead of having to click and search for a file in their File Explorer (or Finder)
...

