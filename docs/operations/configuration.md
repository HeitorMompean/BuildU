# Configuration contract

Names below are reserved for implementation. Values are intentionally absent. Use AWS Secrets Manager for secrets, SSM for non-secret server configuration, protected GitHub environments for CI, and EAS environment variables for mobile builds.

## Shared API/worker

```text
NODE_ENV
APP_ENV=staging|production
AWS_REGION
DATABASE_SECRET_ARN
DATABASE_HOST
DATABASE_PORT
DATABASE_NAME
COGNITO_ISSUER
COGNITO_USER_POOL_ID
COGNITO_CLIENT_ID
S3_MEDIA_BUCKET
SQS_DOMAIN_JOBS_QUEUE_URL
SQS_DOMAIN_JOBS_DLQ_URL
EXPO_ACCESS_TOKEN_SECRET_ARN
SES_FROM_ADDRESS
SES_CONFIGURATION_SET
SENTRY_DSN_SECRET_ARN
LOG_LEVEL
```

API additionally uses `PORT=8080`, public API/admin/links URLs, and approved maps/media limits. Worker has no public listener. Database migrator credentials are supplied only to the standalone migration task.

## Admin

```text
APP_ENV
PORT=3000
API_INTERNAL_BASE_URL
COGNITO_ADMIN_ISSUER
COGNITO_ADMIN_USER_POOL_ID
COGNITO_ADMIN_CLIENT_ID
COGNITO_ADMIN_CLIENT_SECRET_SECRET_ARN
ADMIN_SESSION_SECRET_ARN
LINKS_PUBLIC_URL
API_PUBLIC_URL
SENTRY_DSN_SECRET_ARN
APPLE_TEAM_ID
IOS_BUNDLE_ID
ANDROID_PACKAGE_NAME
ANDROID_SHA256_CERT_FINGERPRINTS
```

Only intentionally public non-secret values may use `NEXT_PUBLIC_*`. Admin Cognito client secret and session material must remain server-side.

## Mobile

```text
EXPO_PUBLIC_APP_ENV
EXPO_PUBLIC_API_URL
EXPO_PUBLIC_LINKS_URL
EXPO_PUBLIC_COGNITO_ISSUER
EXPO_PUBLIC_COGNITO_CLIENT_ID
EXPO_PUBLIC_SENTRY_DSN
EXPO_PUBLIC_MAPS_PROVIDER
```

Mobile public configuration is visible to users; never put Wix secrets, AWS secret keys, admin credentials, database credentials, or unrestricted map keys in it. Native identifiers and signing values are managed through protected EAS/store configuration.

## Wix, after approval only

```text
WIX_API_KEY_SECRET_ARN
WIX_SITE_ID
WIX_APP_ID
WIX_WEBHOOK_PUBLIC_KEY_SECRET_ARN
WIX_API_BASE_URL
WIX_CHECKOUT_RETURN_URL
WIX_RECONCILIATION_ENABLED
PAYMENTS_ENABLED
```

Exact names may be refined by the approved adapter if required by official Wix evidence, but secrets remain server-side. `PAYMENTS_ENABLED` defaults false until human approval. Feature flags cannot bypass authentication, reconciliation, or audit.

## Validation

Fail startup on missing/malformed required configuration. Do not silently fall back to production, a public bucket, another environment's Cognito pool, or a fake provider in production. Log only a redacted configuration summary.
