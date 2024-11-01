"use client"; // This marks the component as client-side
import { useState } from "react";

interface QuizResultsProps {
    correct: number;
    total: number;
    questions: Question[];
    submittedAnswers: number[][];
}

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

const QuizResults = ({
    correct,
    total,
    questions,
    submittedAnswers,
}: QuizResultsProps) => {
    const [showIncorrect, setShowIncorrect] = useState(false);
    const percentage = (correct / total) * 100;
    const passFail = percentage >= 80 ? "PASS" : "FAIL";

    const handleToggle = () => {
        setShowIncorrect((prev) => !prev);
    };

    return (
        <div className="results-container p-4 border rounded-lg shadow-md">
            <h2
                className={`text-3xl font-bold ${
                    passFail === "PASS" ? "text-green-500" : "text-red-500"
                }`}
            >
                {passFail}
            </h2>
            <p className="text-xl">
                {percentage.toFixed(2)}% ({correct} out of {total} correct)
            </p>

            {correct < total && (
                <button
                    onClick={handleToggle}
                    className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                >
                    {showIncorrect
                        ? "Hide Incorrect Answers"
                        : "Show Incorrect Answers"}
                </button>
            )}

            {showIncorrect && (
                <ul className="incorrect-answers-list mt-4">
                    {questions.map((question, index) => {
                        const userAnswers = submittedAnswers[index];
                        const correctAnswers = question.answers
                            .filter((a) => a.isCorrect)
                            .map((a) => a.id);
                        if (
                            JSON.stringify(userAnswers.sort()) !==
                            JSON.stringify(correctAnswers.sort())
                        ) {
                            return (
                                <li
                                    key={question.id}
                                    className="mt-4 p-4 bg-red-100 border rounded"
                                >
                                    <h3 className="font-semibold">
                                        {question.text}
                                    </h3>
                                    <ul>
                                        {question.answers.map((answer) => (
                                            <li key={answer.id}>
                                                <label
                                                    className={`block ${
                                                        answer.isCorrect
                                                            ? "text-green-500"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={userAnswers.includes(
                                                            answer.id,
                                                        )}
                                                        readOnly
                                                        className="mr-2"
                                                    />
                                                    {answer.text}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        }
                        return null;
                    })}
                </ul>
            )}
        </div>
    );
};

export default QuizResults;
