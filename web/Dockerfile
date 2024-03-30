# Use the official Node.js 21 image as a parent image
FROM node:21-alpine as builder

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock/pnpm-lock.yaml) files
COPY package*.json ./
# If using yarn or pnpm, uncomment the appropriate line below and comment out the npm ci line
# COPY yarn.lock ./
# COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install
# For yarn, use:
# RUN yarn install
# For pnpm, use:
# RUN pnpm install --frozen-lockfile

# Voume for caching node modules
# VOLUME /app/node_modules

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

RUN npm run build

FROM node:21-alpine

WORKDIR /app

COPY --from=builder /app ./

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
# For yarn, use:
# CMD ["yarn", "dev"]
# For pnpm, use:
# CMD ["pnpm", "run", "dev"]
# For bun, use:
# CMD ["bun", "dev"]

