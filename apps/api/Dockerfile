FROM node:22-alpine AS base

FROM base AS build

RUN apk add --no-cache gcompat
WORKDIR /app

RUN npm install --global pnpm@9.12.1
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @haamil/api build

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

# Copy the entire node_modules directory structure
COPY --from=build --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=build --chown=hono:nodejs /app/apps/api/node_modules /app/apps/api/node_modules
COPY --from=build --chown=hono:nodejs /app/apps/api/dist /app/apps/api/dist
COPY --from=build --chown=hono:nodejs /app/apps/api/package.json /app/apps/api/package.json

USER hono
EXPOSE 3001

CMD ["node", "/app/apps/api/dist/index.js"]
