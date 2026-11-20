FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --filter @hs/admin...
RUN pnpm --filter @hs/admin build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=3000
COPY --from=build /app/apps/admin/.next ./.next
COPY --from=build /app/apps/admin/package.json ./package.json
EXPOSE 3000
CMD ["pnpm", "start"]
