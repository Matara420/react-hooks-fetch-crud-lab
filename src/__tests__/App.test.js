// src/__tests__/App.test.js

import "@testing-library/jest-dom"; // Essential for toBeInTheDocument() matcher
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import App from "../components/App";

// 1. Define the mock response for the initial GET request
const initialFetchResponse = {
  json: () =>
    Promise.resolve([
      {
        id: 1,
        prompt: "What is 2 + 2?",
        answers: ["3", "4", "5", "6"],
        correctIndex: 1,
      },
      {
        id: 2,
        prompt: "What is the capital of France?",
        answers: ["Berlin", "Madrid", "Paris", "Rome"],
        correctIndex: 2,
      },
    ]),
};

// Mock the fetch API globally using jest.fn().
// This mock will be the default for fetch unless explicitly overridden with mockImplementationOnce.
global.fetch = jest.fn(() => Promise.resolve(initialFetchResponse));

// Clear the fetch mock's call history before each test to ensure fresh state
beforeEach(() => {
  global.fetch.mockClear();
  // Set the default mock implementation for initial GET request for each test
  global.fetch.mockImplementationOnce(() => Promise.resolve(initialFetchResponse));
});

// Test 1: Renders the main header
test("renders Quiz App Admin header", async () => {
  render(<App />); // Render the App component
  await waitFor(() => {
    // Expect to find the text "Quiz App Admin" which is what your App.js renders
    expect(screen.getByText("Quiz App Admin")).toBeInTheDocument();
  });
});

// Test 2: Fetches and displays questions on initial load
test("fetches and displays questions", async () => {
  render(<App />); // Render the App component
  await waitFor(() => {
    // Expect to find a question from the mocked fetch data
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });
  // Verify that fetch was called exactly once for the initial GET request
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(global.fetch).toHaveBeenCalledWith("http://localhost:4000/questions");
});

// Test 3: Adds a new question to the list via the form
test("adds a new question to the list", async () => {
  render(<App />); // Render the App component

  // Since App.js initially shows the question list (isFormVisible: false),
  // we need to click the button to switch to the form view.
  await userEvent.click(
    screen.getByRole("button", { name: /Show New Question Form/i })
  );

  // Wait for the form to appear and become interactive.
  // We wait for the "Prompt:" label which is part of the form.
  await waitFor(() => {
    expect(screen.getByLabelText(/Prompt:/i)).toBeInTheDocument();
  });

  // Fill out the form fields using their accessible labels
  await userEvent.type(
    screen.getByLabelText(/Prompt:/i),
    "What is the capital of Kenya?"
  );
  await userEvent.type(screen.getByLabelText(/Answer 1:/i), "Nairobi");
  await userEvent.type(screen.getByLabelText(/Answer 2:/i), "Mombasa");
  await userEvent.type(screen.getByLabelText(/Answer 3:/i), "Kisumu");
  await userEvent.type(screen.getByLabelText(/Answer 4:/i), "Eldoret");
  // Select the correct answer (index 0 for Answer 1)
  await userEvent.selectOptions(screen.getByLabelText(/Correct Answer:/i), "0");

  // Mock the POST request response *before* clicking the submit button.
  // This ensures the mock is ready when the fetch call is made for the POST.
  global.fetch.mockImplementationOnce((url, options) => {
    if (options && options.method === "POST") {
      return Promise.resolve({
        json: () =>
          Promise.resolve({
            id: 3, // json-server would assign an ID to the new question
            prompt: "What is the capital of Kenya?",
            answers: ["Nairobi", "Mombasa", "Kisumu", "Eldoret"],
            correctIndex: 0,
          }),
      });
    }
    // Fallback for any unexpected fetch calls (e.g., if there's another GET after POST)
    return Promise.resolve({ json: () => Promise.resolve({}) });
  });

  // Click the "Add Question" button to submit the form
  await userEvent.click(screen.getByRole("button", { name: /Add Question/i }));

  // After submitting, the App.js state means the form is still visible (isFormVisible: true).
  // To see the updated list with the new question, we need to click the button to switch back to list view.
  await userEvent.click(
    screen.getByRole("button", { name: /Hide New Question Form/i })
  );

  // Wait for the new question to appear in the displayed list
  await waitFor(() => {
    expect(screen.getByText("What is the capital of Kenya?")).toBeInTheDocument();
  });

  // Verify that fetch was called twice: once for initial GET, once for POST
  expect(global.fetch).toHaveBeenCalledTimes(2);
  // Verify the POST request's details
  expect(global.fetch).toHaveBeenCalledWith(
    "http://localhost:4000/questions",
    expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "What is the capital of Kenya?",
        answers: ["Nairobi", "Mombasa", "Kisumu", "Eldoret"],
        correctIndex: 0,
      }),
    })
  );
});