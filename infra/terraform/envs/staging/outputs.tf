output "alb_dns_name" {
  value = module.edge.alb_dns_name
}

output "api_hostname" {
  value = local.api_hostname
}

output "admin_hostname" {
  value = local.admin_hostname
}

output "links_hostname" {
  value = local.links_hostname
}

output "db_endpoint" {
  value     = module.database.endpoint
  sensitive = true
}

output "media_bucket" {
  value = module.media.bucket_name
}
