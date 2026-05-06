variable "aws_region" {
  description = "AWS region to deploy into. Must be a region where SES is enabled."
  type        = string
  default     = "us-east-1"
}

variable "project" {
  description = "Short name used to prefix resources."
  type        = string
  default     = "movaflow"
}

variable "from_email" {
  description = "Verified SES sender address. Must be verified in this region before deploy."
  type        = string
  default     = "kristie@houseofluaconsulting.com"
}

variable "to_email" {
  description = "Recipient address for inquiries."
  type        = string
  default     = "kristie@houseofluaconsulting.com"
}

variable "verify_from_identity" {
  description = "Create an SES email identity for from_email. Set false if the identity (or its parent domain) is already verified."
  type        = bool
  default     = true
}

variable "allowed_origins" {
  description = "Origins allowed by the API's CORS policy. Include local dev URLs and the deployed site URL."
  type        = list(string)
  default     = ["http://localhost:3032", "https://movaflow.io"]
}

variable "lambda_memory_mb" {
  description = "Lambda memory size in MB."
  type        = number
  default     = 256
}

variable "lambda_timeout_seconds" {
  description = "Lambda timeout in seconds."
  type        = number
  default     = 10
}

variable "log_retention_days" {
  description = "CloudWatch log retention for the Lambda."
  type        = number
  default     = 30
}

variable "extra_tags" {
  description = "Additional resource tags."
  type        = map(string)
  default     = {}
}
