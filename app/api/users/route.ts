// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request: NextRequest) {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
    const { email, name } = await request.json();
    const user = await prisma.user.create({
        data: {
            email,
            name,
        },
    });
    return NextResponse.json(user);
}
