FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# prisma.config.ts requires DATABASE_URL to be set just to parse the schema — generate
# never connects to it, so a placeholder is fine at build time.
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
RUN npx prisma generate
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/package.json ./package.json

EXPOSE 8000
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]
