output "bucket_name" {
  value = aws_s3_bucket.releases.bucket
}

output "table_name" {
  value = aws_dynamodb_table.releases.name
}
