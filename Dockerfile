# Build stage
FROM node:20-alpine as build
WORKDIR /
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM build as production
WORKDIR /
COPY --from=build /src ./src

# Mở cổng 3000 để ứng dụng chạy
EXPOSE 3000

CMD ["npm", "start"]


