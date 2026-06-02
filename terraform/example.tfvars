aws_region = "us-east-2"
project    = "movaflow"
from_email = "kristie@houseofluaconsulting.com"
to_email   = "info@movaflow.co"

# Origins allowed by CORS. Add local dev URLs and the deployed site URL.
allowed_origins = [
  "http://localhost:3032",
  "https://movaflow.io",
  "https://movaflow.co",
]

# Set to false if the from_email (or its parent domain) is already verified in SES.
verify_from_identity = false

# In SES sandbox, the recipient address must also be verified.
# Set true to have Terraform create the identity and AWS email a verification link to to_email.
verify_to_identity = false
