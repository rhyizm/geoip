import { geoip } from "../../src/functions/geoip";
import { HttpRequest, InvocationContext } from "@azure/functions";

describe("GeoIP function", () => {
  let mockContext: InvocationContext;

  beforeAll(async () => {
    mockContext = {
      log: jest.fn(),
      error: jest.fn()
    } as unknown as InvocationContext;

    // 非同期ロード待ち
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  test("8.8.8.8 should return United States", async () => {
    const request = {
      query: new URLSearchParams({ ip: "8.8.8.8" })
    } as HttpRequest;

    const response = await geoip(request, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toBeDefined();
    expect(response.jsonBody?.countryEn).toMatch(/United States/i);
  });

  test("Invalid IP should return 404", async () => {
    const request = {
      query: new URLSearchParams({ ip: "999.999.999.999" })
    } as HttpRequest;

    const response = await geoip(request, mockContext);

    expect(response.status).toBe(404);
  });

  test("Missing IP should return 400", async () => {
    const request = {
      query: new URLSearchParams({})
    } as HttpRequest;

    const response = await geoip(request, mockContext);

    expect(response.status).toBe(400);
  });
});
