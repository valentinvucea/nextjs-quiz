import React from "react";
import Navbar from "../components/Navbar";

export default function Layout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <>
            <Navbar />

            <main className="font-work-sans p-5">{children}</main>
        </>
    );
}
