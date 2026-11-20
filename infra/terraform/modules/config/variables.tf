variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "kms_key_arn" {
  type = string
}

variable "secret_names" {
  type        = list(string)
  description = "Secret names only. No values are stored in Terraform."
  default = [
    "DATABASE_SECRET_ARN",
    "COGNITO_ADMIN_CLIENT_SECRET",
    "ADMIN_SESSION_SECRET",
    "SENTRY_DSN",
    "EXPO_ACCESS_TOKEN",
    "WIX_API_KEY",
    "WIX_WEBHOOK_PUBLIC_KEY"
  ]
}

variable "parameters" {
  type        = map(string)
  description = "Non-secret SSM parameters (URLs, pool IDs, feature flags)."
  default     = {}
}
