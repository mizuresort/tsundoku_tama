import { Book } from "@/app/types";

const STORAGE_KEY = "tsundoku-books";

/**
 * localStorageから本のデータを読み込む
 * totalPageとcurrentPageが数値であることを保証する
 */
export function loadBooksFromStorage(): Book[] | null {
  if (typeof window === "undefined") return null;
  
  const savedBooks = localStorage.getItem(STORAGE_KEY);
  if (!savedBooks) return null;
  
  try {
    const books: Book[] = JSON.parse(savedBooks);
    // totalPageとcurrentPageが数値であることを保証
    return books.map((book) => ({
      ...book,
      totalPage: typeof book.totalPage === "number" ? book.totalPage : Number(book.totalPage) || 1,
      currentPage: typeof book.currentPage === "number" ? book.currentPage : Number(book.currentPage) || 0,
    }));
  } catch (error) {
    console.error("Failed to parse books from storage:", error);
    return null;
  }
}

/**
 * localStorageに本のデータを保存する
 */
export function saveBooksToStorage(books: Book[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  } catch (error) {
    console.error("Failed to save books to storage:", error);
  }
}

