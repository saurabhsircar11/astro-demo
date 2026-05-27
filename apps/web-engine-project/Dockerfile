FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source files
COPY . .

# Expose port
EXPOSE 3001

# Start Astro dev server (which has hot-reloading and behaves exactly like SSR)
CMD ["npm", "run", "dev"]
