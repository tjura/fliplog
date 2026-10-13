FROM --platform=$BUILDPLATFORM node:24.21.0-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

FROM dependencies AS development
RUN mkdir /data && chown node:node /app /data
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "run", "dev"]

FROM development AS build
RUN npm run build

FROM node:24.21.0-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS runtime-dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund

FROM node:24.21.0-bookworm-slim@sha256:d6aa754f16b3197301076f047b5def2f02ea1dbbc2ca920407d46d7ec7f87b20 AS production
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=runtime-dependencies --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/tests/*.test.mjs ./tests/
COPY --from=build --chown=node:node /app/scripts/initialize.mjs ./scripts/initialize.mjs
COPY --from=build --chown=node:node /app/scripts/backup.mjs ./scripts/backup.mjs
COPY --from=build --chown=node:node /app/src/server/sqlite.ts /app/src/server/auth-config.ts ./src/server/
COPY --from=build /app/LICENSE ./LICENSE
COPY --from=build /app/THIRD_PARTY_NOTICES.md ./THIRD_PARTY_NOTICES.md
COPY --from=build /app/third_party ./third_party
RUN mkdir /data && chown node:node /data
USER node
EXPOSE 3000
CMD ["sh", "-c", "node scripts/initialize.mjs && exec node server.js"]
