import { useState } from "react";

export function usePagination(initialPage = 0, initialSize = 10) {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);

  return {
    page,
    size,
    setPage,
    setSize,
  };
}
