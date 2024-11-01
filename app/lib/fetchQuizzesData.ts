import prisma from "./prisma";

const pageSize = 10; // Number of items per page

export const fetchQuizzesData = async (page: number = 1) => {
    const quizzes = await prisma.quiz.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
            _count: {
                select: {
                    questions: true,
                },
            },
        },
    });

    const totalQuizzes = await prisma.quiz.count();

    return {
        quizzes,
        totalQuizzes,
        currentPage: page,
        totalPages: Math.ceil(totalQuizzes / pageSize),
    };
};
