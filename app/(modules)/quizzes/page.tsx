import { categoryMap } from "@/app/lib/constants";
import { fetchQuizzesData } from "../../lib/fetchQuizzesData";
import Link from "next/link";
import {
    BookOpenIcon,
    EyeIcon,
    ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

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
                                <Link
                                    href={`/quiz/${quiz.id}/exam`}
                                    passHref
                                    title="Take Quiz"
                                >
                                    <BookOpenIcon className="inline-block w-5 h-5 mr-2 text-blue-500 cursor-pointer" />{" "}
                                </Link>{" "}
                                <Link
                                    href={`/quiz/${quiz.id}/view`}
                                    passHref
                                    title="View Quiz"
                                >
                                    <EyeIcon className="inline-block w-5 h-5 mr-2 text-blue-500 cursor-pointer" />{" "}
                                </Link>{" "}
                                <Link
                                    href={`/quiz/${quiz.id}/quizlet`}
                                    passHref
                                    title="Quizzlet"
                                >
                                    <ClipboardDocumentListIcon className="inline-block w-5 h-5 mr-2 text-blue-500 cursor-pointer" />{" "}
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
