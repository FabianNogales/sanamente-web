FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0

ENV NEXT_PUBLIC_API_URL=https://caja-negra-psico-back.wkhbmg.easypanel.host
ENV NEXT_PUBLIC_APP_URL=https://caja-negra-psico-front-web.wkhbmg.easypanel.host
ENV NEXT_PUBLIC_MOBILE_APP_URL=

COPY package*.json ./
RUN npm ci

COPY . .

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN npm run build

EXPOSE 80

CMD ["npm", "run", "start"]