import { describe, it, expect, vi, beforeEach } from "vitest";
import { createElement as h } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
}));

import { useSession } from "next-auth/react";
import Home from "./page";

function mockAuthenticated() {
  useSession.mockReturnValue({
    data: { user: { email: "a@b.com", name: "Tester" } },
    status: "authenticated",
  });
}

async function addTask(user, input, text) {
  await user.clear(input);
  await user.type(input, text);
  await user.click(screen.getByRole("button", { name: "Add task" }));
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn().mockResolvedValue({ json: async () => ({ tasks: [], name: "Tester" }) });
});

describe("sign-in gate", () => {
  it("shows the Google sign-in screen when unauthenticated", async () => {
    useSession.mockReturnValue({ data: null, status: "unauthenticated" });
    render(h(Home));
    expect(await screen.findByText("Sign in with Google")).toBeInTheDocument();
  });

  it("shows nothing app-related while the session is loading", () => {
    useSession.mockReturnValue({ data: null, status: "loading" });
    render(h(Home));
    expect(screen.queryByText("Sign in with Google")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("What needs your attention?")).not.toBeInTheDocument();
  });
});

describe("authenticated app", () => {
  it("adds a new task to the list", async () => {
    mockAuthenticated();
    const user = userEvent.setup();
    render(h(Home));
    const input = await screen.findByPlaceholderText("What needs your attention?");
    await addTask(user, input, "Buy milk");
    expect(await screen.findByText("Buy milk")).toBeInTheDocument();
  });

  it("moves a completed task below incomplete ones", async () => {
    mockAuthenticated();
    const user = userEvent.setup();
    const { container } = render(h(Home));
    const input = await screen.findByPlaceholderText("What needs your attention?");
    await addTask(user, input, "First task");
    await addTask(user, input, "Second task");
    await screen.findByText("Second task");

    const titles = () => Array.from(container.querySelectorAll(".task-copy strong")).map(el => el.textContent);
    expect(titles()).toEqual(["Second task", "First task"]);

    const checkboxes = container.querySelectorAll(".check input[type=checkbox]");
    await user.click(checkboxes[0]); // "Second task" is first since newest tasks are prepended

    expect(titles()).toEqual(["First task", "Second task"]);
  });

  it("deletes a task via its detail view and can undo it", async () => {
    mockAuthenticated();
    const user = userEvent.setup();
    render(h(Home));
    const input = await screen.findByPlaceholderText("What needs your attention?");
    for (const name of ["A", "B", "C", "D"]) await addTask(user, input, name);

    await user.click(await screen.findByText(/View all 4 tasks/));
    const dialog = screen.getByRole("dialog", { name: "All tasks" });
    await user.click(within(dialog).getByText("D"));
    await user.click(await screen.findByText("Delete task"));
    expect(screen.queryByText("D")).not.toBeInTheDocument();

    // selecting a task closes the popup, so after undo "D" only exists in the main list
    await user.click(await screen.findByText("Undo"));
    expect(await screen.findByText("D")).toBeInTheDocument();
  });

  it("filters the list by search text", async () => {
    mockAuthenticated();
    const user = userEvent.setup();
    render(h(Home));
    const input = await screen.findByPlaceholderText("What needs your attention?");
    await addTask(user, input, "Buy milk");
    await addTask(user, input, "Walk the dog");
    await screen.findByText("Buy milk");

    const search = screen.getByPlaceholderText("Search tasks…");
    await user.type(search, "milk");

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(screen.queryByText("Walk the dog")).not.toBeInTheDocument();
  });

  it("greets with Good morning during morning hours", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-09-07T09:00:00"));
    mockAuthenticated();
    render(h(Home));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(/^Good morning,/);
    vi.useRealTimers();
  });

  it("greets with Good afternoon during afternoon hours", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-09-07T14:00:00"));
    mockAuthenticated();
    render(h(Home));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(/^Good afternoon,/);
    vi.useRealTimers();
  });

  it("greets with Good evening during evening and night hours", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date("2026-09-07T20:00:00"));
    mockAuthenticated();
    render(h(Home));
    expect(await screen.findByRole("heading", { level: 1 })).toHaveTextContent(/^Good evening,/);
    vi.useRealTimers();
  });
});

