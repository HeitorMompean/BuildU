output "alb_arn" {
  value = aws_lb.main.arn
}

output "alb_dns_name" {
  value = aws_lb.main.dns_name
}

output "api_target_group_arn" {
  value = aws_lb_target_group.api.arn
}

output "admin_target_group_arn" {
  value = aws_lb_target_group.admin.arn
}

output "https_listener_arn" {
  value = aws_lb_listener.https.arn
}
