# https://hub.docker.com/_/node
FROM node:14-slim

WORKDIR /usr/src/app

COPY package*.json ./

# Install production dependencies.
RUN npm install --only=production

# Copy local code to the container image.
COPY . ./

# Start the server
CMD [ "npm", "start" ]