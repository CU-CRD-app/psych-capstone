# Deployment Setup Notes

Project has the following components:

* **Backend HTTP API:** Used for user and training management, offloading resources from the front-end application. 
Deployed as a Heroku Dyno. All resources for this are found in the root of the project as `js` files.
* **Front-end Web and Mobile App:** Where users sign-up and train. All code for this aspect of the project can be
  found under `front-end`. Build using angularjs and ionic.
* **Postgresql:** Database for user and training data. Also stored in Heroku as a part of the backend's dyno.

These three components can be stood-up using the docker-compose file found under `scripts`. It was provided as a
convenience for testing changes locally.

Here are a couple of gotchas to think about here:

* JWT tokens are used to authenticate users after they login. Need a public/private rsa keypair in order to set this up,
  exposed to the backend through the `public` and `secret` environment variables respectively.
  Use `scripts/genkeypair.js` to create keypairs if needed, however the `docker-compose` file sets this up for you.
* The postgres client [pg](https://node-postgres.com/) performs certificate verification when connecting to postgres.
  Currently, heroku does not support postgres databases with verifiable certificates, therefore ssl verification
  for the postgres client has been *disabled*. This is why the snakeoil certs are used within the postgres
  container in the docker-compose file.
* The testing heroku project is set to autobuild and deploy the backend after the front-end Github Action Worfklow
  successfully builds.

