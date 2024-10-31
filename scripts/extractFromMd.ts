const fs = require("fs");
const path = require("path");

interface Question {
    text: string;
    choices: string[];
    correctAnswers: string[];
}

function extractQuestions(filePath: string): Question[] {
    const fileContent = fs.readFileSync(filePath, "utf8");

    const questions: Question[] = [];
    let currentQuestion: Question = {
        text: "",
        choices: [],
        correctAnswers: [],
    };
    let collectingChoices = false;

    fileContent.split("\n").forEach((line: string, index: any) => {
        // Identify question lines
        const questionMatch = line.match(/^\d+\.\s*(.*)/);
        if (questionMatch) {
            // Save the previous question (if it exists) before starting a new one
            if (currentQuestion.text) {
                questions.push({ ...currentQuestion });
            }
            // Start a new question
            currentQuestion = {
                text: questionMatch[1],
                choices: [],
                correctAnswers: [],
            };
            collectingChoices = true;
        } else if (collectingChoices && line.trim().match(/^-\s[A-E]\./)) {
            // Identify choice lines
            const choiceMatch = line.trim().match(/^-\s([A-E])\. (.*)/);
            if (choiceMatch) {
                currentQuestion.choices.push(choiceMatch[2].trim());
            }
        } else if (line.includes("Correct answer:")) {
            // Identify answer lines
            const correctAnswerMatch = line.match(/Correct answer:\s*(.*)/);
            if (correctAnswerMatch) {
                currentQuestion.correctAnswers = correctAnswerMatch[1]
                    .split(",")
                    .map((answer) => answer.trim());
                collectingChoices = false;
            }
        }
    });

    // Push the last question
    if (currentQuestion.text) {
        questions.push({ ...currentQuestion });
    }

    return questions;
}

function saveQuestionsToJSON(questions: Question[], jsonFilePath: string) {
    fs.writeFileSync(jsonFilePath, JSON.stringify(questions, null, 2));
    console.log(`Questions saved to ${jsonFilePath}`);
}

// Main function to handle command-line arguments
function main() {
    const args = process.argv.slice(2);
    if (args.length !== 2) {
        throw new Error(
            "Please provide exactly 2 parameters: <source.md> <destination.json>",
        );
    }

    const [sourceFilePath, destinationFilePath] = args;
    const questionsArray = extractQuestions(sourceFilePath);
    saveQuestionsToJSON(questionsArray, destinationFilePath);
}

main();
