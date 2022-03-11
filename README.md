# PeanutHub

This is the architecture of PeanutHub NodeJS Test.

[![CircleCI](https://circleci.com/gh/asad041/peanut-be/tree/main.svg?style=shield)](https://circleci.com/gh/asad041/peanut-be/tree/main)

## Prerequisites

- Docker ([https://docs.docker.com/install](https://docs.docker.com/install))
- NodeJS >`16.x.x` (prefer install with [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm))
- Postgres client (Osx: `brew install postgres`)
- IDE (prefer [https://www.jetbrains.com/webstorm/download](https://www.jetbrains.com/webstorm/download))

## Setup for development:

- Clone repository

```sh
git clone https://github.com/PeanutHubGames/peanuhub-nodejs-test.git
```

- Use nvm to install node

```sh
nvm i
```

- Install node dependencies

```sh
npm i
```

## Test

- Unit tests

```sh
npm run test:unit
```

- Start/stop - restart dependencies

```sh
docker-compose down && docker-compose -f docker-compose.test.yml up --build db
```

## Run

- Run dependencies

```sh
npm run dependencies
```

- Create DB locally

```sh
npm run db:create
```

- Start api services

```sh
npm run service:api
```

## Stop

```sh
docker-compose down
```

## Environment

You can set environment variables in the `.env` file, you can find examples in .env.sample

# Credits

PeanutHub Dev Team
