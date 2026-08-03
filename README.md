# Dropdesk Frontend

The official frontend client for Dropdesk, a high-performance, collaborative media sharing workspace designed for teams. 
This repository serves as the user-facing web application that securely interfaces with the [Dropdesk Backend Architecture](https://github.com/iCoderabhishek/Dropdesk).

## Links

- **Live Demo**: https://dropdesk-test.0bhishek.com/
- **Backend Repository**: https://github.com/iCoderabhishek/Dropdesk
- **Video Walkthrough**: https://www.youtube.com/@0bhishekk

## Overview

Built with Next.js 16 and React 19, this client provides a highly responsive, real-time file management interface. It leverages a modern frontend stack to seamlessly handle isolated workspaces, role-based access control, and direct-to-cloud (S3) uploads without taxing the backend infrastructure. 

### Key Features
- **Direct-to-S3 Uploads**: Handles presigned URLs securely, transferring media directly to AWS without bottlenecking the main server.
- **Dynamic Workspaces**: Instant context-switching between different isolated team workspaces.
- **Optimized Performance**: Heavily cached data fetching with React Query (`@tanstack/react-query`).
- **Modern UI/UX**: Sleek, fully responsive design powered by Tailwind CSS v4 and Framer Motion for micro-animations.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State & Data Fetching**: Zustand, React Query
- **Icons & Animations**: HugeIcons, Framer Motion
- **Package Manager**: pnpm

## Local Development Setup

### Prerequisites
- Node.js (v20+)
- pnpm
- Docker & Docker Compose (optional, for containerized local dev)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/iCoderabhishek/Dropdesk-Frontend.git
   cd client-dropdesk
   pnpm install
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory. Configure `NEXT_PUBLIC_API_URL` to point to your backend API instance.

3. **Start the Development Server**
   ```bash
   pnpm dev
   ```
   The application will be accessible at [http://localhost:3000](http://localhost:3000).

## Run with Docker

You can easily spin up the frontend using Docker Compose:

```bash
docker-compose up --build -d
```
The app will run in production mode and map to port `3000`. Ensure you have configured the correct backend URL in the `docker-compose.yaml` environment block.

## Contribution

Contributions are always welcome! Since this is part of a decoupled system:
1. Ensure any new API endpoints are tested against the [Dropdesk Backend](https://github.com/iCoderabhishek/Dropdesk).
2. Follow standard React/Next.js best practices.
3. Open a Pull Request with a clear description of the feature or fix.

## License

This project is licensed under the ISC License.
