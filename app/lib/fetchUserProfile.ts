import prisma from "./prisma";

interface UserProfile {
    id: number;
    email: string;
    name: string | null;
    active: boolean;
}

export const fetchUserProfile = async (userId: number) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        active: user.active,
    };
};
