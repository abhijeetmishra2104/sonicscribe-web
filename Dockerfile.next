# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy Prisma schema FIRST (needed for `prisma generate`)
COPY prisma ./prisma

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (this will trigger `prisma generate`)
RUN npm install

# Copy the rest of the app (including your .env, tsconfig, etc.)
COPY . .

# Optional: Migrate & deploy
RUN npx prisma generate
RUN npx prisma migrate deploy

# Expose port and start app
EXPOSE 3000
CMD ["npm", "run", "dev"]
