// src/components/App.js
import React, { useState, useEffect } from "react";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

function App() {
  const [questions, setQuestions] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false); // CHANGED: Set to false to display questions initially

  useEffect(() => {
    fetch("http://localhost:4000/questions")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error("Error fetching questions:", error);
      });
  }, []);

  function handleToggleFormClick() {
    setIsFormVisible(!isFormVisible);
  }

  const handleAddQuestion = (newQuestion) => {
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const handleDeleteQuestion = (idToDelete) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== idToDelete)
    );
    fetch(`http://localhost:4000/questions/${idToDelete}`, {
      method: "DELETE",
    })
      .then((r) => {
        if (!r.ok) {
          console.error("Failed to delete question on server.");
        }
        return r.json();
      })
      .catch((error) => {
        console.error("Error deleting question:", error);
      });
  };

  const handleUpdateCorrectAnswer = (idToUpdate, newCorrectIndex) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === idToUpdate
          ? { ...question, correctIndex: newCorrectIndex }
          : question
      )
    );
    fetch(`http://localhost:4000/questions/${idToUpdate}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ correctIndex: newCorrectIndex }),
    })
      .then((r) => r.json())
      .then((updatedQuestion) => {
        console.log("Question updated on server:", updatedQuestion);
      })
      .catch((error) => {
        console.error("Error updating question:", error);
      });
  };

  return (
    <main>
      <h1>Quiz App Admin</h1> {/* This is the text the test should look for */}
      <button onClick={handleToggleFormClick}>
        {isFormVisible ? "Hide New Question Form" : "Show New Question Form"}
      </button>
      {isFormVisible ? (
        <QuestionForm onAddQuestion={handleAddQuestion} />
      ) : (
        <QuestionList
          questions={questions}
          onDeleteQuestion={handleDeleteQuestion}
          onUpdateCorrectAnswer={handleUpdateCorrectAnswer}
        />
      )}
    </main>
  );
}

export default App;