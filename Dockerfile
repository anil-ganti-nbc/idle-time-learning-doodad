FROM node:26-bookworm-slim
WORKDIR /workspace/idle-time-learning-doodad
COPY package.json package-lock.json ./
RUN npm install --no-audit --no-fund
EXPOSE 8090
CMD ["/bin/sh", "-c", "npm install --no-audit --no-fund && npm run dev -- --host 0.0.0.0 --port 8090 --strictPort"]
