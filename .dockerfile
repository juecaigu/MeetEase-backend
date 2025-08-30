# ---- build ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY nest-cli.json tsconfig*.json ./
COPY src ./src

RUN pnpm build

# ---- runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PNPM_REGISTRY=https://registry.npmmirror.com

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && \
    pnpm config set registry $PNPM_REGISTRY && \
    pnpm install --frozen-lockfile --prod

COPY --from=builder /app/dist ./dist
COPY .env.prod ./.env.prod

EXPOSE 3000
CMD ["node", "dist/main.js"]