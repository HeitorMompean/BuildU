FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN corepack enable 2>/dev/null || true
RUN npm install -g pnpm@10.17.1 --prefix /usr/local 2>/dev/null || true
RUN pnpm install --frozen-lockfile --filter @hs/api...
RUN pnpm --filter @hs/api build
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json
EXPOSE 8080
CMD ["node", "dist/main.js"]
