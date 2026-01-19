#!/bin/sh
set -e

# Generate JWT keys if they don't exist
if [ ! -f config/jwt/private.pem ]; then
    echo "Generating JWT keys..."
    mkdir -p config/jwt
    openssl genpkey -algorithm RSA -out config/jwt/private.pem -pkeyopt rsa_keygen_bits:4096
    openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
    chmod 644 config/jwt/private.pem config/jwt/public.pem
    echo "JWT keys generated successfully"
fi

# Wait for any external services if needed
sleep 2

# Run database migrations
echo "Running database migrations..."
php bin/console doctrine:migrations:migrate --no-interaction --allow-no-migration || true

# Load fixtures in dev/test environment
if [ "$APP_ENV" = "dev" ] || [ "$APP_ENV" = "test" ] || [ "$LOAD_FIXTURES" = "true" ]; then
    echo "Loading fixtures..."
    php bin/console doctrine:fixtures:load --no-interaction || true
fi

# Clear and warm up cache
echo "Warming up cache..."
php bin/console cache:clear --no-warmup
php bin/console cache:warmup

echo "API ready!"

# Execute the main command (php-fpm)
exec "$@"
