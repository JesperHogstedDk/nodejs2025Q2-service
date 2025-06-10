# syntax=docker/dockerfile:1
FROM node:lts-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json doc/api.yaml .env ./
RUN npm ci
COPY . .
RUN npm run build

FROM gcr.io/distroless/nodejs:18
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/api.yaml ./doc/api.yaml
CMD ["dist/main.js"]