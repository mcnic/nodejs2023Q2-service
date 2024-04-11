FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm i && npm cache clean --force
COPY . .
RUN npx prisma generate
# COPY . /app
# EXPOSE ${PORT}
# VOLUME ["/app"]
# CMD ["npm", "run", "migrate:start:dev"]
# CMD ["node"]