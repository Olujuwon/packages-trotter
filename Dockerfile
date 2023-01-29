# ==== CONFIGURE =====
# Use a Node 18 base image
FROM node:19.4.0-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .

# ==== BUILD =====
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm install
# Build the app
RUN npm run build

# ==== RUN =======
# Set the env to "production"
ENV ENV develop
ENV PORT 8080
ENV VERSION 0.0.1
ENV FILE_ENCODING utf8
ENV FILE_PATH /var/lib/dpkg/status
ENV FILE_PATH_ALT sample.txt
# Expose the port on which the app will be running (8080 is the default that `serve` uses)
#EXPOSE 8080
# Start the app
CMD [ "npm", "start" ]
