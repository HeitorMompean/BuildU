variable "project" {
  type    = string
  default = "hs"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "region" {
  type        = string
  description = "AWS region for staging."
  default     = "us-east-1"
}

variable "availability_zones" {
  type    = list(string)
  default = ["us-east-1a", "us-east-1b"]
}

variable "domain" {
  type        = string
  description = "Root domain (human-supplied)."
  default     = "example.com"
}

variable "hosted_zone_id" {
  type    = string
  default = ""
}

variable "certificate_arn" {
  type    = string
  default = "arn:aws:acm:us-east-1:000000000000:certificate/00000000-0000-0000-0000-000000000000"
}

variable "db_instance_class" {
  type    = string
  default = "db.t4g.small"
}

variable "alert_emails" {
  type    = list(string)
  default = []
}

variable "ses_from_address" {
  type    = string
  default = ""
}

variable "mobile_callback_urls" {
  type    = list(string)
  default = []
}

variable "mobile_logout_urls" {
  type    = list(string)
  default = []
}

variable "admin_callback_urls" {
  type    = list(string)
  default = []
}

variable "admin_logout_urls" {
  type    = list(string)
  default = []
}

variable "api_image" {
  type    = string
  default = "000000000000.dkr.ecr.us-east-1.amazonaws.com/hs-production-api@sha256:0000000000000000000000000000000000000000000000000000000000000000"
}

variable "admin_image" {
  type    = string
  default = "000000000000.dkr.ecr.us-east-1.amazonaws.com/hs-production-admin@sha256:0000000000000000000000000000000000000000000000000000000000000000"
}

variable "worker_image" {
  type    = string
  default = "000000000000.dkr.ecr.us-east-1.amazonaws.com/hs-production-worker@sha256:0000000000000000000000000000000000000000000000000000000000000000"
}

variable "apple_team_id" {
  type    = string
  default = ""
}

variable "ios_bundle_id" {
  type    = string
  default = "com.example.hs"
}

variable "android_package" {
  type    = string
  default = "com.example.hs"
}

variable "expo_project_id" {
  type    = string
  default = "00000000-0000-0000-0000-000000000000"
}

variable "maps_provider" {
  type    = string
  default = ""
}
