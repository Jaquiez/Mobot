FROM node:18
COPY package.json .
RUN npm i
RUN npm install pm2 -g
COPY . .
CMD ["pm2-runtime", "app.js"]