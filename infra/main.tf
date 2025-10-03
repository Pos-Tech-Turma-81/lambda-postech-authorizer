terraform {
  backend "s3" {
    bucket         = "my-terraform-state-turma-8881"    # seu bucket
    key            = "infra-lambda-authorizer.tfstate"     # caminho do state no S3
    region         = "us-east-1"             # região do bucket
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.30.0"
    }
    random = {
      source  = "hashicorp/random"
      version = ">= 3.7.2"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_caller_identity" "current" {}

data "aws_vpc" "postech_vpc" {
  filter {
    name   = "tag:Name"
    values = ["postech-vpc"]
  }
}

data "aws_subnet" "public_a" {
  filter {
    name   = "tag:Name"
    values = ["postech-vpc-public-us-east-1a"]
  }
}

data "aws_subnet" "public_b" {
  filter {
    name   = "tag:Name"
    values = ["postech-vpc-public-us-east-1b"]
  }
}

data "aws_subnet" "private_a" {
  filter {
    name   = "tag:Name"
    values = ["postech-vpc-private-us-east-1a"]
  }
}

data "aws_subnet" "private_b" {
  filter {
    name   = "tag:Name"
    values = ["postech-vpc-private-us-east-1b"]
  }
}

resource "aws_security_group" "lambda_authorizer" {
  name        = "authorizer-sg"
  vpc_id      =  data.aws_vpc.postech_vpc.id

  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


# Empacota o código da lambda em zip
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../app/src"
  output_path = "${path.module}/lambda.zip"
}


# Lambda
resource "aws_lambda_function" "lambda_authorizer" {
    function_name = "lambda-lambda_authorizer"
    role          = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/LabRole"
    handler       = "index.handler"
    runtime       = "nodejs18.x"

    filename         = data.archive_file.lambda_zip.output_path
    source_code_hash = data.archive_file.lambda_zip.output_base64sha256

    vpc_config {
        subnet_ids         = [data.aws_subnet.private_a.id, data.aws_subnet.private_b.id]
        security_group_ids = [aws_security_group.lambda_authorizer.id]
    }

    environment {
        variables = {
        ENV = "dev"
        }
    }
}
