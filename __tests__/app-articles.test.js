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
});
