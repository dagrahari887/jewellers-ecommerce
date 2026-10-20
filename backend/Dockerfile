FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
EXPOSE 5000
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run seed && npm run dev"]
