// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next-auth", () => ({ getServerSession: vi.fn() }));
vi.mock("../../../lib/auth", () => ({ authOptions: {} }));
vi.mock("../../../lib/db", () => ({
  getUserData: vi.fn(),
  saveUserData: vi.fn(),
}));

import { getServerSession } from "next-auth";
import { getUserData, saveUserData } from "../../../lib/db";
import { GET, PUT } from "./route";

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/data", () => {
  it("returns 401 when there is no session", async () => {
    getServerSession.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
    expect(getUserData).not.toHaveBeenCalled();
  });

  it("returns the signed-in user's stored data", async () => {
    getServerSession.mockResolvedValue({ user: { email: "a@b.com" } });
    getUserData.mockResolvedValue({ tasks: [{ id: "1", text: "hi" }], name: "Alex" });
    const res = await GET();
    const body = await res.json();
    expect(getUserData).toHaveBeenCalledWith("a@b.com");
    expect(body.name).toBe("Alex");
    expect(body.tasks).toEqual([{ id: "1", text: "hi" }]);
  });
});

describe("PUT /api/data", () => {
  it("returns 401 when there is no session", async () => {
    getServerSession.mockResolvedValue(null);
    const req = { json: async () => ({ tasks: [], name: "x" }) };
    const res = await PUT(req);
    expect(res.status).toBe(401);
    expect(saveUserData).not.toHaveBeenCalled();
  });

  it("saves the posted tasks and name for the signed-in user", async () => {
    getServerSession.mockResolvedValue({ user: { email: "a@b.com" } });
    const req = { json: async () => ({ tasks: [{ id: "1" }], name: "Krish" }) };
    const res = await PUT(req);
    expect(saveUserData).toHaveBeenCalledWith("a@b.com", [{ id: "1" }], "Krish");
    const body = await res.json();
    expect(body.ok).toBe(true);
  });
});
