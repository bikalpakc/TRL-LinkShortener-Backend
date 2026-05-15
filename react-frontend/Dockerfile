# Use Node.js to build/run the app
FROM node:20-slim

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Open port 5173 (Vite's default port)
EXPOSE 5173

# Start the development server
# The --host flag is CRITICAL to make Vite accessible outside Docker
CMD ["npm", "run", "dev", "--", "--host"]