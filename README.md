# Blocket Docs

## Before start
Blocket docs application will request the github enterprise api and therefore you need to provide a github token. Read more [here](https://pages.github.schibsted.io/blocket/docs/guides-enviroment/github-token) how to create one.
The Blocket Docs application will expect the token to be stored in following file `~/github-token.sh` in your user folder in your linux or unix system.


~/github-token.sh
```shell
export ENV_GITHUB_TOKEN=abc123abc123acb123acb123acb123abc123abc123
```

## Getting started
To start the dev environment of Blocket Docs application by giving following command:
```shell
./dev/start.sh
```

The first thing `./dev/start.sh` file will try to do is to sourse the file `~/github-token.sh` and import your github token, before starting the docker container. The it will dig out the latest release tags from your current checked out version of the repository. That will be displayed in your local pages. This is helpfull if you want to go back in the history for earlier documentation.
