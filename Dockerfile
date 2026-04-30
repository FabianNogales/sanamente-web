FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --include=dev

COPY . .

ENV NEXT_PUBLIC_API_URL=https://caja-negra-psico-back.wkhbmg.easypanel.host
ENV NEXT_PUBLIC_APP_URL=https://caja-negra-psico-front-web.wkhbmg.easypanel.host
ENV NEXT_PUBLIC_MOBILE_APP_URL=

RUN echo "NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
RUN npm run build

ENV NODE_ENV=production
ENV PORT=80
ENV HOSTNAME=0.0.0.0

EXPOSE 80

CMD ["npm", "run", "start"]