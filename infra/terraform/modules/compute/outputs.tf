output "cluster_name" {
  value = aws_ecs_cluster.main.name
}

output "api_service_name" {
  value = aws_ecs_service.api.name
}

output "admin_service_name" {
  value = aws_ecs_service.admin.name
}

output "worker_service_name" {
  value = aws_ecs_service.worker.name
}
