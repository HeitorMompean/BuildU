locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_sns_topic" "alerts" {
  name         = "${var.project}-${var.environment}-alerts"
  display_name = "${var.project} ${var.environment} alerts"
  tags         = local.tags
}

resource "aws_sns_topic_subscription" "email" {
  for_each  = toset(var.alert_emails)
  topic_arn = aws_sns_topic.alerts.arn
  protocol  = "email"
  endpoint  = each.value
}

resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project}-${var.environment}"
  dashboard_body = jsonencode({
    widgets = [{
      type   = "text"
      width  = 24
      height = 2
      properties = {
        markdown = "# ${var.project} ${var.environment} (R01-M baseline)"
      }
    }]
  })
}

resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  count               = var.alb_arn_suffix == "" ? 0 : 1
  alarm_name          = "${var.project}-${var.environment}-alb-5xx"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 10
  alarm_actions       = [aws_sns_topic.alerts.arn]
  dimensions          = { LoadBalancer = var.alb_arn_suffix }
  tags                = local.tags
}
