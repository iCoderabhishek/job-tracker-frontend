FROM node:20-alpine
WORKDIR /app

# Enable pnpm
RUN corepack enable

# Install dependencies first for better caching
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the Next.js app
RUN pnpm build

EXPOSE 3000

# Start the application in production mode
CMD ["pnpm", "start"]
