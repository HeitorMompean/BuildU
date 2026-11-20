locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_cognito_user_pool" "main" {
  name                     = "${var.project}-${var.environment}-users"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  password_policy {
    minimum_length    = 12
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  tags = local.tags
}

resource "aws_cognito_user_pool_client" "main" {
  name                                 = "${var.project}-${var.environment}-mobile"
  user_pool_id                         = aws_cognito_user_pool.main.id
  generate_secret                      = false
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]
  callback_urls                        = var.mobile_callback_urls
  logout_urls                          = var.mobile_logout_urls
  supported_identity_providers         = ["COGNITO"]
}

resource "aws_cognito_user_pool" "admin" {
  name                     = "${var.project}-${var.environment}-admin"
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
  admin_create_user_config {
    allow_admin_create_user_only = true
  }
  mfa_configuration = "ON"
  software_token_mfa_configuration {
    enabled = true
  }
  password_policy {
    minimum_length    = 14
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }
  tags = local.tags
}

resource "aws_cognito_user_pool_client" "admin" {
  name                                 = "${var.project}-${var.environment}-admin-web"
  user_pool_id                         = aws_cognito_user_pool.admin.id
  generate_secret                      = true
  allowed_oauth_flows_user_pool_client = true
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes                 = ["openid", "email", "profile"]
  callback_urls                        = var.admin_callback_urls
  logout_urls                          = var.admin_logout_urls
  supported_identity_providers         = ["COGNITO"]
}
