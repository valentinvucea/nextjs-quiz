"use client";

import Link from "next/link";
import { Menu } from "../lib/menu";
import { useMenu } from "../components/MenuContext";

interface SubmenuItem {
    title: string;
    url: string;
}

interface MenuItem {
    title: string;
    submenu: SubmenuItem[];
}

const Navbar = () => {
    const { submenu, setSubmenu } = useMenu();

    const handleMenuClick = (submenuItems: SubmenuItem[]) => {
        setSubmenu(submenuItems);
    };

    return (
        <>
            <header className="px-5 py-3 bg-black text-white shadow-sm font-work-sans">
                <nav className="flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/">
                            <h2 className="text-xl">Next.js Quiz</h2>
                        </Link>
                        <ul className="flex space-x-4 ml-5">
                            {Menu.map((item: MenuItem, index: number) => (
                                <li
                                    key={index}
                                    onClick={() =>
                                        handleMenuClick(item.submenu)
                                    }
                                >
                                    <button className="text-white">
                                        {item.title}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </header>
            <div className="px-5 py-3 bg-gray-200 text-black">
                <nav className="flex justify-between items-center">
                    {submenu.length > 0 ? (
                        <ul className="flex space-x-4">
                            {submenu.map(
                                (subitem: SubmenuItem, index: number) => (
                                    <li key={index}>
                                        <Link href={subitem.url}>
                                            <button className="text-black">
                                                {subitem.title}
                                            </button>
                                        </Link>
                                    </li>
                                ),
                            )}
                        </ul>
                    ) : (
                        <div className="text-gray-500">
                            No submenu available
                        </div>
                    )}
                </nav>
            </div>
        </>
    );
};

export default Navbar;
