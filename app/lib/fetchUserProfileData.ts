import prisma from "./prisma";

interface Quiz {
    id: number;
    title: string;
    categoryId: number;
    active: boolean;
    passScore: number;
}

interface Result {
    id: number;
    score: number;
    questionsCount: number;
    startedAt: Date;
    duration: number;
    quiz: Quiz;
}

interface UserProfile {
    id: number;
    email: string;
    name: string | null;
    active: boolean;
    results: Result[];
    totalResults: number;
    currentPage: number;
    totalPages: number;
}

const pageSize = 10;

export const fetchUserProfileData = async (
    userId: number,
    page: number = 1,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            results: {
                include: {
                    quiz: true,
                },
                orderBy: { startedAt: "desc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            },
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const totalResults = await prisma.result.count({
        where: { userId: userId },
    });
    const totalPages = Math.ceil(totalResults / pageSize);

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
        results: user.results.map((result) => ({
            id: result.id,
            score: result.score,
            questionsCount: result.questionsCount,
            startedAt: result.startedAt,
            duration: result.duration,
            quiz: {
                id: result.quiz.id,
                title: result.quiz.title,
                categoryId: result.quiz.categoryId,
                passScore: result.quiz.passScore,
                active: result.quiz.active,
            },
        })),
        totalResults: totalResults,
        currentPage: page,
        totalPages: totalPages,
    };
};
