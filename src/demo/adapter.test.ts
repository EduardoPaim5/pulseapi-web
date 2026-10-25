import axios from "axios";
import { describe, expect, it } from "vitest";
import { createDemoAdapter } from "./adapter";

describe("portfolio demo sandbox", () => {
  it("keeps mutations in one visit and creates a fresh session for another", async () => {
    const first = axios.create({ adapter: createDemoAdapter() });
    await first.post("/api/v1/monitors", { name: "Novo", url: "https://example.com", intervalSec: 60, timeoutMs: 5000 });
    expect((await first.get("/api/v1/monitors")).data).toHaveLength(4);
    expect((await axios.create({ adapter: createDemoAdapter() }).get("/api/v1/monitors")).data).toHaveLength(3);
  });
  it("supports recheck and acknowledgement without an external API", async () => {
    const client = axios.create({ adapter: createDemoAdapter() });
    expect((await client.post("/api/v1/monitors/demo-checkout/recheck")).data.success).toBe(true);
    expect((await client.get("/api/v1/monitors/demo-checkout")).data.lastStatus).toBe("UP");
    await client.post("/api/v1/alerts/demo-alert/ack");
    expect((await client.get("/api/v1/alerts?status=unacked")).data).toEqual([]);
  });
  it("rejects unknown routes, account creation and missing resources instead of falling back to network", async () => {
    const client = axios.create({ adapter: createDemoAdapter() });
    await expect(client.get("/unknown")).rejects.toMatchObject({ response: { status: 404 } });
    await expect(client.post("/api/v1/auth/register", { email: "private@example.com" })).rejects.toMatchObject({ response: { status: 400 } });
    await expect(client.get("/api/v1/monitors/missing")).rejects.toMatchObject({ response: { status: 404 } });
  });
});
