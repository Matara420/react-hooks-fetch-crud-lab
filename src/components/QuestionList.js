// src/components/QuestionList.js
import React from "react";
import QuestionItem from "./QuestionItem";

// Receive onDeleteQuestion and onUpdateCorrectAnswer props
function QuestionList({ questions, onDeleteQuestion, onUpdateCorrectAnswer }) {
  return (
    <section>
      <h1>Questions</h1>
      {questions.map((question) => (
        <QuestionItem
          key={question.id} // Use question.id as key for efficient rendering
          question={question}
          onDeleteQuestion={onDeleteQuestion} // Pass delete handler to item
          onUpdateCorrectAnswer={onUpdateCorrectAnswer} // Pass update handler to item
        />
      ))}
    </section>
  );
}

export default QuestionList;