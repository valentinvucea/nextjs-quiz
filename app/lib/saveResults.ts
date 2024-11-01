// lib/saveResults.ts
export const saveQuizExamResultsToDb = async (results: {
    quizId: number;
    startTime: string;
    totalTime: number;
    correctAnswersCount: number;
    totalQuestions: number;
    incorrectAnswers: {
        questionId: number;
        correctAnswerIds: number[];
        userAnswerIds: number[];
    }[];
}) => {
    try {
        const response = await fetch("/api/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(results),
        });

        if (!response.ok) {
            throw new Error(`Error saving results: ${response.statusText}`);
        }

        const resultData = await response.json();
        console.log("Result saved successfully:", resultData);
    } catch (error) {
        console.log(error);
    }
};
