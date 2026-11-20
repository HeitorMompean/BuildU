variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "kms_key_arn" {
  type = string
}

variable "allowed_origins" {
  type        = list(string)
  description = "App origins allowed for constrained uploads. Empty disables CORS."
  default     = []
}
