import { useState, useEffect, useCallback } from "react";

/**
 * 進捗管理を行うカスタムフック
 */
export function useProgress(
  initialPage: number,
  totalPage: number,
  onUpdate: (newPage: number) => Promise<void>
) {
  const [localPage, setLocalPage] = useState(initialPage);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setLocalPage(initialPage);
  }, [initialPage]);

  const handlePageChange = useCallback((page: number) => {
    setLocalPage(page);
  }, []);

  const handlePageCommit = useCallback(
    async (page: number) => {
      setIsUpdating(true);
      await onUpdate(page);
      setIsUpdating(false);
    },
    [onUpdate]
  );

  const handleQuickUpdate = useCallback(
    async (delta: number) => {
      const newPage = Math.min(totalPage, Math.max(0, localPage + delta));
      setLocalPage(newPage);
      setIsUpdating(true);
      await onUpdate(newPage);
      setIsUpdating(false);
    },
    [localPage, totalPage, onUpdate]
  );

  return {
    localPage,
    isUpdating,
    handlePageChange,
    handlePageCommit,
    handleQuickUpdate,
  };
}


