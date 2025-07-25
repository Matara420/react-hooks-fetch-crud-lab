import React, { useState } from "react";

function QuestionForm({ onAddQuestion }) {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    const newQuestion = { prompt, answers, correctIndex: parseInt(correctIndex) };

    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    })
      .then((res) => res.json())
      .then((data) => {
        onAddQuestion(data);
        // Reset form
        setPrompt("");
        setAnswers(["", "", "", ""]);
        setCorrectIndex(0);
      });
  }

  function handleAnswerChange(index, value) {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>New Question</h2>
      <input
        type="text"
        placeholder="Enter question prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      {answers.map((ans, idx) => (
        <input
          key={idx}
          type="text"
          placeholder={`Answer ${idx + 1}`}
          value={ans}
          onChange={(e) => handleAnswerChange(idx, e.target.value)}
        />
      ))}
      <select value={correctIndex} onChange={(e) => setCorrectIndex(e.target.value)}>
        {answers.map((_, idx) => (
          <option key={idx} value={idx}>
            {`Answer ${idx + 1}`}
          </option>
        ))}
      </select>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;
