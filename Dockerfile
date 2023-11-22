FROM node:lts-alpine as builder

WORKDIR /app

RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build
RUN pnpm install --frozen-lockfile --prod

FROM node:lts-alpine as runner

WORKDIR /app

USER nobody

COPY --chown=nobody:nogroup --from=builder /app/node_modules ./node_modules
COPY --chown=nobody:nogroup --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
