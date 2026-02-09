const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const request = require("supertest");
const app = require("../app");
const express = require("express");

beforeAll(() => seed(data));
afterAll(() => db.end());

describe("/api/users", () => {
  test("GET 200 - Responds with an object with key of users and value of an array of objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        for (const user of users) {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        }
      });
  });
});

describe("api/users/:username", () => {
  test("GET 200 - Responds with a user object, based on given username", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        const { user } = body;
        expect(user[0].username).toBe("butter_bridge");
        expect(user[0].name).toBe("jonny");
        expect(user[0].avatar_url).toBe(
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        );
      });
  });
  test("GET 404 - Responds with an error when given a username that doesn't exist in the database", () => {
    return request(app)
      .get("/api/users/test")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Username not found");
      });
  });
});
