locals {
  tags = {
    Project     = var.project
    Environment = var.environment
  }
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project}-${var.environment}"
  subnet_ids = var.data_subnet_ids
  tags       = local.tags
}

resource "aws_db_parameter_group" "main" {
  name   = "${var.project}-${var.environment}-pg16"
  family = "postgres16"
  tags   = local.tags
}

resource "aws_db_instance" "main" {
  identifier                      = "${var.project}-${var.environment}"
  engine                          = "postgres"
  engine_version                  = var.engine_version
  instance_class                  = var.instance_class
  allocated_storage               = var.allocated_storage
  max_allocated_storage           = var.max_allocated_storage
  storage_type                    = "gp3"
  storage_encrypted               = true
  kms_key_id                      = var.kms_key_arn
  db_subnet_group_name            = aws_db_subnet_group.main.name
  vpc_security_group_ids          = [var.rds_security_group_id]
  publicly_accessible             = false
  multi_az                        = var.multi_az
  backup_retention_period         = var.backup_retention_days
  copy_tags_to_snapshot           = true
  deletion_protection             = var.deletion_protection
  delete_automated_backups        = false
  performance_insights_enabled    = true
  manage_master_user_password     = true
  master_user_secret_kms_key_id   = var.kms_key_arn
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  auto_minor_version_upgrade      = true
  allow_major_version_upgrade     = false
  monitoring_interval             = 60
  skip_final_snapshot             = false
  final_snapshot_identifier       = "${var.project}-${var.environment}-final"
  parameter_group_name            = aws_db_parameter_group.main.name
  tags                            = local.tags
}
