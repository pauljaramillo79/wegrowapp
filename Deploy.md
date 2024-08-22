Before deploying:

1. change dbconnect credentials
2. in routes.js change jwt.sign tokens to ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET

branch-defaults:
master:
environment: wegrow1-env
group_suffix: null
global:
application_name: wegrow1
branch: null
default_ec2_keyname: aws-eb
default_platform: Node.js 16 running on 64bit Amazon Linux 2
default_region: us-east-2
include_git_submodules: true
instance_profile: null
platform_name: null
platform_version: null
profile: eb-cli
repository: null
sc: git
workspace_type: Application
