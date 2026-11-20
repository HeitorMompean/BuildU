output "domain_jobs_queue_url" {
  value = aws_sqs_queue.domain_jobs.url
}

output "domain_jobs_queue_arn" {
  value = aws_sqs_queue.domain_jobs.arn
}

output "domain_dlq_url" {
  value = aws_sqs_queue.domain_dlq.url
}

output "scheduler_dlq_url" {
  value = aws_sqs_queue.scheduler_dlq.url
}
