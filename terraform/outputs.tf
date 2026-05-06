output "contact_api_endpoint" {
  description = "URL to POST contact form submissions to. Set this as VITE_CONTACT_API_URL in the site .env."
  value       = "${aws_apigatewayv2_api.contact.api_endpoint}/contact"
}

output "lambda_function_name" {
  description = "Name of the deployed Lambda function."
  value       = aws_lambda_function.contact.function_name
}

output "from_email_verification_pending" {
  description = "If true, check the inbox of the from_email address and click the SES verification link before sending."
  value       = var.verify_from_identity
}
