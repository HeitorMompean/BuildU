variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "app_subnet_ids" {
  type = list(string)
}

variable "api_security_group_id" {
  type = string
}

variable "admin_security_group_id" {
  type = string
}

variable "api_target_group_arn" {
  type = string
}

variable "admin_target_group_arn" {
  type = string
}

variable "api_image" {
  type        = string
  description = "Immutable image reference (repo@sha256:digest)."
}

variable "admin_image" {
  type = string
}

variable "worker_image" {
  type = string
}

variable "api_desired_count" {
  type = number
}

variable "admin_desired_count" {
  type = number
}

variable "worker_desired_count" {
  type    = number
  default = 1
}

variable "log_retention_days" {
  type    = number
  default = 30
}

variable "kms_key_arn" {
  type = string
}
