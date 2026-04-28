FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV="production"
RUN npx next build
RUN npm run build
RUN chmod +x ./entrypoint.sh

ENTRYPOINT [ "./entrypoint.sh" ]