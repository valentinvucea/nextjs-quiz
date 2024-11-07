"use client";

import { useState } from "react";

interface Quiz {
    id: number;
    title: string;
    categoryId: number;
    passScore: number;
    active: boolean;
}

interface QuizAnswersPopupProps {
    result: Result;
}

interface Result {
    id: number;
    score: number;
    questionsCount: number;
    startedAt: Date;
    duration: number;
    quiz: Quiz;
}

const IncorrectAnswersPopup = ({ result }: QuizAnswersPopupProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const date = new Date(result.startedAt);
    const formattedDate = date.toLocaleDateString("en-US");
    const formattedTime = date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    });
    const isPass = result.score >= result.quiz.passScore;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-blue-500 hover:underline"
            >
                Show My Answers
            </button>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start mt-8">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg w-1/2 h-128 overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">
                            Quiz: {result.quiz.title}
                        </h2>
                        <button
                            className="absolute top-0 right-0 mt-4 mr-4 text-xl font-bold"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                        <div className="flex justify-start items-center space-x-8 text-lg">
                            <div>No. of questions: {result.questionsCount}</div>
                            <div>Passing Score: {result.quiz.passScore}</div>
                            <div>
                                Date taken: {formattedDate} {formattedTime}
                            </div>
                            <div
                                className={`py-1 px-3 rounded-lg text-white font-bold ${
                                    isPass ? "bg-green-500" : "bg-red-500"
                                }`}
                            >
                                {" "}
                                Score: {result.score}
                                {"% "}
                                {isPass ? "(PASS)" : "(FAIL)"}{" "}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IncorrectAnswersPopup;
