import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-4 mt-8 font-retro">
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className="px-4 py-2 bg-white border-2 border-retro-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 shadow-[2px_2px_0_rgba(33,37,41,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all text-xs"
      >
        PREV
      </button>
      <span className="font-bold text-sm text-retro-light tracking-wider">
        PAGE {currentPage} OF {totalPages}
      </span>
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-white border-2 border-retro-light disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 shadow-[2px_2px_0_rgba(33,37,41,1)] active:translate-y-[1px] active:translate-x-[1px] active:shadow-none transition-all text-xs"
      >
        NEXT
      </button>
    </div>
  );
};

export default Pagination;
