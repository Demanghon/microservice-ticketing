FROM node:alpine

#https://github.com/webpack/webpack/issues/14532
ENV NODE_OPTIONS=--openssl-legacy-provider
#To call others services without check ssl
ENV NODE_TLS_REJECT_UNAUTHORIZED='0'

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .

CMD ["npm", "run", "dev"]