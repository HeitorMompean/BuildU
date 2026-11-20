output "api_repository_url" {
  value = aws_ecr_repository.api.repository_url
}

output "admin_repository_url" {
  value = aws_ecr_repository.admin.repository_url
}

output "worker_repository_url" {
  value = aws_ecr_repository.worker.repository_url
}
