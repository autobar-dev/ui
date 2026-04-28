# Stage 1: Install dependencies
FROM oven/bun:alpine AS deps
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Stage 2: Build the application
FROM oven/bun:alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Set a placeholder that we will replace at runtime
ENV NEXT_PUBLIC_API_BASE_URL=__NEXT_PUBLIC_API_BASE_URL_PLACEHOLDER__

RUN bun run build

# Stage 3: Production runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-privileged user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# Set permissions
RUN mkdir .next && chown nextjs:nodejs .next
RUN chmod +x entrypoint.sh

# Copy standalone build
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

ENV PORT=80
ENV HOSTNAME="0.0.0.0"

EXPOSE 80

# Use the entrypoint script to inject runtime variables
ENTRYPOINT ["./entrypoint.sh"]

CMD [ \
  "/bin/sh", \
  "-c", \
  "if [ \"$(ls -A /usr/local/share/ca-certificates/)\" ]; then update-ca-certificates; fi; exec node server.js" \
]
