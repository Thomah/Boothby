# Boothby

## Prerequisites

The app require a `postgresql` database with a user granted with sudo on it.

## Configure the app

Configuration is brought to the app with the `dotenv` package. You need a `.env`
file with the following content :

```bash
HOST=localhost
PORT=3000
PGHOST=<database host>
PGPORT=<database port (usually 5432)>
PGDATABASE=<database name>
PGUSER=<database user>
PGPASSWORD=<database users password>
SLACK_CLIENT_ID=<Slack App client ID>
SLACK_CLIENT_SECRET=<Slack App client secret>
```

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run clean
npm run build
```

## Fix code style and formatting issues

If `eslint` and `prettier` are enabled for this project, you can use the
following commands to check code style and formatting issues.

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```
