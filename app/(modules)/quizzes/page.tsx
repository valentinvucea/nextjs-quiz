import { categoryMap } from "@/app/lib/constants";
import { fetchQuizzesData } from "../../lib/fetchQuizzesData";
import Link from "next/link";

const QuizzesPage = async ({
    searchParams,
}: {
    searchParams: { page?: string };
}) => {
    const page = searchParams.page ? parseInt(searchParams.page) : 1;

    const { quizzes, totalQuizzes, currentPage, totalPages } =
        await fetchQuizzesData(page);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Quizzes</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">Title</th>
                        <th className="border p-2 text-left">Questions</th>
                        <th className="border p-2 text-left">Category</th>
                        <th className="border p-2 text-center">Status</th>
                        <th className="border p-2 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz) => (
                        <tr key={quiz.id}>
                            <td className="border p-2">{quiz.title}</td>
                            <td className="border p-2">
                                {quiz._count.questions}
                            </td>
                            <td className="border p-2">
                                {categoryMap[quiz.categoryId] || "Unknown"}
                            </td>
                            <td className="border p-2 text-center">
                                <span
                                    className={`px-2 py-1 rounded ${
                                        quiz.active
                                            ? "bg-green-200 text-green-800"
                                            : "bg-red-200 text-red-800"
                                    }`}
                                >
                                    {quiz.active ? "Active" : "Inactive"}
                                </span>
                            </td>
                            <td className="border p-2 text-center">
                                <Link href={`/quiz/${quiz.id}/exam`} passHref>
                                    <svg
                                        className="inline-block w-5 h-5 mr-2 cursor-pointer"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>Take Quiz</title>
                                        <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
                                    </svg>
                                </Link>
                                <Link href={`/quiz/${quiz.id}/view`} passHref>
                                    <svg
                                        className="inline-block w-5 h-5 mr-2 cursor-pointer"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>View Quiz</title>
                                        <path
                                            fillRule="evenodd"
                                            d="M10 2a8 8 0 100 16 8 8 0 000-16zm-2 8a2 2 0 114 0 2 2 0 01-4 0zm10 0a10 10 0 11-20 0 10 10 0 0120 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                                <Link
                                    href={`/quiz/${quiz.id}/quizzlet`}
                                    passHref
                                >
                                    <svg
                                        className="inline-block w-5 h-5 mr-2 cursor-pointer"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <title>Quizzlet</title>
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 4a4 4 0 110 8 4 4 0 010-8z" />
                                    </svg>
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-between items-center">
                <form method="GET">
                    <input type="hidden" name="page" value={currentPage - 1} />
                    <button
                        type="submit"
                        disabled={currentPage <= 1}
                        className={`p-2 bg-gray-300 text-gray-700 rounded ${
                            currentPage <= 1
                                ? "cursor-not-allowed"
                                : "hover:bg-gray-400"
                        }`}
                    >
                        Previous
                    </button>
                </form>
                <span>
                    {currentPage} / {totalPages}
                </span>
                <form method="GET">
                    <input type="hidden" name="page" value={currentPage + 1} />
                    <button
                        type="submit"
                        disabled={currentPage >= totalPages}
                        className={`p-2 bg-gray-300 text-gray-700 rounded ${
                            currentPage >= totalPages
                                ? "cursor-not-allowed"
                                : "hover:bg-gray-400"
                        }`}
                    >
                        Next
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuizzesPage;
