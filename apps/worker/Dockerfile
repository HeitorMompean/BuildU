FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter @hs/worker...
RUN pnpm --filter @hs/worker build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/apps/worker/dist ./dist
COPY --from=build /app/apps/worker/package.json ./package.json
CMD ["node", "dist/main.js"]
