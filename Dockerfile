# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
RUN npm ci

# Copy frontend source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy server package files and install dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/dist ./dist

# Copy production server
COPY server/production.js ./server/index.js

EXPOSE 3001

CMD ["node", "server/index.js"]
