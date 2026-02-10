const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const express = require("express");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/comments/:comment_id", () => {
  test("DELETE 204 - deletes the comment and returns no content", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        return request(app)
          .delete("/api/comments/1")
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Comment ID not found");
          });
      });
  });
  test("DELETE 404 - comment with that id does not exist", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment ID not found");
      });
  });
  test("DELETE 400 - the provided comment id is invalid", () => {
    return request(app)
      .delete("/api/comments/not-a-number")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment ID invalid type");
      });
  });
});

describe("api/comments/:comment_id (PATCH)", () => {
  test("PATCH 200 - Update a comments votes by comment_id", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({
        inc_votes: 5,
      })
      .expect(200)
      .then(({ body }) => {
        const { comment } = body;
        expect(typeof comment.votes).toBe("number");
        expect(comment.comment_id).toBe(2);
      });
  });
  test("PATCH 404 - Responds with an error when the comment ID is nonexistent", () => {
    return request(app)
      .patch("/api/comments/9999")
      .send({
        inc_votes: 5,
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment ID not found");
      });
  });
  test("PATCH 400 - Responds with an error when comment_id is not a number", () => {
    return request(app)
      .patch("/api/comments/not-a-number")
      .send({
        inc_votes: 5,
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment ID invalid type");
      });
  });
  test("PATCH 400 - Responds with an error when votes_inc is undefined", () => {
    return request(app)
      .patch("/api/comments/2")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
});
