// src/components/QuestionItem.js
import React from "react";

// Receive question, onDeleteQuestion, and onUpdateCorrectAnswer props
function QuestionItem({ question, onDeleteQuestion, onUpdateCorrectAnswer }) {
  const { id, prompt, answers, correctIndex } = question;

  // Handle delete button click
  function handleDeleteClick() {
    onDeleteQuestion(id); // Call the delete handler passed from App.js with the question's ID
  }

  // Handle dropdown change for correct answer
  function handleCorrectIndexChange(e) {
    const newCorrectIndex = parseInt(e.target.value);
    onUpdateCorrectAnswer(id, newCorrectIndex); // Call update handler with ID and new index
  }

  return (
    <li className="card">
      <h5>{prompt}</h5>
      <label>
        Correct Answer:
        <select defaultValue={correctIndex} onChange={handleCorrectIndexChange}>
          {answers.map((answer, index) => (
            <option key={index} value={index}>
              {answer}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;