FROM node:18.17.0 AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-lock.yaml package.json ./

COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter web build

FROM nginx:alpine AS runner

COPY --from=builder /app/apps/web/out /usr/share/nginx/html

EXPOSE 80

# Nginx will start automatically 