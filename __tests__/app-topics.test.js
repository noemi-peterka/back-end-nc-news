const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const express = require("express");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/topics", () => {
  test("GET 200 - Responds with all the topics description and slug", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        for (const topic of topics) {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
        }
      });
  });
});
