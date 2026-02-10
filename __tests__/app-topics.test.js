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

describe("api/topics (POST)", () => {
  test("POST 200 - Posts the topic succesfully, and receives the topic back", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "sport",
        description: "For anything sport related",
      })
      .expect(201)
      .then(({ body }) => {
        const { topic } = body;
        expect(topic.slug).toBe("sport");
        expect(topic.description).toBe("For anything sport related");
      });
  });
  test("POST 400 - If topic already exists gives an error", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "cats",
        description: "For anything sport related",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Topic already exists");
      });
  });
  test("POST 400 - Responds with an error when one of the fields is missing", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "sport",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("POST 400 - Responds with an error when a field is the wrong type", () => {
    return request(app)
      .post("/api/topics")
      .send({
        slug: "sport",
        description: 2,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid field type");
      });
  });
});
