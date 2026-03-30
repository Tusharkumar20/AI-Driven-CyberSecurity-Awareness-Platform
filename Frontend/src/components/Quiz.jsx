import { useState } from "react";
import { auth } from "../config/firebase";
import { awardXP } from "../utils/xp";

const XP_PER_CORRECT_ANSWER = 10;

export default function Quiz({ questions }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalXP, setTotalXP] = useState(null);

  const handleAnswer = async (option) => {
    let newScore = score;
    if (option === questions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
      // Award XP only if user is logged in
      if (auth.currentUser) {
        const earned = newScore * XP_PER_CORRECT_ANSWER;
        const updatedXP = await awardXP(earned);
        setTotalXP(updatedXP);
      }
    }
  };

  return (
    <div className="quiz-box">
      {showResult ? (
        <div>
          <h2>Your Score: {score} / {questions.length}</h2>
          {totalXP !== null ? (
            <p>+{score * XP_PER_CORRECT_ANSWER} XP earned! Total XP: {totalXP}</p>
          ) : (
            <p>Sign in to save your XP!</p>
          )}
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