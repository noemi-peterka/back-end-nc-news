# NC News API

🔗 **Hosted version:**
https://nc-news-0plp.onrender.com/api

---

## Project Summary

NC News is a RESTful API built with **Node.js, Express, and PostgreSQL**, following a **test-driven development (TDD)** approach.

The API provides endpoints for:

- Articles
- Comments
- Topics
- Users

It is inspired by news / forum-style platforms (e.g. Reddit), allowing users to read articles, comment on them, and vote.

---

## Requirements

To run this project locally, you will need the following:

- **Node.js**: v18+
- **PostgreSQL**: v14+

You can clone the repository with the following:

- `git clone https://github.com/noemi-peterka/back-end-nc-news.git`

---

## Project dependencies

You will need postgreSQL on your machine to run the database
Run `npm install` to install all of the necessary dependencies

## Environment Variables

In order to connect to the database; `connection.js` will need to know the name of the database you're connecting to.
This is accessed using `dotenv` and will dynamically grab the variable from the following files:

- `.env.development`
- `.env.test`

These files need to be created with the following contents:

```
PGDATABASE=<name of database>
```

## Seeding the database

To seed the data into the relevant databases run the following script:

- `npm run seed` - for dev database
- `npm run seed-test` - for test database

---

## Running the server locally

To run the server use:

- `npm start`

The server will run on the following:

- http://localhost:9090

You can run the tests using Jest with the following:

- `npm test`

Tests are written using Jest and Supertest.
The test database is reseeded before each run.

---

## API Endpoints

The following endpoints are available:

- GET /api/topics → responds with a list of all the available topics
- GET /api/users → responds with a list of users
- GET users/:username → responds with a single user based on given username
- GET /api/articles → responds with a list of all available articles
- GET /api/articles/:article_id → responds with a single article by given article_id (must be a number)
- GET /api/articles/:article_id/comments → responds with a list of comments for a given article_id
- POST /api/articles/:article_id/comments → add a comment to given article_id
- POST /api/articles → add an article
- PATCH /api/articles/:article_id → updates an articles votes by given article_id
- PATCH /api/comments/:comment_id → updates a comments votes by given comment_id
- DELETE /api/comments/:comment_id → deletes a comment by given comment_id
- GET /api/articles? + (queries) → allows articles to be filtered and sorted by query parameters
