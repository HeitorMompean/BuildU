locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_secretsmanager_secret" "provider_credentials" {
  for_each                = toset(var.secret_names)
  name                    = "/${var.project}/${var.environment}/${each.value}"
  kms_key_id              = var.kms_key_arn
  recovery_window_in_days = 30
  tags                    = local.tags
}

resource "aws_ssm_parameter" "non_secret" {
  for_each = var.parameters
  name     = "/${var.project}/${var.environment}/${each.key}"
  type     = "String"
  value    = each.value
  tags     = local.tags
}
