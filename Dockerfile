# Use the official Node.js image as the base image
FROM node:21-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the rest of the application code
COPY . .

# Install dependencies, including Prisma and bcrypt
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Expose the port your Hono app listens on
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
