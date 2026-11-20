locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_sqs_queue" "domain_dlq" {
  name                      = "${var.project}-${var.environment}-domain-jobs-dlq"
  message_retention_seconds = 1209600
  sqs_managed_sse_enabled   = true
  tags                      = local.tags
}

resource "aws_sqs_queue" "scheduler_dlq" {
  name                      = "${var.project}-${var.environment}-scheduler-dlq"
  message_retention_seconds = 1209600
  sqs_managed_sse_enabled   = true
  tags                      = local.tags
}

resource "aws_sqs_queue" "domain_jobs" {
  name                       = "${var.project}-${var.environment}-domain-jobs"
  visibility_timeout_seconds = 120
  message_retention_seconds  = 345600
  receive_wait_time_seconds  = 20
  sqs_managed_sse_enabled    = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.domain_dlq.arn
    maxReceiveCount     = 5
  })
  tags = local.tags
}

resource "aws_iam_role" "scheduler" {
  name = "${var.project}-${var.environment}-scheduler"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect    = "Allow"
      Principal = { Service = "scheduler.amazonaws.com" }
      Action    = "sts:AssumeRole"
    }]
  })
  tags = local.tags
}

resource "aws_scheduler_schedule" "tick" {
  name                         = "${var.project}-${var.environment}-tick"
  schedule_expression          = "rate(1 minute)"
  schedule_expression_timezone = "UTC"
  flexible_time_window {
    mode = "OFF"
  }
  target {
    arn      = var.scheduler_target_arn
    role_arn = aws_iam_role.scheduler.arn
    input    = jsonencode({ source = "scheduler-tick" })
  }
}
