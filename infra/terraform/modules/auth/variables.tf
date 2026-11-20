variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "region" {
  type = string
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
