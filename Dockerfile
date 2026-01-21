# Use official Node.js 20 LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json tsconfig.json ./
RUN npm install --frozen-lockfile

# Copy source files
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Expose app port
EXPOSE 3000

# Dev command by default
CMD ["npm", "run", "dev"]
