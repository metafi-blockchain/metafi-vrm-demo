FROM nginx:stable-alpine

# Copy build files
COPY ./build /usr/share/nginx/html

# Copy custom Nginx configuration
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]