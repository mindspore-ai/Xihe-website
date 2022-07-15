FROM gplane/pnpm as Builder

RUN mkdir -p /home/xihe/web
WORKDIR /home/xihe/web
COPY . /home/xihe/web

RUN pnpm install

RUN pnpm build

FROM nginx:1.20.0

COPY --from=Builder /home/xihe/web/dist/ /usr/share/nginx/html/
RUN chmod -R 755 /usr/share/nginx/html
COPY ./deploy/nginx/nginx.conf /etc/nginx/nginx.conf


ENV RUN_USER nginx
ENV RUN_GROUP nginx
EXPOSE 8080
ENTRYPOINT ["nginx", "-g", "daemon off;"]

