# Use the official Node.js 21 image as a parent image
FROM node:21-alpine as builder

# Set the working directory in the container
WORKDIR /web  

# Copy package.json and the corresponding lock file
COPY package*.json ./
RUN yarn install

# Copy the rest of the application source code
COPY . .

# Build the application
RUN yarn build

# Start a new, final image to reduce size
FROM node:21-alpine
WORKDIR /web
COPY --from=builder /web ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "dev"]
