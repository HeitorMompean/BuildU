variable "project" {
  type    = string
  default = "hs"
}

variable "environment" {
  type    = string
  default = "production"
}

variable "region" {
  type    = string
  default = "us-east-1"
}

variable "state_bucket_name" {
  type        = string
  description = "Human-supplied state bucket name (globally unique)."
  default     = "hs-production-tfstate-placeholder"
}

variable "github_org" {
  type        = string
  description = "GitHub organization (human-supplied)."
  default     = ""
}

variable "github_repo" {
  type        = string
  description = "GitHub repository (human-supplied)."
  default     = ""
}
