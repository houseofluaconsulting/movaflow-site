resource "aws_sesv2_email_identity" "from" {
  count          = var.verify_from_identity ? 1 : 0
  email_identity = var.from_email
  tags           = local.tags
}

resource "aws_sesv2_email_identity" "to" {
  count          = var.verify_to_identity ? 1 : 0
  email_identity = var.to_email
  tags           = local.tags
}
