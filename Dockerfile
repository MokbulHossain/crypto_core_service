FROM node:18.17.0 AS development

# Create app directory
WORKDIR /nestjs_core

COPY package*.json ./

RUN npm install glob rimraf

RUN npm install

#RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:18.17.0 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /nestjs_core

COPY package*.json ./

RUN npm install

#RUN npm install --only=production

COPY .env ./
COPY ssl ./ssl
COPY locales ./locales

COPY --from=development /nestjs_core/dist ./dist

CMD ["node", "dist/main"]