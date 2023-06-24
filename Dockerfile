FROM node:18-alpine

RUN mkdir /app
WORKDIR /app
# COPY package*.json tsconfig.json wait.sh ./
COPY package*.json tsconfig.json ./
RUN npm install 

# ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.12.0/wait /wait
# RUN chmod +x /wait
COPY src ./src
RUN npm run build

EXPOSE 3000
# CMD /wait && npm start
CMD ["npm", "start"]