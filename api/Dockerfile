# Backend Dockerfile (Symfony API)

FROM php:8.2-fpm-alpine

# Install dependencies
RUN apk add --no-cache \
    git \
    unzip \
    libzip-dev \
    icu-dev \
    sqlite-dev \
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

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Copy application code
COPY . .

# Run post-install scripts
RUN composer run-script post-install-cmd --no-interaction || true

# Create var directory and set permissions
RUN mkdir -p var/cache var/log \
    && chown -R www-data:www-data var

# Create non-root user
RUN addgroup -g 1001 symfony \
    && adduser -u 1001 -G symfony -s /bin/sh -D symfony \
    && chown -R symfony:symfony /var/www/html

USER symfony

EXPOSE 9000

CMD ["php-fpm"]
