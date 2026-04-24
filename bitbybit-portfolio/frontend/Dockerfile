# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Declare build args — passed in by the CI pipeline per environment.
# These must be declared AFTER FROM to be available during build.
ARG VITE_API_PROXY
ARG VITE_API_BASE

# Make them available to the Vite build as environment variables
ENV VITE_API_PROXY=$VITE_API_PROXY
ENV VITE_API_BASE=$VITE_API_BASE

# Copy package files first for better layer caching
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the production-ready assets (Vite picks up ENV vars at build time)
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output to Nginx's public folder
COPY --from=build /app/dist /usr/share/nginx/html

# SPA config — redirect 404s to index.html for React Router
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
