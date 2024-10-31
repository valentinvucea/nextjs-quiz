// components/QuizletQuestionCard.tsx
"use client"; // This marks the component as client-side

import { useState } from "react";

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

interface QuizletQuestionCardProps {
    question: Question;
    index: number;
}

const QuizletQuestionCard = ({ question, index }: QuizletQuestionCardProps) => {
    const [flipped, setFlipped] = useState(false);

    return (
        <div
            className={`relative my-4 p-4 border rounded-lg shadow-md flip-card ${
                flipped ? "flipped" : ""
            }`}
            onClick={() => setFlipped(!flipped)}
        >
            <div className="flip-card-inner">
                <div className="flip-card-front p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">
                        {index + 1}. {question.text}
                    </h2>
                    <ul className="list-none ml-4">
                        {question.answers.map((answer, aIndex) => (
                            <li key={answer.id} className="mt-2 text-left">
                                {String.fromCharCode(65 + aIndex)}.{" "}
                                {answer.text}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="flip-card-back p-4 bg-white rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold">Correct Answer:</h2>
                    <ul className="list-none ml-4">
                        {question.answers
                            .filter((answer) => answer.isCorrect)
                            .map((answer, aIndex) => (
                                <li key={answer.id} className="mt-2 text-left">
                                    {String.fromCharCode(65 + aIndex)}.{" "}
                                    {answer.text}
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default QuizletQuestionCard;
