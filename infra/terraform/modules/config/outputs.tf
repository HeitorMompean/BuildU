output "secret_arns" {
  value = { for k, s in aws_secretsmanager_secret.provider_credentials : k => s.arn }
}

output "parameter_names" {
  value = [for p in aws_ssm_parameter.non_secret : p.name]
}
