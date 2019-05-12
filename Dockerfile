FROM node:lts-alpine

WORKDIR /srv

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
