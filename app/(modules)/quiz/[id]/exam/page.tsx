import prisma from "../../../../lib/prisma";
import QuizExamQuestion from "../../../../components/QuizExamQuestion";

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

let quizCache: { [key: string]: any } = {};

const fetchQuizData = async (quizId: number) => {
    if (quizCache[quizId]) {
        return quizCache[quizId];
    }

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

    // Restructure the questions to match your expected Question interface
    const formattedQuiz = {
        ...quiz,
        questions: quiz?.questions.map((q) => ({
            id: q.Question.id,
            text: q.Question.text,
            answers: q.Question.answers.map((a) => ({
                id: a.id,
                text: a.text,
                isCorrect: a.isCorrect,
            })),
        })),
    };

    quizCache[quizId] = formattedQuiz; // Cache the result
    return formattedQuiz;
};

const QuizExamPage = async ({ params }: { params: { id: string } }) => {
    const quizId = parseInt(params.id);
    const quiz = await fetchQuizData(quizId);

    return (
        <div className="flex justify-center mt-8">
            <div className="max-w-4xl w-full p-3 bg-white rounded-lg">
                <h1 className="text-2xl font-bold mb-6">{quiz?.title}</h1>
                <QuizExamQuestion
                    questions={quiz?.questions || []}
                    quizId={quiz?.id || 0}
                    passScore={quiz?.passScore || 80}
                />
            </div>
        </div>
    );
};

export default QuizExamPage;
