import { useState, useEffect } from "react";
import { Book } from "@/app/types";
import { loadBooksFromStorage, saveBooksToStorage } from "@/lib/storage";
import { createSampleBooks } from "@/lib/bookFactory";
import { useBookOperations } from "./useBookOperations";

/**
 * 本のデータ管理を行うカスタムフック
 */
export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const { addBook, updateProgress, deleteBook } = useBookOperations(
    books,
    setBooks
  );

  // 初期化時にlocalStorageから本を読み込む
  useEffect(() => {
    const savedBooks = loadBooksFromStorage();
    if (savedBooks) {
      setBooks(savedBooks);
    } else {
      const sampleBooks = createSampleBooks();
      setBooks(sampleBooks);
      saveBooksToStorage(sampleBooks);
    }
  }, []);

  // booksが変更されたらlocalStorageに保存
  useEffect(() => {
    if (books.length > 0) {
      saveBooksToStorage(books);
    }
  }, [books]);

  return {
    books,
    addBook,
    updateProgress,
    deleteBook,
  };
}

