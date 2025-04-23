FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 6379
CMD ["node", "server.js"]