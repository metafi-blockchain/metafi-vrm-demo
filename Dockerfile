FROM nginx:stable-alpine

# Sao chép các file build từ image trước vào thư mục của Nginx
COPY ./build /usr/share/nginx/html

EXPOSE 80

# Khởi động Nginx
CMD ["nginx", "-g", "daemon off;"]