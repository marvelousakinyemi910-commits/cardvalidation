import request from "supertest";
import { createApp } from "../src/app";

const app = createApp();

describe("POST /api/v1/card/validate", () => {
  it("returns 200 and valid: true for a valid card number", async () => {
    const res = await request(app)
      .post("/api/v1/card/validate")
      .send({ cardNumber: "4111111111111111" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: true, cardType: "Visa" });
  });

  it("accepts card numbers formatted with spaces", async () => {
    const res = await request(app)
      .post("/api/v1/card/validate")
      .send({ cardNumber: "4111 1111 1111 1111" });

    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });

  it("returns 200 and valid: false for a well-formed but incorrect card number", async () => {
    const res = await request(app)
      .post("/api/v1/card/validate")
      .send({ cardNumber: "4111111111111112" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ valid: false, cardType: null });
  });

  it("returns 400 when cardNumber is missing", async () => {
    const res = await request(app).post("/api/v1/card/validate").send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it("returns 400 when cardNumber contains non-digit characters", async () => {
    const res = await request(app)
      .post("/api/v1/card/validate")
      .send({ cardNumber: "4111-abcd-1111-1111" });

    expect(res.status).toBe(400);
  });

  it("returns 400 when cardNumber is not a string", async () => {
    const res = await request(app)
      .post("/api/v1/card/validate")
      .send({ cardNumber: 4111111111111111 });

    expect(res.status).toBe(400);
  });

  it("returns 404 for unknown routes", async () => {
    const res = await request(app).get("/api/v1/unknown");

    expect(res.status).toBe(404);
  });
});
