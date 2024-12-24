FROM node:22-alpine AS build

WORKDIR /app

RUN npm install --global pnpm
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm --filter @web build

# Final production image
FROM nginx:alpine

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy only the built assets from Next.js
COPY --from=build /app/apps/web/out .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

