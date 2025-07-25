import React, { useState, useEffect } from "react";
import QuestionForm from "./QuestionForm";
import QuestionList from "./QuestionList";

function App() {
  const [questions, setQuestions] = useState([]);

  // === FETCH (GET) ALL QUESTIONS ===
  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  // === ADD NEW QUESTION (POST) ===
  function handleAddQuestion(newQuestion) {
    setQuestions([...questions, newQuestion]);
  }

  // === DELETE QUESTION ===
  function handleDeleteQuestion(deletedId) {
    setQuestions(questions.filter((q) => q.id !== deletedId));
  }

  // === PATCH CORRECT INDEX ===
  function handleUpdateCorrectIndex(updatedQuestion) {
    const updatedList = questions.map((q) =>
      q.id === updatedQuestion.id ? updatedQuestion : q
    );
    setQuestions(updatedList);
  }

  return (
    <div>
      <h1>Quiz Admin</h1>
      <QuestionForm onAddQuestion={handleAddQuestion} />
      <QuestionList
        questions={questions}
        onDelete={handleDeleteQuestion}
        onUpdateCorrectIndex={handleUpdateCorrectIndex}
      />
    </div>
  );
}

export default App;
