"use client"; // This marks the component as client-side
import { useState } from "react";
import QuizExamResults from "./QuizExamResults";

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

interface QuizQuestionProps {
    questions: Question[];
}

const QuizExamQuestion = ({ questions }: QuizQuestionProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
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
        setSelectedAnswers([]); // Reset selected answers for the next question
    };

    if (results) {
        return (
            <QuizExamResults
                correct={results.correct}
                total={results.total}
                questions={questions}
                submittedAnswers={submittedAnswers}
            />
        ); // Use the new component
    }

    return (
        <div className="relative my-4 p-4 border rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-5">
                {currentQuestionIndex + 1}. {currentQuestion.text}
            </h2>
            <ul className="list-none ml-4 mb-3">
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
                className={`mt-4 p-2 text-white rounded ${
                    submittedAnswers.length > currentQuestionIndex
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-blue-500"
                } hover:bg-blue-700`}
            >
                Submit Answer
            </button>
            <button
                onClick={handleNextQuestion}
                disabled={submittedAnswers.length <= currentQuestionIndex}
                className={`mt-4 ml-4 p-2 text-white rounded ${
                    submittedAnswers.length <= currentQuestionIndex
                        ? "bg-gray-500 cursor-not-allowed"
                        : "bg-green-500"
                } hover:bg-green-700`}
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

export default QuizExamQuestion;
