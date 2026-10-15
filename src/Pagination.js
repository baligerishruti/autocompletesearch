export const Pagination = ({ currentPage, totalPages, startIndex, endIndex, onPageChange, handlePrevPage, handleNextPage }) => {
    return (
        <div>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                {totalPages > 0 && (
                    <div className="page-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                disabled={currentPage === page}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
}
export default Pagination;