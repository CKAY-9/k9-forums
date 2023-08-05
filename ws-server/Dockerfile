FROM node:18

WORKDIR ./app

COPY .env ./
COPY package*.json ./

RUN npm install
RUN npm install typescript

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]