<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Installation

```bash
$ yarn
```

## Running the app

```bash
# pre all
$ make run # starts database

$ yarn migration:run # runs generated migrations

# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

Swagger can be found on `/api` path.

## Test

As I believe more in testing whole app with database than just mock te db response,
database is required to run the tests.

*Disclaimer:* please ensure that you run `yarn start` at least once before trying to test -> currency data is pulled on program start, somehow it doesn't want to work with tests.

```bash
# pre tests
$ make run # start database

$ yarn start:dev # let it run until you see `info: Currency data updated`

CTRL+C to stop, and you are ready for testing;

# unit tests
$ yarn test

# test coverage
$ yarn test:cov
```
