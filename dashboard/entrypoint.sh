#!/bin/sh

# If NEXT_PUBLIC_API_BASE_URL is not set, use a default or leave it as is
if [ -z "$NEXT_PUBLIC_API_BASE_URL" ]; then
  echo "NEXT_PUBLIC_API_BASE_URL is not set. Using default."
else
  echo "Injecting NEXT_PUBLIC_API_BASE_URL: $NEXT_PUBLIC_API_BASE_URL"
  # Replace the placeholder in all JS files in the .next directory
  # We use a placeholder that was set during build time
  find .next -type f -name "*.js" -exec sed -i "s|__NEXT_PUBLIC_API_BASE_URL_PLACEHOLDER__|${NEXT_PUBLIC_API_BASE_URL}|g" {} +
fi

# Execute the original command (node server.js)
exec "$@"
