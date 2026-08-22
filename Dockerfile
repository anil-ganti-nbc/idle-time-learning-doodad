FROM node:22-bookworm-slim
WORKDIR /app
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
WORKDIR /app
COPY package.json package-lock.json ./
RUN (npm ci --no-audit --no-fund || npm install --no-audit --no-fund)
COPY . .
# Sibling contract + labs are mounted at build time via compose volumes;
# the practice integration imports them by relative path.
EXPOSE 8090
CMD ["/bin/sh", "-c", "cd /workspace/idle-time-learning-doodad && npm ci --no-audit --no-fund && npm run dev -- --host 0.0.0.0 --port 8090 --strictPort"]
