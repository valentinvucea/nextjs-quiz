import { fetchUserProfileData } from "../../../../lib/fetchUserProfileData";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } },
) {
    const userId = parseInt(params.id);

    try {
        const userProfile = await fetchUserProfileData(userId);

        console.log(userProfile);

        return NextResponse.json(userProfile);
    } catch (error) {
        console.error("Error fetching user profile:", error);

        // Type assertion for error handling
        if (error instanceof Error) {
            return new NextResponse(error.message, { status: 500 });
        } else {
            return new NextResponse("Unknown error occurred", { status: 500 });
        }
    }
}
