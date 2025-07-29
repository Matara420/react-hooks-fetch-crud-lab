// src/components/QuestionForm.js
import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");
  const [answer4, setAnswer4] = useState("");
  const [correctIndex, setCorrectIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newQuestion = {
      prompt: prompt,
      answers: [answer1, answer2, answer3, answer4],
      correctIndex: parseInt(correctIndex), // Ensure correctIndex is an integer
    };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newQuestion),
    })
      .then((r) => r.json())
      .then((data) => {
        // Call the callback function from App.js to add the new question to state
        onAddQuestion(data);
        // Clear the form fields after successful submission
        setPrompt("");
        setAnswer1("");
        setAnswer2("");
        setAnswer3("");
        setAnswer4("");
        setCorrectIndex(0);
      })
      .catch((error) => {
        console.error("Error adding question:", error);
      });
  };

  return (
    <section>
      <h1>New Question</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Prompt:
          <input
            type="text"
            name="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </label>
        <label>
          Answer 1:
          <input
            type="text"
            name="answer1"
            value={answer1}
            onChange={(e) => setAnswer1(e.target.value)}
          />
        </label>
        <label>
          Answer 2:
          <input
            type="text"
            name="answer2"
            value={answer2}
            onChange={(e) => setAnswer2(e.target.value)}
          />
        </label>
        <label>
          Answer 3:
          <input
            type="text"
            name="answer3"
            value={answer3}
            onChange={(e) => setAnswer3(e.target.value)}
          />
        </label>
        <label>
          Answer 4:
          <input
            type="text"
            name="answer4"
            value={answer4}
            onChange={(e) => setAnswer4(e.target.value)}
          />
        </label>
        <label>
          Correct Answer:
          <select
            name="correctIndex"
            value={correctIndex}
            onChange={(e) => setCorrectIndex(e.target.value)}
          >
            <option value="0">Answer 1</option>
            <option value="1">Answer 2</option>
            <option value="2">Answer 3</option>
            <option value="3">Answer 4</option>
          </select>
        </label>
        <button type="submit">Add Question</button>
      </form>
    </section>
  );
}

export default QuestionForm;