import { useState, useMemo } from "react";
import { auth } from "../config/firebase";
import { awardXP } from "../utils/xp";

const XP_PER_CORRECT_ANSWER = 10;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz({ questions }) {
  const shuffledQuestions = useMemo(
    () => questions.map(q => ({ ...q, options: shuffle(q.options) })),
    []
  );

  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [totalXP, setTotalXP] = useState(null);

  const handleAnswer = async (option) => {
    let newScore = score;
    if (option === shuffledQuestions[current].answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    const next = current + 1;
    if (next < shuffledQuestions.length) {
      setCurrent(next);
    } else {
      setShowResult(true);
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
          <h2>Your Score: {score} / {shuffledQuestions.length}</h2>
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
          <h2>{shuffledQuestions[current].question}</h2>
          <div className="quiz-options">
            {shuffledQuestions[current].options.map((opt, index) => (
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
