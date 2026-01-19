# Backend Dockerfile (Symfony API)

FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    sqlite-dev \
    openssl \
    && docker-php-ext-install \
    pdo_sqlite \
    zip \
    intl \
    opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

# Copy composer files first for better caching
COPY composer.json composer.lock ./

# Install dependencies (include dev for fixtures in CI)
RUN composer install --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Run post-install scripts
RUN composer run-script post-install-cmd --no-interaction || true

# Create directories and set permissions
RUN mkdir -p var/cache var/log var/data config/jwt \
    && chown -R www-data:www-data var config/jwt

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Set permissions for www-data to run the app
RUN chown -R www-data:www-data /var/www/html

USER www-data

EXPOSE 9000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["php-fpm"]
