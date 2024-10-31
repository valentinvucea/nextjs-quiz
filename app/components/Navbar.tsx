import Link from "next/link";

const Navbar = () => {
    return (
        <header className="px-5 py-3 bg-black text-white shadow-sm font-work-sans">
            <nav className="flex justify-between items-center">
                <Link href="/">
                    <h2 className="text-xl">Next.js Quiz</h2>
                </Link>
            </nav>
        </header>
    );
};

export default Navbar;
