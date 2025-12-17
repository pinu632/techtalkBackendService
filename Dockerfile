# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for caching)
COPY package*.json ./

# Install only production deps
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start app
CMD ["node", "src/server.js"]
