import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";

type Question = { id: number; text: string };

// Fisher-Yates shuffle algorithm
function shuffleArray(array: Question[]): Question[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const { categoryId, title, passScore, total, multipleAnswerCount } = body;

    try {
        // Fetch random multiple answer questions
        const multipleAnswerQuestions = await prisma.$queryRaw<Question[]>`
            SELECT * FROM question
            WHERE "categoryId" = ${categoryId}
            AND (SELECT COUNT(*) FROM answer WHERE "questionId" = question.id AND "isCorrect" = true) > 1
            ORDER BY RANDOM()
            LIMIT ${multipleAnswerCount};
        `;

        // Fetch random multiple choise questions
        const multipleChoiceQuestions = await prisma.$queryRaw<Question[]>`
            SELECT * FROM question
            WHERE "categoryId" = ${categoryId}
            AND (SELECT COUNT(*) FROM answer WHERE "questionId" = question.id AND "isCorrect" = true) = 1
            ORDER BY RANDOM()
            LIMIT ${total - multipleAnswerCount};
        `;

        // Combine and shuffle questions
        let quizQuestions: Question[] = [
            ...multipleAnswerQuestions,
            ...multipleChoiceQuestions,
        ];
        quizQuestions = shuffleArray(quizQuestions);

        // Save the new quiz
        const newQuiz = await prisma.quiz.create({
            data: {
                title,
                categoryId,
                passScore,
                questions: {
                    create: quizQuestions.map((question) => ({
                        questionId: question.id,
                    })),
                },
            },
            include: { questions: true },
        });

        // Return the new quiz object as the response
        return NextResponse.json(newQuiz);
    } catch (error) {
        console.error("Error saving result:", error);
        return NextResponse.error();
    }
}
