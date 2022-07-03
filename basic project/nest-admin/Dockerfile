
# Download node dependencies
FROM node:14.18-slim

# Set working directory in container
WORKDIR /app

# Copy package.json for depencency install
COPY package.json .
COPY ./yarn.lock .
COPY tsconfig.json .
COPY tsconfig.build.json .

# Install dependencies
RUN ["yarn"]

# Copy the rest of the project
COPY /src /src

# Build the project
RUN ["yarn", "build"]

# Start the application
CMD ["yarn", "start"]