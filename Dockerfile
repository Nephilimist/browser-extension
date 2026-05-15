FROM nginx:alpine

# Copy application files to nginx public directory
COPY . /usr/share/nginx/html/

# Copy our custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Clean up any files that shouldn't be in the production build (optional)
RUN rm -f /usr/share/nginx/html/Dockerfile /usr/share/nginx/html/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
