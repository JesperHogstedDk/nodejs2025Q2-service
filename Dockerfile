# syntax=docker/dockerfile:1
FROM node:lts-alpine
WORKDIR /app
COPY . .
# RUN yarn install --production
RUN yarn install
RUN yarn build
EXPOSE 4000
CMD ["node", "dist/main.js"]