"use client";

import { createContext, useState, ReactNode, useContext } from "react";

interface SubmenuItem {
    title: string;
    url: string;
}

interface MenuContextType {
    submenu: SubmenuItem[];
    setSubmenu: (submenu: SubmenuItem[]) => void;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: ReactNode }) => {
    const [submenu, setSubmenu] = useState<SubmenuItem[]>([]);

    return (
        <MenuContext.Provider value={{ submenu, setSubmenu }}>
            {children}
        </MenuContext.Provider>
    );
};

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenu must be used within a MenuProvider");
    }
    return context;
};
