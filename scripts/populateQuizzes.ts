import * as fs from "fs";
import * as path from "path";

import prisma from "../app/lib/prisma";

interface Question {
    text: string;
    choices: string[];
    correctAnswers: string[];
}

async function main() {
    const args = process.argv.slice(2);
    if (args.length !== 3) {
        throw new Error(
            "Please provide exactly 3 parameters: <source.json> <quizTitle> <categoryId>",
        );
    }

    const [filePath, quizTitle, categoryId] = args;
    const fullFilePath = path.resolve(filePath);
    if (!fs.existsSync(fullFilePath)) {
        throw new Error(`File does not exist: ${fullFilePath}`);
    }

    const fileContent = fs.readFileSync(fullFilePath, "utf8");
    const questions: Question[] = JSON.parse(fileContent);

    // Create the quiz with the given title and categoryId
    const quiz = await prisma.quiz.create({
        data: {
            title: quizTitle,
            active: true,
            categoryId: parseInt(categoryId),
        },
    });

    for (const q of questions) {
        const question = await prisma.question.create({
            data: {
                text: q.text,
                answers: {
                    create: q.choices.map((choice, index) => ({
                        text: choice,
                        isCorrect: q.correctAnswers.includes(
                            String.fromCharCode(65 + index),
                        ),
                    })),
                },
            },
        });

        // Create the relationship in the join table
        await prisma.quizQuestion.create({
            data: {
                quizId: quiz.id,
                questionId: question.id,
            },
        });

        console.log(`Created question: ${question.id}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
