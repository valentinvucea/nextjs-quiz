// components/ClientQuizlet.tsx
"use client"; // Mark as client component

import { useState } from "react";
import QuizletQuestionCard from "./QuizletQuestionCard";

interface Answer {
    id: number;
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

interface ClientQuizletProps {
    questions: Question[];
}

const ClientQuizlet = ({ questions }: ClientQuizletProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            {currentQuestion ? (
                <QuizletQuestionCard
                    key={currentQuestion.id}
                    question={currentQuestion}
                    index={currentQuestionIndex}
                />
            ) : (
                <p>No questions available</p>
            )}
            <button
                className="mt-4 p-2 bg-green-500 text-white rounded"
                onClick={() =>
                    setCurrentQuestionIndex(
                        (prev) => (prev + 1) % questions.length,
                    )
                }
            >
                Next Question
            </button>
        </div>
    );
};

export default ClientQuizlet;
