FROM node:20-alpine

WORKDIR /app

# Install curl for docker healthcheck
RUN apk --no-cache add curl

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8000

CMD ["node", "server.js"]
