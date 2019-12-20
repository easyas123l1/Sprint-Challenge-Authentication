const request = require("supertest");

const server = require("./server");

const db = require("../database/dbConfig");

describe("server", () => {
  beforeEach(async () => {
    await db("users").truncate();
  });
  describe("api/auth/register", () => {
    it("should return status 201", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "Fred", password: "password" })
        .then(response => {
          expect(response.status).toBe(201);
        });
    });

    it("should return an id", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "George", password: "password" })
        .then(response => {
          expect(response.body.id);
          expect(response.body.username);
        });
    });
  });

  describe("api/auth/login", () => {
    it("should return status 200", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "George", password: "password" })
        .then(response => {
          return request(server)
            .post("/api/auth/login")
            .send({ username: "George", password: "password" })
            .then(response => {
              expect(response.status).toBe(200);
            });
        });
    });

    it("should return a token", () => {
      return request(server)
        .post("/api/auth/login")
        .send({ username: "George", password: "password" })
        .then(response => {
          expect(response.body.token);
        });
    });
  });

  describe("api/jokes", () => {
    it("should return status 200", () => {
      return request(server)
        .get("/api/jokes")
        .then(response => {
          expect(response.status).toBe(401);
        });
    });

    it("should return jokes", () => {
      return request(server)
        .get("/api/jokes")
        .then(response => {
          expect(response.body.joke);
        });
    });
  });
});
