# Stage 1: Build the pure React static bundle with Vite
FROM node:20-alpine AS builder

WORKDIR /app

# Build arguments for frontend environment variables
ARG VITE_API_URL=http://localhost:5000/api
ARG NEXT_PUBLIC_API_URL=http://localhost:5000/api
ENV VITE_API_URL=$VITE_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Install dependencies first for efficient caching
COPY package*.json ./
RUN npm install

# Copy application code and build
COPY . .
RUN npm run build

# Stage 2: Serve using lightweight Nginx
FROM nginx:alpine

# Copy built static export from builder (Vite outputs to /app/dist)
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
