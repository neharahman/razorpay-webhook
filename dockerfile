FROM --platform=linux/amd64 node:16-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install

COPY . .

EXPOSE 7000

CMD ["node", "index.js"]