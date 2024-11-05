import { fetchUserProfile } from "../../../lib/fetchUserProfile";

const ProfileInfoPage = async () => {
    const userId = 1; // replace with the userId from identity object
    const userProfile = await fetchUserProfile(userId);

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Profile</h1>
            <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                <h2 className="text-2xl font-semibold">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
            </div>
        </div>
    );
};

export default ProfileInfoPage;
