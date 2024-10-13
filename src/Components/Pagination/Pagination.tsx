import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import style from './Pagination.module.css';

interface PaginationProps {
  itemsPerPage: number;
  totalItems: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // حساب عدد الصفحات الكلي
  const maxPageNumbersToShow = 4; // عدد الأزرار المرقمة التي ستظهر
  const pageNumbers: (number | string)[] = []; // تغيير نوع البيانات ليقبل رقم أو سلسلة

  // تحديد زر Next
  const nextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // تحديد زر Previous
  const prevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  // إضافة النقاط للدلالة على وجود صفحات إضافية
  if (totalPages <= 1) {
    return null; // لا تظهر عنصر التصفح إذا كان هناك صفحة واحدة فقط
  }

  // تحديد الصفحات لعرضها في الأزرار
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxPageNumbersToShow) {
    if (currentPage <= Math.ceil(maxPageNumbersToShow / 2)) {
      endPage = maxPageNumbersToShow; // الصفحات الأولى
    } else if (currentPage + Math.floor(maxPageNumbersToShow / 2) >= totalPages) {
      startPage = totalPages - maxPageNumbersToShow + 1; // الصفحات الأخيرة
    } else {
      startPage = currentPage - Math.floor(maxPageNumbersToShow / 2);
      endPage = currentPage + Math.floor(maxPageNumbersToShow / 2);
    }
  }

  // ضمان عدم تجاوز الحدود
  startPage = Math.max(1, startPage);
  endPage = Math.min(totalPages, endPage);

  // إضافة النقاط قبل الصفحات المرقمة
  if (startPage > 2) {
    pageNumbers.push(1);
    if (startPage > 3) pageNumbers.push('...'); // إضافة النقاط
  }

  // إضافة الصفحات المرقمة
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // إضافة النقاط بعد الصفحات المرقمة
  if (endPage < totalPages - 1) {
    pageNumbers.push('...');
    pageNumbers.push(totalPages);
  } else if (endPage < totalPages) {
    pageNumbers.push(totalPages);
  }

  return (
    <nav>
      <ul className={style.pagination}>
        {/* زر Previous */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button onClick={prevPage} className="page-link" aria-disabled={currentPage === 1}>
            <FontAwesomeIcon icon={faAngleLeft} />
          </button>
        </li>

        {/* عرض الصفحات المرقمة */}
        {pageNumbers.map((number, index) =>
          typeof number === 'number' ? (
            <li key={number} className={`page-item ${currentPage === number ? style.active : ''}`}>
              <button onClick={() => paginate(number)} className="page-link">
                {number}
              </button>
            </li>
          ) : (
            <li key={`ellipsis-${index}`} className="page-item disabled">
              <span className="page-link">...</span>
            </li>
          )
        )}

        {/* زر Next */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button onClick={nextPage} className="page-link" aria-disabled={currentPage === totalPages}>
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
