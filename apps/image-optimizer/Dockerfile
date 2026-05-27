FROM node:20-alpine

WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies (sharp prebuilt binaries match alpine musl automatically)
RUN npm install

# Copy source server
COPY . .

# Expose port
EXPOSE 3002

# Run server
CMD ["npm", "start"]
