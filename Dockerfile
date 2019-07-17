FROM nginx:latest
RUN rm -rf /usr/share/nginx/html/
ADD  frontend-framework.tar.gz /usr/share/nginx/html/
