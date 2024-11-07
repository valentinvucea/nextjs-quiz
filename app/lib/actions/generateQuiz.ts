"use server";

export async function generateQuiz(formData: FormData) {
    console.log("FormData:", formData);

    const formObject = Object.fromEntries(formData.entries());

    console.log("formObject:", formObject);

    const convertedFormObject = {
        ...formObject,
        categoryId: parseInt(formObject.categoryId as string),
        total: parseInt(formObject.total as string),
        passScore: parseInt(formObject.passScore as string),
        multipleAnswerCount: parseInt(formObject.multipleAnswerCount as string),
    };

    console.log("ConvertedFormObject:", convertedFormObject);

    try {
        const response = await fetch(
            "http://localhost:3000/api/quiz/generate",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(convertedFormObject),
            },
        );

        if (!response.ok) {
            // Log the detailed error response
            const errorResponse = await response.json();
            console.error(
                `Response NOT OK: ${response.statusText}`,
                errorResponse,
            );
            throw new Error(`Response NOT OK: ${response.statusText}`);
        }

        const resultData = await response.json();

        return {
            success: true,
            data: resultData,
        };
    } catch (err) {
        // Assert the type of error to provide more specific logging
        if (err instanceof Error) {
            console.error("Error:", err.message);
            //console.error("Stack Trace:", err.stack);
            //console.error("Full Error:", err);
        } else {
            console.error("Unknown Error:", err);
        }
    }
}
