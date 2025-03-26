import * as fs from "fs";
import * as path from "path";

import prisma from "../app/lib/prisma";

// Define the structure of the JSON data based on the provided file
interface QuestionData {
  domain: number
  module?: string
  questions: {
    text: string
    choices: string[]
    correctAnswers: string[]
    explanation?: string
  }[]
}

async function main() {
  try {
    // Read the JSON file
    const jsonFilePath = path.join(
        __dirname, 
        '../storage/json/aws_ai_practitioner/output/10_amazon_q_business_getting_started.json'
    )
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf-8')
    const source: QuestionData = JSON.parse(jsonContent)

    // Iterate through questions and insert into database
    for (const q of source.questions) {
        const question = await prisma.question.create({
            data: {
                text: q.text,
                module: source.module,
                explanation: q.explanation || null,
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

        console.log(`Imported question with ID: ${question.id}`)
    }

    console.log('Successfully imported all questions and answers.')
  } catch (error) {
    console.error('Error importing questions:', error)
    throw error
  } finally {
    // Disconnect Prisma client
    await prisma.$disconnect()
  }
}

// Run the import function
main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });