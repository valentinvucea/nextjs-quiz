"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            const params = new URLSearchParams(
                Array.from(searchParams.entries()),
            );

            params.set("page", newPage.toString());
            router.push(`?${params.toString()}`);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`p-2 mx-1 rounded ${
                        i === currentPage
                            ? "bg-blue-500 text-white"
                            : "bg-gray-300 text-gray-700"
                    }`}
                >
                    {" "}
                    {i}{" "}
                </button>,
            );
        }
        return pageNumbers;
    };

    return (
        <div className="mt-4 flex justify-end items-center space-x-2">
            {" "}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className={`p-2 bg-gray-300 text-gray-700 rounded ${
                    currentPage <= 1
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-400"
                }`}
            >
                {" "}
                Previous{" "}
            </button>{" "}
            {renderPageNumbers()}{" "}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`p-2 bg-gray-300 text-gray-700 rounded ${
                    currentPage >= totalPages
                        ? "cursor-not-allowed"
                        : "hover:bg-gray-400"
                }`}
            >
                {" "}
                Next{" "}
            </button>{" "}
        </div>
    );
};

export default Pagination;
