# Contact form infrastructure

Terraform stack that powers the home page Contact form. It deploys:

- **AWS Lambda** (`nodejs20.x`) that validates the submission and sends email via SES.
- **API Gateway HTTP API** with `POST /contact` and CORS configured for the site origin.
- **IAM role** scoped to `ses:SendEmail` from the `from_email` address only.
- **CloudWatch log group** for the Lambda (configurable retention).
- Optional **SES email identity** for the sender, if not already verified.

The Lambda only accepts `POST` with JSON `{ name, email, subject, message }`. A hidden `company` honeypot field silently accepts spam without sending mail.

## Prerequisites

- Terraform >= 1.6
- AWS credentials with permission to create Lambda, API Gateway, IAM, SES, and CloudWatch resources
- An SES sender address (or its parent domain) that you control. By default this is `kristie@houseofluaconsulting.com`.

## SES sandbox note

New AWS accounts start in the SES sandbox, which restricts you to sending **to** verified addresses only. The default `to_email` is the same verified address you control, so the sandbox is fine for this use case. Move out of the sandbox only if you want to deliver to other recipients.

## Deploy

```bash
cd terraform
terraform init
terraform apply -var-file=example.tfvars
```

Copy `example.tfvars` and edit values as needed. `allowed_origins` is a list — include each origin that should be allowed to POST (local dev URL, staging, production). `Access-Control-Allow-Origin` only accepts one value, so the Lambda echoes the request `Origin` if it's in the list.

After the first apply, AWS will email the `from_email` address with an SES verification link. Click it before submitting through the form. If the from address is already verified (or its parent domain is verified via DKIM), set `verify_from_identity = false`.

## Wire the site to the API

`terraform apply` prints `contact_api_endpoint`. Add it to the site's `.env`:

```
VITE_CONTACT_API_URL=https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/contact
```

Restart the dev server so Vite picks up the new variable.

## Updating the Lambda code

The Lambda is packaged from `terraform/lambda/`. Edit `index.mjs` and re-run `terraform apply` — the `archive_file` data source rehashes the zip and triggers a Lambda update.

## Tearing down

```bash
terraform destroy -var-file=example.tfvars
```
