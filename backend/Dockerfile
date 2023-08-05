FROM node:18

WORKDIR ./app

COPY package*.json ./
COPY prisma ./prisma/

COPY .env ./

RUN npm install
RUN npx prisma generate

EXPOSE 3001

COPY . .

RUN npm run build

CMD ["node", "dist/main.js"]