import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ScoreCard } from "./ScoreCard";

describe("ScoreCard", () => {
  it("shows a correct result with a green success message", () => {
    render(<ScoreCard isCorrect={true} score={100} feedback="Great job! That's correct." />);

    expect(screen.getByRole("status")).toHaveTextContent("100/100");
    expect(screen.getByText(/great job/i)).toBeInTheDocument();
  });

  it("shows an incorrect result with the given feedback", () => {
    render(<ScoreCard isCorrect={false} score={0} feedback="Not correct — review this topic again." />);

    expect(screen.getByRole("status")).toHaveTextContent("0/100");
    expect(screen.getByText(/review this topic/i)).toBeInTheDocument();
  });

  it("shows partial credit with the orange styling class", () => {
    render(<ScoreCard isCorrect={false} score={40} feedback="Close, but not quite right." />);

    const card = screen.getByRole("status");
    expect(card).toHaveTextContent("40/100");
    expect(card.className).toContain("border-orange-400");
  });
});