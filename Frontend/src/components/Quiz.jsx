import { useState } from "react";

export default function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[current].answer) {
      setScore(score + 1);
    }

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
    }
  };
  
  return (
    <div className="quiz-box">

      {showResult ? (
        <div>
          <h2>Your Score: {score} / {questions.length}</h2>
          <button onClick={() => window.location.reload()}>
            Restart Quiz
          </button>
        </div>
      ) : (
        <>
          <h2>{questions[current].question}</h2>

          <div className="quiz-options">
            {questions[current].options.map((opt, index) => (
              <button key={index} onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  );
}