import { fetchUserProfileData } from "../../lib/fetchUserProfileData";
import Link from "next/link";
import IncorrectAnswersPopup from "../../components/IncorrectAnswersPopup";

const ProfilePage = async () => {
    const userId = 1; // Replace with actual user ID logic
    const userProfile = await fetchUserProfileData(userId);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
            </div>
            <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border p-2 text-left">Quiz</th>
                        <th className="border p-2 text-center">Score</th>
                        <th className="border p-2 text-left">Date Taken</th>
                        <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userProfile.results.map((result) => {
                        const isPass = result.score >= result.quiz.passScore;

                        return (
                            <tr key={result.id}>
                                <td className="border p-2">
                                    {result.quiz.title}
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
                                        {result.score}{" "}
                                        {isPass ? "(PASS)" : "(FAIL)"}{" "}
                                    </span>
                                </td>
                                <td className="border p-2">
                                    {new Date(
                                        result.startedAt,
                                    ).toLocaleDateString()}
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

export default ProfilePage;
