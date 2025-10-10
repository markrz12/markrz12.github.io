import React from "react";

export default function Pagination({ currentPage, totalPages, setCurrentPage, maxPageButtons = 5 }) {
    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center" style={{ backgroundColor: '#0a2b4c', borderRadius: '8px', padding: '8px', margin: 0  }}>
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        aria-label="Previous"
                        style={{ backgroundColor: '#0a2b4c', color: '#ffffff', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                    >
                        &laquo; Poprzednia
                    </button>
                </li>

                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                        totalPages <= maxPageButtons ||
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        (pageNum >= currentPage - Math.floor(maxPageButtons / 2) &&
                            pageNum <= currentPage + Math.floor(maxPageButtons / 2) - (maxPageButtons % 2 === 0 ? 1 : 0))
                    ) {
                        return (
                            <li key={i} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                                <button
                                    className="page-link"
                                    onClick={() => setCurrentPage(pageNum)}
                                    aria-current={currentPage === pageNum ? 'page' : undefined}
                                    style={{
                                        backgroundColor: currentPage === pageNum ? '#ffffff' : '#0a2b4c',
                                        color: currentPage === pageNum ? '#0a2b4c' : '#ffffff',
                                        border: 'none',
                                        margin: '0 2px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {pageNum}
                                </button>
                            </li>
                        );
                    } else if (
                        pageNum === currentPage - Math.floor(maxPageButtons / 2) - (maxPageButtons % 2 === 0 ? 0 : 1) ||
                        pageNum === currentPage + Math.floor(maxPageButtons / 2) + (maxPageButtons % 2 === 0 ? 1 : 0)
                    ) {
                        return (
                            <li key={i} className="page-item disabled">
                                <span className="page-link" style={{ backgroundColor: '#0a2b4c', color: '#ffffff', border: 'none', margin: '0 2px' }}>...</span>
                            </li>
                        );
                    }
                    return null;
                })}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        aria-label="Next"
                        style={{ backgroundColor: '#0a2b4c', color: '#ffffff', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                    >
                        Następna &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
}
