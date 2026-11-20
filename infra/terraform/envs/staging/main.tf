locals {
  api_hostname   = "api-staging.${var.domain}"
  admin_hostname = "admin-staging.${var.domain}"
  links_hostname = "links-staging.${var.domain}"
}

module "kms" {
  source      = "../../modules/kms"
  project     = var.project
  environment = var.environment
}

module "network" {
  source              = "../../modules/network"
  project             = var.project
  environment         = var.environment
  region              = var.region
  vpc_cidr            = "10.20.0.0/20"
  public_subnet_cidrs = ["10.20.0.0/24", "10.20.1.0/24"]
  app_subnet_cidrs    = ["10.20.4.0/24", "10.20.5.0/24"]
  data_subnet_cidrs   = ["10.20.8.0/24", "10.20.9.0/24"]
  availability_zones  = var.availability_zones
  nat_count           = 1
}

module "edge" {
  source                = "../../modules/edge"
  project               = var.project
  environment           = var.environment
  vpc_id                = module.network.vpc_id
  public_subnet_ids     = module.network.public_subnet_ids
  alb_security_group_id = module.network.alb_security_group_id
  certificate_arn       = var.certificate_arn
  hosted_zone_id        = var.hosted_zone_id
  api_hostname          = local.api_hostname
  admin_hostname        = local.admin_hostname
  links_hostname        = local.links_hostname
  create_dns_records    = var.hosted_zone_id != ""
}

module "ecr" {
  source      = "../../modules/ecr"
  project     = var.project
  environment = var.environment
}

module "database" {
  source                = "../../modules/database"
  project               = var.project
  environment           = var.environment
  instance_class        = var.db_instance_class
  multi_az              = false
  backup_retention_days = 7
  deletion_protection   = false
  data_subnet_ids       = module.network.data_subnet_ids
  rds_security_group_id = module.network.rds_security_group_id
  kms_key_arn           = module.kms.key_arn
}

module "messaging" {
  source      = "../../modules/messaging"
  project     = var.project
  environment = var.environment
}

module "media" {
  source      = "../../modules/media"
  project     = var.project
  environment = var.environment
  kms_key_arn = module.kms.key_arn
}

module "auth" {
  source               = "../../modules/auth"
  project              = var.project
  environment          = var.environment
  region               = var.region
  mobile_callback_urls = var.mobile_callback_urls
  mobile_logout_urls   = var.mobile_logout_urls
  admin_callback_urls  = var.admin_callback_urls
  admin_logout_urls    = var.admin_logout_urls
}

module "ses" {
  source       = "../../modules/ses"
  project      = var.project
  environment  = var.environment
  from_address = var.ses_from_address
  domain       = var.domain
}

module "config" {
  source      = "../../modules/config"
  project     = var.project
  environment = var.environment
  kms_key_arn = module.kms.key_arn
}

module "compute" {
  source                  = "../../modules/compute"
  project                 = var.project
  environment             = var.environment
  region                  = var.region
  vpc_id                  = module.network.vpc_id
  app_subnet_ids          = module.network.app_subnet_ids
  api_security_group_id   = module.network.api_security_group_id
  admin_security_group_id = module.network.admin_security_group_id
  api_target_group_arn    = module.edge.api_target_group_arn
  admin_target_group_arn  = module.edge.admin_target_group_arn
  api_image               = var.api_image
  admin_image             = var.admin_image
  worker_image            = var.worker_image
  api_desired_count       = 1
  admin_desired_count     = 1
  kms_key_arn             = module.kms.key_arn
}

module "release_artifacts" {
  source      = "../../modules/release_artifacts"
  project     = var.project
  environment = var.environment
  kms_key_arn = module.kms.key_arn
}

module "observability" {
  source       = "../../modules/observability"
  project      = var.project
  environment  = var.environment
  alert_emails = var.alert_emails
}
