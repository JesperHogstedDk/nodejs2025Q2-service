# syntax=docker/dockerfile:1

FROM node:lts-alpine
WORKDIR /
COPY . .
RUN yarn install --production
CMD ["node", "dist/main.js"]
EXPOSE 4000