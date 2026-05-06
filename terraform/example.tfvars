aws_region = "us-east-2"
project    = "movaflow"
from_email = "kristie@houseofluaconsulting.com"
to_email   = "kristie@houseofluaconsulting.com"

# Origins allowed by CORS. Add local dev URLs and the deployed site URL.
allowed_origins = [
  "http://localhost:3032",
  "https://movaflow.io",
]

# Set to false if the from_email (or its parent domain) is already verified in SES.
verify_from_identity = false
