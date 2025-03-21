import React from 'react';
import type { Pagination as PaginationType } from '@app-types/Pagination';
import './Pagination.css';

interface PaginationProps {
    meta?: PaginationType.Meta;
    links?: PaginationType.Links;
    onPageChange?: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ meta, links }) => {
    const currentPage = meta?.currentPage || 1;
    const totalPages = meta?.totalPages || 1;

    const getPageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages = [1, 2, 3, 4, '...', totalPages];
            } else if (currentPage >= totalPages - 2) {
                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
            } else {
                pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
            }
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination">
                <li className={`page-item ${!links?.previous ? 'disabled' : ''}`}>
                    <a className="page-link" href={links?.previous || '#'} aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                {pageNumbers.map((page, index) => (
                    <li className={`page-item ${currentPage === page ? 'active' : ''}`} key={index}>
                        {typeof page === 'number' ? (
                            <a className="page-link" href={`https://dragonball-api.com/api/characters?page=${page}&limit=10`}>
                                {page}
                            </a>
                        ) : (
                            <span className="page-link">{page}</span>
                        )}
                    </li>
                ))}
                <li className={`page-item ${!links?.next ? 'disabled' : ''}`}>
                    <a className="page-link" href={links?.next || '#'} aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export { Pagination };