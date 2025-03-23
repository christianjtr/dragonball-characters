import React, { useMemo } from "react";
import { DEFAULT_PAGE_SIZE, DEFAULT_CURRENT_PAGE, DEFAULT_TOTAL_PAGE, ALLOWED_PAGE_SIZES } from "@app-types/Pagination";
import "./Pagination.css";

interface PaginationProps {
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalItems?: number;
    onChangePage: (page: number) => void;
    onChangePageSize: (pageSize: number) => void;
}

const Pagination: React.FC<PaginationProps> = (props): React.JSX.Element => {
    const {
        currentPage = DEFAULT_CURRENT_PAGE,
        totalPages = DEFAULT_TOTAL_PAGE,
        pageSize = DEFAULT_PAGE_SIZE,
        totalItems = 0,
        onChangePage,
        onChangePageSize
    } = props;

    const { startItem, endItem } = useMemo(() => {
        return {
            startItem: (currentPage - 1) * pageSize + 1,
            endItem: Math.min(currentPage * pageSize, totalItems)
        }
    }, [totalItems, currentPage, pageSize]);

    const handleOnChangePageSize = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onChangePageSize(Number(event.currentTarget.value));
    }

    const handleOnNavigate = (direction: "prev" | "next") => {
        const pageNumber = direction === "prev" ? currentPage - 1 : currentPage + 1;

        if (pageNumber >= 1 && pageNumber <= totalPages) {
            onChangePage(pageNumber);
        }
    };

    return (
        <div className="pagination-container">
            <div className="pagination__info-container">
                <p>Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{totalItems}</strong> results</p>
                <p>Page <strong>{currentPage}</strong> out of <strong>{totalPages}</strong></p>
            </div>
            <div className="pagination__pages-container" aria-label="Page navigation">
                <ul className="pagination">
                    <li
                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                        onClick={() => handleOnNavigate("prev")}
                        role="button"
                    >
                        <span className="page-link primary-button">Prev</span>
                    </li>
                    <li
                        className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                        onClick={() => handleOnNavigate("next")}
                        role="button"
                    >
                        <span className="page-link">Next</span>
                    </li>
                </ul>
                <div className="pagination-controls-container">
                    <label htmlFor="pageSizeSelect" aria-label="Page size selector">Page size:</label>
                    <select id="pageSizeSelect" value={pageSize} onChange={handleOnChangePageSize}>
                        {ALLOWED_PAGE_SIZES.map((eachPageSize, index) => (
                            <option key={`page_size_item_${index}`} value={eachPageSize}>{eachPageSize}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export { Pagination };