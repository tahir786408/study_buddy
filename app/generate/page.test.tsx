import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// mock the AI SDK's useChat hook — never call the real API in tests
const mockSendMessage = vi.fn();
let mockMessages: any[] = [];
let mockStatus = "ready";
let mockError: Error | undefined;

vi.mock("@ai-sdk/react", () => ({
  useChat: () => ({
    messages: mockMessages,
    sendMessage: mockSendMessage,
    status: mockStatus,
    error: mockError,
    regenerate: vi.fn(),
  }),
}));

import GeneratePage from "./page";

describe("GeneratePage", () => {
  beforeEach(() => {
    mockMessages = [];
    mockStatus = "ready";
    mockError = undefined;
    mockSendMessage.mockClear();
  });

  it("shows the empty state with clickable examples when there are no messages", () => {
    render(<GeneratePage />);
    expect(screen.getByText(/no quizzes yet/i)).toBeInTheDocument();
    expect(screen.getByText(/water cycle/i)).toBeInTheDocument();
  });

  it("clicking an example sends that message", async () => {
    render(<GeneratePage />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/water cycle/i));

    expect(mockSendMessage).toHaveBeenCalledWith({
      text: "Make me a 5-question quiz on the water cycle",
    });
  });

  it("renders a plain text assistant message", () => {
    mockMessages = [
      {
        id: "1",
        role: "assistant",
        parts: [{ type: "text", text: "Here is your quiz." }],
      },
    ];

    render(<GeneratePage />);
    expect(screen.getByText("Here is your quiz.")).toBeInTheDocument();
  });

  it("shows the pending skeleton while a message is submitted", () => {
    mockStatus = "submitted";
    render(<GeneratePage />);
    // skeleton has no text, so check the empty state is gone instead
    expect(screen.queryByText(/no quizzes yet/i)).not.toBeInTheDocument();
  });

  it("shows a designed error state with a working retry button", () => {
    mockStatus = "error";
    mockError = new Error("Something interrupted the response.");

    render(<GeneratePage />);
    expect(screen.getByText(/wasn't lost/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders the checkAnswer tool result as a ScoreCard", () => {
    mockMessages = [
      {
        id: "2",
        role: "assistant",
        parts: [
          {
            type: "tool-checkAnswer",
            state: "output-available",
            output: { isCorrect: true, score: 100, feedback: "Great job!" },
          },
        ],
      },
    ];

    render(<GeneratePage />);
    expect(screen.getByRole("status")).toHaveTextContent("100/100");
  });
});