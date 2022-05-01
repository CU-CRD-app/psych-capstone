# Psych Capstone

Development for the CU psychology department's CRD research app.

**More documentation can be found under [docs](docs/).**

## Contact Us

Professor Josh Correll (sponsored the app and is the one using it for research): <br>
  joshua.correll@colorado.edu
  
Dev Team Year 3: <br>
  ryan.drew@colorado.edu <br>
  Naif.Alassaf@colorado.edu <br>
  Logan.Mann@colorado.edu <br>
  Yosan.Russom@colorado.edu <br>
  
Dev Team Year 2 (US): <br>
  Alvaro.Santillan@colorado.edu <br>
  guxu4949@colorado.edu <br>
  Liyang.Ru@colorado.edu <br>
  Madison.Rivas@colorado.edu <br>
  siya7259@colorado.edu <br>

Dev Team Year 1: <br>
  gale9647@colorado.edu <br>
  alsa6908@colorado.edu <br>
  ka.chen@colorado.edu <br>
  mahon@colorado.edu <br>
  
## Front end

Run this from the front-end directory to start the app:
``ionic serve``

Or include the '-l' parameter for a mobile view:
``ionic serve -l``

## Back end

Run this from root to start a server:
``node index.js``

Must include an auth.json file with a DATABASE_URL parameter to connect to a database when running locally.

## Docker

To run a full stack locally using docker compose:

``docker-compose -f scripts/docker-compose.yaml -p psych-capstone up``

teardown:

``docker-compose -f scripts/docker-compose.yaml -p psych-capstone down``

If you are using rootless podman, be sure to use docker-compose@1.29.2 and [dnsname](https://github.com/containers/dnsname/blob/main/README_PODMAN.md) installed.
Then run the following to point docker-compose to the podman socket:

```
systemctl start --user podman.socket
export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock
```

For more details, please read the guide here from [Fedora Magazine](https://fedoramagazine.org/use-docker-compose-with-podman-to-orchestrate-containers-on-fedora/).
For details on why docker-compose version 1.29.2 is required, rather than 2+, please see [this issue](https://github.com/containers/podman/issues/11822).
