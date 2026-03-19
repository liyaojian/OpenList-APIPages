FROM node:lts-bookworm-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json webpack.config.cjs ./
COPY public ./public
COPY src ./src
RUN npm run build-js

FROM node:lts-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000
CMD ["node", "dist/bundle.js"]
