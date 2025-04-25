export const handlePageChange = (
    page: number,
    totalPages: number,
    setCurrentPage: (page: number) => void
  ) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  