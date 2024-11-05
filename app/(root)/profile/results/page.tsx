import { fetchUserProfileData } from "../../../lib/fetchUserProfileData";
import Link from "next/link";
import IncorrectAnswersPopup from "../../../components/IncorrectAnswersPopup";

const ProfileResultsPage = async () => {
    const userId = 1; // Replace with actual user ID logic
    const userProfile = await fetchUserProfileData(userId);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Results for {userProfile.name}
            </h1>

            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">Quiz</th>
                        <th className="border p-2 text-center">Questions #</th>
                        <th className="border p-2 text-center">Score</th>
                        <th className="border p-2 text-left">Date Taken</th>
                        <th className="border p-2 text-left">Duration</th>
                        <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userProfile.results.map((result) => {
                        const isPass = result.score >= result.quiz.passScore;
                        const startedAt = new Date(result.startedAt);
                        const dateOptions: Intl.DateTimeFormatOptions = {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                        };
                        const formattedDuration = `${Math.floor(
                            result.duration / 60,
                        )} min ${result.duration % 60} sec`;

                        return (
                            <tr key={result.id}>
                                <td className="border p-2">
                                    {result.quiz.title}
                                </td>
                                <td className="border p-2 text-center">
                                    {result.questionsCount}
                                </td>
                                <td className="border p-2 text-center">
                                    <span
                                        className={`py-1 px-3 rounded-lg text-white font-bold ${
                                            isPass
                                                ? "bg-green-500"
                                                : "bg-red-500"
                                        }`}
                                    >
                                        {" "}
                                        {result.score}
                                        {"% "}
                                        {isPass ? "(PASS)" : "(FAIL)"}{" "}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {startedAt.toLocaleString(
                                        "en-US",
                                        dateOptions,
                                    )}
                                </td>
                                <td className="border p-2">
                                    {formattedDuration}
                                </td>
                                <td className="border p-2">
                                    <Link
                                        href={`/quiz/${result.quiz.id}/view`}
                                        className="text-blue-500 hover:underline mr-4"
                                    >
                                        Show Quiz
                                    </Link>
                                    <IncorrectAnswersPopup result={result} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProfileResultsPage;
