# ApiBoy Frontend

## Introduction

ApiBoy is an application for testing APIs, very similar to other tools like Postman and Insomnia, but with some important differences:

- ApiBoy is 100% open source.
- ApiBoy is a serverless web application with a simplified set of features in comparison with other tools.
- ApiBoy can be easily deployed to your own infrastructure at no cost because it uses cloud services that have a comfortable free tier: AWS API Gateway, AWS Lambda, Firebase Realtime Database, Firebase Firestore and Netlify.
- ApiBoy has real time features for teams to work and collaborate in the same projects at the same time.

The project is composed by a [Backend](https://github.com/api-boy/backend) and a Frontend (this repository).

The Backend is written in [Go](https://golang.org/) and uses [Firebase Firestore](https://firebase.google.com/docs/firestore/) to store data.

The Frontend is implemented with [VueJS](https://vuejs.org/) and connects to Firebase in order to read data and receive changes in real time, while writes are done through the Backend by calling its endpoints.

## Demo

<img src="https://user-images.githubusercontent.com/8256604/68883480-e9578980-06ef-11ea-88b6-91fbee2a1336.gif" width="920" height="500">

## Setup

### Install `go`:

Follow the official installation instructions:
- [How to install go compiler](https://golang.org/doc/install)

### Install `nodejs`:

Follow the official installation instructions:
- [How to install nodejs](https://nodejs.org/)

### Install `aws` cli:

Follow the official installation instructions:
- [How to install aws cli](https://docs.aws.amazon.com/cli/latest/userguide/installing.html)

### Configure AWS credentials profile for the project:

Add the `apiboy` profile to the `~/.aws/credentials` file with your AWS access and secret keys.

```
[apiboy]
aws_access_key_id = xxxxxxxx
aws_secret_access_key = xxxxxxxxxxxxxxxxxxxxxxxx
```

### Install development tools:

```bash
make tools
```

### Install project dependencies:

```bash
make deps
```

### Configure Netlify site:

The project is hosted as a static site in [Netlify](https://www.netlify.com) when deployed. The following steps will guide you to create a site on Netlify for production. **You only need to do these steps once.**

```bash
# Note that netlify cli is installed with the development tools :)
netlify login
netlify sites:create --account-slug=<YOUR_NETLIFY_ACCOUNT_SLUG> --name=<YOUR-SITE-NAME-FOR-APIBOY>
```

Also create a new access token from the **OAuth applications** page in the Netlify UI. You will need this access token to set the `NETLIFY_AUTH_TOKEN` environment variable in the next step.

### Configure project:

The project setup is done with [team](https://github.com/andybar2/team), that is installed with the development tools. **You only need to do these steps once**, and the rest of your team developers pointing to the same AWS account will automatically inherit the project configuration by just running or deploying the project.

Set environment variables for each stage:

```bash
# Set env:
team env set -s "development" -n "ENV" -v "dev"
team env set -s "production" -n "ENV" -v "prod"

# Set apiboy backend url:
team env set -s "development" -n "APIBOY_BACKEND_URL" -v "http://localhost:3000"
team env set -s "production" -n "APIBOY_BACKEND_URL" -v "<YOUR-BACKEND-URL-FOR-APIBOY>"

# Set netlify site id (use the id returned by the netlify site creation):
team env set -s "production" -n "NETLIFY_SITE_ID" -v "XXXXXXXXX"

# Set netlify auth token (use the access token created from the Netlify UI):
team env set -s "production" -n "NETLIFY_AUTH_TOKEN" -v "XXXXXXXXX"
```

## Execution and Deployment

### Run development stage:

```bash
make dev
```

### Deploy production stage:

```bash
make production
```

### Setup custom domain for the app:

Follow the official instructions on the Netlify docs [here](https://www.netlify.com/docs/custom-domains/). The procedure may be different if you want to use a root domain or a subdomain for your app.

Adding your custom domain to your Netlify site will also enable HTTPS support with SSL certificates that Netlify will automatically generate for you.
