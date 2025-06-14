# VideoAI - Advanced Video Sharing Platform

VideoAI is a modern video sharing platform built with Next.js, MongoDB, and Tailwind CSS that allows users to upload, share, and discover videos enhanced with AI capabilities.

![VideoAI Platform](public/hero-image.svg)

## Features

- **Video Management**: Upload, view, and manage videos with ease
- **AI-Powered Platform**: Smart video processing and content analysis
- **Responsive Design**: Beautiful UI that works across all devices
- **Modern UX**: Intuitive user experience with real-time feedback
- **Dark/Light Mode**: Full theme support throughout the application

## Tech Stack

- **Frontend**:
  - Next.js 15+ (App Router)
  - React 18+
  - TailwindCSS
  - Framer Motion animations

- **Backend**:
  - Next.js API Routes
  - MongoDB with Mongoose
  - NextAuth.js for authentication

- **Third-party services**:
  - ImageKit for video hosting
  - React Dropzone for file uploads

## Project Structure

```
videoai/
├── app/                    # Next.js App Router
│   ├── api/                # API endpoints
│   │   ├── videos/         # Video-related API routes
│   │   └── auth/           # Authentication API routes
│   ├── components/         # Shared React components
│   │   ├── ui/             # UI components (buttons, inputs, etc.)
│   │   └── ...             # Feature-specific components
│   ├── video/              # Video-related pages
│   │   ├── [id]/           # Video detail page
│   │   └── upload/         # Video upload page
│   ├── profile/            # User profile page
│   └── ...                 # Other pages
├── lib/                    # Utility functions and services
├── models/                 # MongoDB models
├── public/                 # Static assets
└── ...                     # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devashyrangpariya/videoAI.git
   cd videoai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   
   # ImageKit credentials
   NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key
   NEXT_PUBLIC_PRIVATE_KEY=your_imagekit_private_key
   NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment (Vercel)

1. Push your code to GitHub.
2. Create a new project in Vercel.
3. Connect your GitHub repository.
4. Set the following environment variables:
   - `MONGODB_URI=your_mongodb_connection_string`
   - `NEXTAUTH_SECRET=your_nextauth_secret`
   - `NEXT_PUBLIC_PUBLIC_KEY=your_imagekit_public_key`
   - `NEXT_PUBLIC_PRIVATE_KEY=your_imagekit_private_key`
   - `NEXT_PUBLIC_URL_ENDPOINT=your_imagekit_url_endpoint`
5. Click "Deploy" and wait for the deployment to complete.

## Development Guidelines

- **File Naming Conventions**:
  - React Components: PascalCase (e.g., `VideoPlayer.tsx`)
  - Utility functions: camelCase (e.g., `formatDate.ts`)
  - API routes: kebab-case (e.g., `video-stats.ts`)
  
- **Code Style**:
  - Use TypeScript for type safety
  - Follow ESLint and Prettier configurations
  - Write meaningful comments for complex logic
  - Create reusable components and hooks

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- All contributors to the project
