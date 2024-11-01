import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const results = await prisma.quiz.findMany();
        return NextResponse.json(results);
    } catch (error) {
        console.error("Error fetching results:", error);

        // Type assertion for error handling
        if (error instanceof Error) {
            return new NextResponse(error.message, { status: 500 });
        } else {
            return new NextResponse("Unknown error occurred", { status: 500 });
        }
    }
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {
        quizId,
        startTime,
        totalTime,
        correctAnswersCount,
        totalQuestions,
        incorrectAnswers,
    } = body;

    try {
        const dataToSave = {
            quizId,
            userId: 1,
            startedAt: new Date(startTime),
            duration: totalTime,
            questionsCount: totalQuestions,
            score: Math.round((correctAnswersCount / totalQuestions) * 100),
            incorrectAnswers,
        };

        const newResult = await prisma.result.create({
            data: dataToSave,
        });

        return NextResponse.json(newResult);
    } catch (error) {
        console.error("Error saving result:", error);
        return NextResponse.error();
    }
}
