FROM node:24-bookworm-slim AS build
WORKDIR /build
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN NODE_ENV=development HMR_PORT=9001 npm run build

FROM node:24-bookworm-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force
COPY --from=build --chown=node:node /build/.medusa/server/ ./
RUN mkdir -p static && chown node:node static
USER node
EXPOSE 9000
CMD ["npm", "run", "start"]
