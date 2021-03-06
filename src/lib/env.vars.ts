export type EnvVariable =
  | "PORT"
  | "NODE_ENV"
  | "DEFAULT_PORT"
  | "CLIENT_PORT"
  | "API_ROOT"
  | "APP_NAME"
  | "IS_SSL"
  | "MONGO_URI"
  | "JWT_SECRET"
  | "JWT_ADMIN_SECRET"
  | "JWT_EXPIRY"
  | "EMAIL_API_KEY"
  | "EMAIL_FROM_EMAIL"
  | "EMAIL_FROM_NAME"
  | "AUTH_REQUIRE_USER_VERIFY"
  | "FACEBOOK_CLIENT_ID"
  | "FACEBOOK_CLIENT_SECRET"
  | "FACEBOOK_CALLBACK_URL"
  | "LINKEDIN_CLIENT_ID"
  | "LINKEDIN_CLIENT_SECRET"
  | "LINKEDIN_CALLBACK_URL"
  | "GOOGLE_CLIENT_ID"
  | "GOOGLE_CLIENT_SECRET"
  | "GOOGLE_CALLBACK_URL"
  | "ADMIN_SECRET"
  | "AUTH_MIN_PASSWORD_LENGTH"
  | "AUTH_VERIFY_TOKEN_LENGTH"
  | "AUTH_ADMIN_TOKEN_LENGTH";
