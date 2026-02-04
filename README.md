# NC News

This repo is an Express server built with full TDD.

## Project dependencies

You will need postgreSQL on your machine to run the database
Run `npm install` to install all of the necessary dependencies

## Environment Variables

In order to connect to the database; `connection.js` will need to know the name of the database we're connection to.
This is accesed using `dotenv` and will dynamically grab the variable from the following files:

-`.env.development` -`.env.test`

These files need to be created with the following contents:

```
PGDATABASE=<name of database>
```

## Seeding the database

To seed the data into the relevant databases run the following script:

-`npm run seed-dev` - for dev database -`npm run seed-test` - for test database
