"use client"; // This marks the component as client-side

import { useState } from "react";

interface Answer {
    id: number;
    text: string;
    isCorrect: Boolean;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

interface QuizQuestionProps {
    questions: Question[];
}

const QuizQuestion = ({ questions }: QuizQuestionProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [submittedAnswers, setSubmittedAnswers] = useState<number[][]>([]);
    const [results, setResults] = useState<{
        correct: number;
        total: number;
    } | null>(null);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerChange = (answerId: number) => {
        setSelectedAnswers((prev) =>
            prev.includes(answerId)
                ? prev.filter((id) => id !== answerId)
                : [...prev, answerId],
        );
    };

    const handleSubmit = () => {
        setSubmittedAnswers((prev) => [...prev, selectedAnswers]);
        setSelectedAnswers([]);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const correctAnswersCount = submittedAnswers.reduce(
                (acc, answers, index) =>
                    acc +
                    (JSON.stringify(answers.sort()) ===
                    JSON.stringify(
                        questions[index].answers
                            .filter((a) => a.isCorrect)
                            .map((a) => a.id)
                            .sort(),
                    )
                        ? 1
                        : 0),
                0,
            );
            setResults({
                correct: correctAnswersCount,
                total: questions.length,
            });
            saveResultsToDatabase({
                correct: correctAnswersCount,
                total: questions.length,
            });
        }
    };

    if (results) {
        return (
            <div>
                <h2>Results</h2>
                <p>Correct Answers: {results.correct}</p>
                <p>Total Questions: {results.total}</p>
            </div>
        );
    }

    return (
        <div className="relative my-4 p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">
                {currentQuestionIndex + 1}. {currentQuestion.text}
            </h2>
            <ul className="list-none ml-4">
                {currentQuestion.answers.map((answer) => (
                    <li key={answer.id} className="mt-2 text-left">
                        <label>
                            <input
                                type="checkbox"
                                value={answer.id}
                                disabled={
                                    submittedAnswers.length >
                                    currentQuestionIndex
                                }
                                checked={selectedAnswers.includes(answer.id)}
                                onChange={() => handleAnswerChange(answer.id)}
                                className="mr-2"
                            />
                            {answer.text}
                        </label>
                    </li>
                ))}
            </ul>
            <button
                onClick={handleSubmit}
                disabled={submittedAnswers.length > currentQuestionIndex}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
            >
                Submit Answer
            </button>
            <button
                onClick={handleNextQuestion}
                disabled={submittedAnswers.length <= currentQuestionIndex}
                className="mt-4 ml-4 p-2 bg-green-500 text-white rounded"
            >
                Next Question
            </button>
        </div>
    );
};

const saveResultsToDatabase = async (results: {
    correct: number;
    total: number;
}) => {
    try {
        await fetch("/api/saveResults", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(results),
        });
    } catch (error) {
        console.error("Error saving results:", error);
    }
};

export default QuizQuestion;
