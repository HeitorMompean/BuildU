variable "project" {
  type = string
}

variable "environment" {
  type = string
}

variable "scheduler_target_arn" {
  type        = string
  description = "Scheduler target ARN wired by compute. Empty disables delivery."
  default     = "arn:aws:sqs:us-east-1:000000000000:placeholder"
}
