FROM node:16-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV NODE_ENV="production"
RUN npx next build
RUN npm run build

EXPOSE 3000
ENTRYPOINT [ "./entrypoint.sh" ]