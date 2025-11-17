# Use official Node.js 20 Alpine image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your app
COPY . .

EXPOSE 5000

# Add healthcheck for container
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
	CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the app
CMD ["npm", "start"]