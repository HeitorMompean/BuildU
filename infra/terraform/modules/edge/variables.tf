variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "vpc_id" {
  type = string
}

variable "public_subnet_ids" {
  type = list(string)
}

variable "alb_security_group_id" {
  type = string
}

variable "certificate_arn" {
  type        = string
  description = "ACM certificate covering api/admin/links hostnames."
}

variable "hosted_zone_id" {
  type        = string
  description = "Route53 hosted zone ID. Empty when DNS is unmanaged."
  default     = ""
}

variable "api_hostname" {
  type = string
}

variable "admin_hostname" {
  type = string
}

variable "links_hostname" {
  type = string
}

variable "create_dns_records" {
  type    = bool
  default = false
}
