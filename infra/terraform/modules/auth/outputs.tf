output "user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "user_pool_issuer" {
  value = "https://cognito-idp.${var.region}.amazonaws.com/${aws_cognito_user_pool.main.id}"
}

output "mobile_client_id" {
  value = aws_cognito_user_pool_client.main.id
}

output "admin_pool_id" {
  value = aws_cognito_user_pool.admin.id
}

output "admin_client_id" {
  value = aws_cognito_user_pool_client.admin.id
}
