data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/build/contact-lambda.zip"
}

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${local.name_prefix}-handler"
  retention_in_days = var.log_retention_days
  tags              = local.tags
}

resource "aws_lambda_function" "contact" {
  function_name    = "${local.name_prefix}-handler"
  role             = aws_iam_role.lambda.arn
  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  handler          = "index.handler"
  runtime          = "nodejs20.x"
  memory_size      = var.lambda_memory_mb
  timeout          = var.lambda_timeout_seconds

  environment {
    variables = {
      FROM_EMAIL      = var.from_email
      TO_EMAIL        = var.to_email
      ALLOWED_ORIGINS = jsonencode(var.allowed_origins)
    }
  }

  depends_on = [
    aws_iam_role_policy_attachment.lambda_basic,
    aws_iam_role_policy.ses_send,
    aws_cloudwatch_log_group.lambda,
  ]

  tags = local.tags
}
