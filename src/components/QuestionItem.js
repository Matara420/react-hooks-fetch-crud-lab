import React from "react";

function QuestionItem({ question, onDelete, onUpdate }) {
  const { id, prompt, answers, correctIndex } = question;

  function handleDeleteClick() {
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "DELETE",
    }).then(() => onDelete(id));
  }

  function handleCorrectAnswerChange(e) {
    const newIndex = parseInt(e.target.value);
    fetch(`http://localhost:4000/questions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => onUpdate(updatedQuestion));
  }

  return (
    <li>
      <h4>{prompt}</h4>
      <ul>
        {answers.map((answer, index) => (
          <li
            key={index}
            style={{ fontWeight: index === correctIndex ? "bold" : "normal" }}
          >
            {answer}
          </li>
        ))}
      </ul>
      <label>
        Correct Answer:
        <select
          value={correctIndex}
          onChange={handleCorrectAnswerChange}
          aria-label="Correct Answer"
        >
          {answers.map((_, index) => (
            <option key={index} value={index}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleDeleteClick}>Delete Question</button>
    </li>
  );
}

export default QuestionItem;
