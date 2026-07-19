# Dev-mode Dockerfile — hot reload via a bind mount (see docker-compose.yml
# at the repo root). For an actual production image, add a second
# multi-stage build ("build" -> "production") the same way backend/Dockerfile
# does, using `next build` + `next start` instead of `next dev`.
FROM node:20-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
