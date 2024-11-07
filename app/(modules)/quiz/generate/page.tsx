"use client";

import {
    categoryMap,
    defaultQuizLength,
    defaultQuizPassScore,
    defaultMALength,
} from "@/app/lib/constants";
import { generateQuiz } from "@/app/lib/actions/generateQuiz";
import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";

const QuizGeneratePage = () => {
    const [multipleAnswer, setMultipleAnswer] = useState(defaultMALength);
    const [totalQuestions, setTotalQuestions] = useState(defaultQuizLength);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        formData.set("multipleAnswerCount", multipleAnswer.toString());
        formData.set("total", totalQuestions.toString());

        // Call the generateQuiz function and await its completion
        const results = await generateQuiz(formData);
        console.log(results);

        // The redirect is included in the generateQuiz function
        setIsSubmitting(false);

        // Handle redirection based on the function's response
        if (results && results.success) {
            router.push("/quizzes");
        }
    };

    return (
        <div className="px-6 pt-2">
            <h1 className="text-2xl font-bold mb-6">Generate New Quiz</h1>
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-bold text-gray-700"
                        >
                            Quiz Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            className="w-128 mt-2 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        <p
                            id="helper-text-title"
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            The new quiz title (required).
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="categoryId"
                            className="block text-sm font-bold text-gray-700"
                        >
                            Category
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            className="bg-gray-50 mt-2 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                            defaultValue=""
                        >
                            <option value="" disabled>
                                Select a category
                            </option>
                            {Object.entries(categoryMap).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {" "}
                                    {value}{" "}
                                </option>
                            ))}
                        </select>
                        <p
                            id="helper-text-category"
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            Quiz category (required).
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="totalQuestions"
                            className="block text-sm font-bold text-gray-700"
                        >
                            Total Questions
                        </label>
                        <input
                            id="total"
                            name="total"
                            type="number"
                            value={totalQuestions}
                            onChange={(e) =>
                                setTotalQuestions(Number(e.target.value))
                            }
                            className="mt-2 w-24 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        <p
                            id="helper-text-total"
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            Total number of questions the quiz will have
                            (required).
                        </p>
                    </div>

                    <div>
                        <label
                            htmlFor="passScore"
                            className="block text-sm font-bold text-gray-700"
                        >
                            Passing Score
                        </label>
                        <input
                            id="passScore"
                            name="passScore"
                            type="number"
                            defaultValue={defaultQuizPassScore}
                            className="mt-2 w-24 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                        <p
                            id="helper-text-total"
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            Minimum score needed for passing the test
                            (required).
                        </p>
                    </div>

                    <div>
                        {" "}
                        <label
                            htmlFor="multipleAnswer"
                            className="block text-sm font-bold text-gray-700"
                        >
                            {" "}
                            Number of Multiple Answer Questions{" "}
                        </label>{" "}
                        <input
                            id="multipleAnswerCount"
                            name="multipleAnswerCount"
                            type="range"
                            min="0"
                            max="65"
                            step="1"
                            value={multipleAnswer}
                            onChange={(e) =>
                                setMultipleAnswer(Number(e.target.value))
                            }
                            className="mt-2 w-96 block px-0 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />{" "}
                        <output className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            {" "}
                            {multipleAnswer}{" "}
                        </output>{" "}
                        <p
                            id="helper-text-multiple-answers"
                            className="mt-2 text-sm text-gray-500 dark:text-gray-400"
                        >
                            {" "}
                            How many multiple answer questions will be generated
                            (required).{" "}
                        </p>{" "}
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="mt-5 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Generate Quiz
                        </button>
                    </div>
                </form>
            </div>
            {isSubmitting && (
                <div className="mt-4">
                    {" "}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        {" "}
                        <div
                            className="bg-blue-600 h-2.5 rounded-full animate-pulse"
                            style={{ width: "100%" }}
                        ></div>{" "}
                    </div>{" "}
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {" "}
                        Generating quiz, please wait...{" "}
                    </p>{" "}
                </div>
            )}
        </div>
    );
};

export default QuizGeneratePage;
