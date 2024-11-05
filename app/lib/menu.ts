export const Menu = [
    { title: "Home", submenu: [] },
    {
        title: "Profile",
        submenu: [
            { title: "Info", url: "/profile/info" },
            { title: "Results", url: "/profile" },
        ],
    },
    {
        title: "Quizzes",
        submenu: [
            { title: "List", url: "/quizzes" },
            { title: "Create", url: "/quiz/create" },
            { title: "Generate", url: "/quiz/generate" },
        ],
    },
    {
        title: "Settings",
        submenu: [
            { title: "Users", url: "/users" },
            { title: "Categories", url: "/settings/categories" },
            { title: "Quizzes", url: "/settings/quizzes" },
        ],
    },
];
