import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../components/App";
import '@testing-library/jest-dom'; // 🛠 Required for toBeInTheDocument()

beforeEach(() => {
  jest.spyOn(global, "fetch").mockResolvedValueOnce({
    ok: true,
    json: async () => [
      {
        id: 1,
        prompt: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correctIndex: 1,
      },
    ],
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("renders QuizMaster Admin header", async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("QuizMaster Admin")).toBeInTheDocument();
  });
});

test("fetches and displays questions", async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });
});

test("adds a new question to the list", async () => {
  render(<App />);

  // Fill form
  userEvent.type(screen.getByLabelText(/Prompt:/i), "What is the capital of Kenya?");
  const answerInputs = screen.getAllByLabelText(/Answer \d:/i);
  userEvent.type(answerInputs[0], "Nairobi");
  userEvent.type(answerInputs[1], "Mombasa");
  userEvent.type(answerInputs[2], "Kisumu");
  userEvent.type(answerInputs[3], "Eldoret");
  userEvent.selectOptions(screen.getByLabelText(/Correct Answer/i), "0");

  // Mock POST response
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      id: 2,
      prompt: "What is the capital of Kenya?",
      answers: ["Nairobi", "Mombasa", "Kisumu", "Eldoret"],
      correctIndex: 0,
    }),
  });

  // Submit form
  userEvent.click(screen.getByRole("button", { name: /submit question/i }));

  // Check new question appears
  await waitFor(() => {
    expect(screen.getByText("What is the capital of Kenya?")).toBeInTheDocument();
  });
});
