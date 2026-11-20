variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "alert_emails" {
  type        = list(string)
  description = "SNS alert recipients. Empty creates the topic without subscriptions."
  default     = []
}

variable "alb_arn_suffix" {
  type        = string
  description = "ALB ARN suffix for 5xx/latency alarms. Empty disables ALB alarms."
  default     = ""
}

variable "rds_instance_id" {
  type        = string
  description = "RDS instance ID for CPU/storage alarms. Empty disables RDS alarms."
  default     = ""
}
