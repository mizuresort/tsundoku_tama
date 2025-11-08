import { useState, useCallback } from "react";
import { Book } from "@/app/types";

type View = "home" | "detail";

/**
 * ナビゲーション状態を管理するカスタムフック
 */
export function useNavigation() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const navigateToHome = useCallback(() => {
    setCurrentView("home");
    setSelectedBook(null);
  }, []);

  const navigateToDetail = useCallback((book: Book) => {
    setSelectedBook(book);
    setCurrentView("detail");
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedBook(null);
  }, []);

  return {
    currentView,
    selectedBook,
    navigateToHome,
    navigateToDetail,
    clearSelection,
  };
}


