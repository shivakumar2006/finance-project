FROM nginx:alpine

# build output copy
COPY dist /usr/share/nginx/html

# nginx config (optional but recommended)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]