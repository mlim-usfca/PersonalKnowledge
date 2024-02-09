# Step 1: Build the React application
FROM node:16-alpine as build

# Set the working directory in the container
RUN pwd
WORKDIR /app

# Copy the package.json and package-lock.json (or yarn.lock)
COPY ./react/package*.json ./
# If you're using yarn, copy yarn.lock and use yarn install below

# Install dependencies
RUN npm install
# For yarn, use: RUN yarn install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY ./react .

# Build the app
RUN npm run build
RUN ls -l
# For yarn, use: RUN yarn build

# Step 2: Serve the app using nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 to the Docker host, so we can access it 
# from the outside.
EXPOSE 80

# Use the default command of nginx to start the server.
# It automatically starts nginx with the default config
# which is to serve content from /usr/share/nginx/html.
