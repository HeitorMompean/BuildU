locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_sesv2_configuration_set" "main" {
  configuration_set_name = "${var.project}-${var.environment}"
  tags                   = local.tags
}

resource "aws_sesv2_email_identity" "sender" {
  count                  = var.from_address == "" ? 0 : 1
  email_identity         = var.from_address
  configuration_set_name = aws_sesv2_configuration_set.main.configuration_set_name
}
