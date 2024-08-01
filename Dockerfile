FROM node:20-alpine AS base

FROM base AS dependencies

WORKDIR /
COPY package*.json ./

RUN npm install 

# Copy .env file
COPY .env ./

FROM base AS build

WORKDIR /
COPY . .
COPY --from=dependencies /node_modules ./node_modules
RUN npm run build

FROM base AS deploy

WORKDIR /
COPY --from=build /package*.json ./
COPY --from=build /node_modules ./node_modules
COPY --from=build / . 

EXPOSE 3000

CMD ["npm", "start", "test"]
