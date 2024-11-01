"use client"; // This marks the component as client-side
import { useRef, useState } from "react";
import QuizExamResults from "./QuizExamResults";
import { saveQuizExamResultsToDb } from "../lib/saveResults";

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
    quizId: number;
}

const QuizExamQuestion = ({ questions, quizId }: QuizQuestionProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [submittedAnswers, setSubmittedAnswers] = useState<number[][]>([]);
    const [results, setResults] = useState<{
        correct: number;
        total: number;
    } | null>(null);

    // Capture start time when the component initializes
    const startTimeRef = useRef(new Date());

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
            const endTime = new Date();
            const totalTime = Math.round(
                (endTime.getTime() - startTimeRef.current.getTime()) / 1000,
            );

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

            const incorrectAnswers = questions.reduce(
                (acc, question, index) => {
                    const userAnswers = submittedAnswers[index];
                    const correctAnswers = question.answers
                        .filter((a) => a.isCorrect)
                        .map((a) => a.id);
                    if (
                        JSON.stringify(userAnswers.sort()) !==
                        JSON.stringify(correctAnswers.sort())
                    ) {
                        acc.push({
                            questionId: question.id,
                            correctAnswerIds: correctAnswers,
                            userAnswerIds: userAnswers,
                        });
                    }
                    return acc;
                },
                [] as {
                    questionId: number;
                    correctAnswerIds: number[];
                    userAnswerIds: number[];
                }[],
            );

            setResults({
                correct: correctAnswersCount,
                total: questions.length,
            });

            saveQuizExamResultsToDb({
                quizId,
                startTime: startTimeRef.current.toISOString(),
                totalTime,
                correctAnswersCount,
                totalQuestions: questions.length,
                incorrectAnswers,
            });
        }

        setSelectedAnswers([]);
    };

    if (results) {
        return (
            <QuizExamResults
                correct={results.correct}
                total={results.total}
                questions={questions}
                submittedAnswers={submittedAnswers}
            />
        );
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

export default QuizExamQuestion;
