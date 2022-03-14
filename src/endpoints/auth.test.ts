import request from "supertest";
import app from "../app";
import routes from "../routes";
import mockDataService from "../data/mockdb/mockDataService";

beforeAll(() => {
  app.use(mockDataService, routes);
});

describe("POST /auth", () => {
  describe("given valid credentials", () => {
    it("should respond with 200 status code", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(200);
    });

    it("should specify json in the content type header", async () => {
      const credentials = { username: "username", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.headers["content-type"]).toEqual(expect.stringContaining("json"));
    });
  });

  describe("given an invalid password", () => {
    it("should respond with 401 status code", async () => {
      const credentials = { username: "username", password: "invalid" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(401);
    });
  });

  describe("when neither username nor email are provided", () => {
    it("should respond with 400 status code", async () => {
      const response = await request(app).post("/auth").send();
      expect(response.status).toEqual(400);
    });
  });

  describe("when no password is provided", () => {
    it("should respond with 400 status code", async () => {
      const credentials = { username: "username" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(400);
    });
  });

  describe("when no user exists with given username", () => {
    it("should respond with 404 status code", async () => {
      const credentials = { username: "invalid", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(404);
    });
  });

  describe("when no user exists with given email", () => {
    it("should respond with 404 status code", async () => {
      const credentials = { email: "invalid", password: "password" };
      const response = await request(app).post("/auth").send(credentials);
      expect(response.status).toEqual(404);
    });
  });
});