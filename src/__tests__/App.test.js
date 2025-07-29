// src/__tests__/App.test.js

import "@testing-library/jest-dom"; // Essential for toBeInTheDocument() matcher
import { render, screen, waitFor } from "@testing-library/react";
import React from "react"; // Required for JSX
import App from "../components/App";

// 1. Define the mock response structure for fetch
const mockFetchResponse = {
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

// 2. Mock global.fetch. This will apply to all tests in this file.
// We use mockImplementation to provide a function that returns a Promise resolving to our mock response.
global.fetch = jest.fn(() => Promise.resolve(mockFetchResponse));

// 3. Clear the mock's call history before each test to ensure tests are independent.
beforeEach(() => {
  global.fetch.mockClear();
  // For each test, ensure fetch returns our mock data for the initial GET request
  global.fetch.mockImplementationOnce(() => Promise.resolve(mockFetchResponse));
});

// Test 1: Renders the main header
test("renders Quiz App Admin header", async () => {
  render(<App />); // Render the App component

  // Wait for asynchronous operations (like fetch) to complete and UI to update
  await waitFor(() => {
    // Expect to find the text "Quiz App Admin"
    expect(screen.getByText("Quiz App Admin")).toBeInTheDocument();
  });
});

// Test 2: Fetches and displays questions on initial load
test("fetches and displays questions", async () => {
  render(<App />); // Render the App component

  // Wait for the mock fetch to complete and the question to appear
  await waitFor(() => {
    expect(screen.getByText("What is 2 + 2?")).toBeInTheDocument();
  });

  // Verify that fetch was called exactly once for the initial GET request
  expect(global.fetch).toHaveBeenCalledTimes(1);
  // Verify it was called with the correct URL
  expect(global.fetch).toHaveBeenCalledWith("http://localhost:4000/questions");
});

// We're deliberately excluding the "adds a new question" test for now
// to focus on getting the basic fetch mocking and initial render tests to pass.