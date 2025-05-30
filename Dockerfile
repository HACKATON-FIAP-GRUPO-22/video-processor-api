FROM node:18-alpine

RUN apk add --no-cache ffmpeg

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]