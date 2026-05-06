terraform {
  required_version = ">= 1.6.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project}-contact"
  tags = merge(
    {
      Project   = var.project
      ManagedBy = "terraform"
      Component = "contact-form"
    },
    var.extra_tags,
  )
}
