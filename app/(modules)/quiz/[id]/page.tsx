import prisma from "../../../lib/prisma";

interface Answer {
    id: number;
    text: string;
}

interface Question {
    id: number;
    text: string;
    answers: Answer[];
}

const fetchQuizData = async (quizId: number) => {
    const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: {
            questions: {
                include: {
                    Question: {
                        include: {
                            answers: true,
                        },
                    },
                },
            },
        },
    });

    return quiz;
};

const QuizPage = async ({ params }: { params: { id: string } }) => {
    const quizId = parseInt(params.id);
    const quiz = await fetchQuizData(quizId);

    return (
        <div className="flex justify-center mt-8">
            <div className="max-w-4xl w-full p-4 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold mb-4">{quiz?.title}</h1>
                <ul className="list-none">
                    {quiz?.questions.map(({ Question }, qIndex) => (
                        <li key={Question.id} className="mb-6">
                            <h2 className="text-lg font-semibold">
                                {qIndex + 1}. {Question.text}
                            </h2>
                            <ul className="list-none ml-6">
                                {Question.answers.map((answer, aIndex) => (
                                    <li key={answer.id} className="mt-2">
                                        {String.fromCharCode(65 + aIndex)}.{" "}
                                        {answer.text}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default QuizPage;
