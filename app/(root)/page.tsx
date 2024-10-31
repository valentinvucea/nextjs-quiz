import prisma from "../lib/prisma";

export default async function Home() {
    const allUsers = await prisma.user.findMany();

    return (
        <>
            <h1 className="text-2xl">Home</h1>

            <h2 className="text-xl my-5">Users:</h2>

            <ul>
                {allUsers.map((user) => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                    </li>
                ))}
            </ul>
        </>
    );
}
