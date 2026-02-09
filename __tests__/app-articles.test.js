const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const express = require("express");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/articles", () => {
  test("GET 200 - Responds with an object with key of articles and value of an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        for (const article of articles) {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
        }
      });
  });
  test("GET 200 - The response will contain a total count of all comments for each article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        for (const article of articles) {
          expect(typeof article.comment_count).toBe("number");
        }
      });
  });

  test("GET 200 - The response will contain a comment_count with the total", () => {
    const dbQuery = db.query(
      `SELECT COUNT(*)::INT AS count FROM comments WHERE article_id = 1;`,
    );
    const apiRequest = request(app).get("/api/articles/1").expect(200);
    return Promise.all([dbQuery, apiRequest]).then(([dbResult, apiResult]) => {
      const dbCount = dbResult.rows[0].dbCount;
      const { article } = apiResult.body;
      const returnedArticle = Array.isArray(article) ? article[0] : article;
      expect(returnedArticle.comment_count).toBe(dbCount);
    });
  });
});

describe("api/articles/:article_id", () => {
  test("GET 200 - Responds with an object with article key, and specific properties based on article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article[0].author).toBe("string");
        expect(typeof article[0].title).toBe("string");
        expect(article[0].article_id).toBe(1);
        expect(typeof article[0].body).toBe("string");
        expect(typeof article[0].topic).toBe("string");
        expect(typeof article[0].created_at).toBe("string");
        expect(typeof article[0].votes).toBe("number");
        expect(typeof article[0].article_img_url).toBe("string");
      });
  });
  test("GET 404 - Responds with an error when given an article_id that doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
  test("GET 400 - Responds with an error when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID invalid type");
      });
  });
});

describe("api/articles/:article_id/comments (GET)", () => {
  test("GET 200 - Responds with an object with comments key, and specific properties based on given article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(typeof comments[0].comment_id).toBe("number");
      });
  });
  test("GET 404 - Responds with an error when given an article_id that doesn't exist in the database", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
  test("GET 400 - Responds with an error when article_id is not a number", () => {
    return request(app)
      .get("/api/articles/not-a-number/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID invalid type");
      });
  });
});

describe("api/articles/:article_id/comments (POST)", () => {
  test("POST 200 - Posts the comment succesfully, and receives the comment back", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        author: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("This is a test comment");
        expect(comment.article_id).toBe(1);
      });
  });
  test("POST 404 - Responds with an error when the article ID is nonexistent", () => {
    return request(app)
      .post("/api/articles/9999/comments")
      .send({
        author: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
  test("POST 400 - Responds with an error when article_id is not a number", () => {
    return request(app)
      .post("/api/articles/not-a-number/comments")
      .send({
        author: "butter_bridge",
        body: "This is a test comment",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID invalid type");
      });
  });
});

describe("api/articles/:article_id (PATCH)", () => {
  test("PATCH 200 - Update an article votes by article_id", () => {
    return request(app)
      .patch("/api/articles/2")
      .send({
        inc_votes: 5,
      })
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(typeof article[0].votes).toBe("number");
        expect(article[0].article_id).toBe(2);
      });
  });
  test("PATCH 404 - Responds with an error when the article ID is nonexistent", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({
        inc_votes: 5,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID not found");
      });
  });
  test("PATCH 400 - Responds with an error when article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({
        inc_votes: 5,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Article ID invalid type");
      });
  });
});

describe("/api/articles?withQueries", () => {
  test("GET 200 - Sorts by votes when query is ?sort_by=votes", () => {
    return request(app)
      .get("/api/articles?sort_by=votes")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        for (let i = 0; i < articles.length - 1; i++) {
          expect(articles[i].votes).toBeGreaterThanOrEqual(
            articles[i + 1].votes,
          );
        }
      });
  });

  test("GET 200 - Sorts by title asc when query is sort_by=title&order=asc", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        for (let i = 0; i < articles.length - 1; i++) {
          expect(
            articles[i].title.localeCompare(articles[i + 1].title),
          ).toBeLessThanOrEqual(0);
        }
      });
  });

  test("200 - GET articles by topic query", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        for (let i = 0; i < articles.length - 1; i++) {
          expect(articles.topic).toBe("cats");
        }
      });
  });

  test("GET 400 - Invalid sort_by", () => {
    return request(app)
      .get("/api/articles?sort_by=notAColumn")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid sort_by query");
      });
  });

  test("400 - Invalid order value", () => {
    return request(app)
      .get("/api/articles?order=sideways")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid order query");
      });
  });

  test("404 - Topic not found", () => {
    return request(app)
      .get("/api/articles?topic=banana")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic not found");
      });
  });
});
