variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "from_address" {
  type        = string
  description = "Verified SES sender address. Empty skips identity creation."
  default     = ""
}

variable "domain" {
  type        = string
  description = "Root domain for SES DNS records (managed outside or by edge)."
  default     = ""
}
