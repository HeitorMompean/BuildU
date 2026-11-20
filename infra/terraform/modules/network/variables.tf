variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type        = string
  description = "AWS region (used for the S3 gateway endpoint)."
}

variable "vpc_cidr" {
  type = string
}

variable "public_subnet_cidrs" {
  type = list(string)
}

variable "app_subnet_cidrs" {
  type = list(string)
}

variable "data_subnet_cidrs" {
  type = list(string)
}

variable "availability_zones" {
  type        = list(string)
  description = "Two AZs per environment."
}

variable "nat_count" {
  type        = number
  description = "1 for staging, 2 for production."
}
