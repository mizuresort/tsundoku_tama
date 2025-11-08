import { useCallback } from "react";
import { Book, GenreKey, characterTemplates } from "@/app/types";
import { generateDialogue } from "@/app/ai-utils";

/**
 * 本の操作（追加、更新、削除）を行うカスタムフック
 */
export function useBookOperations(
  books: Book[],
  setBooks: React.Dispatch<React.SetStateAction<Book[]>>
) {
  /**
   * 新しい本を追加
   */
  const addBook = useCallback(
    async (
      title: string,
      genre: string,
      totalPage: number,
      coverImage: string,
      reason: string
    ): Promise<Book> => {
      const selectedCharacter =
        characterTemplates[genre as GenreKey] || characterTemplates.magazine;

      // AIメッセージを生成
      const initialDialogue = await generateDialogue({
        title,
        totalPage,
        currentPage: 0,
        reason,
        character: selectedCharacter,
      });

      // 新しい本を作成
      const newBook: Book = {
        id: Date.now().toString(),
        title,
        genre,
        totalPage,
        currentPage: 0,
        coverImage,
        character: selectedCharacter,
        reason,
        latestDialogue: initialDialogue,
        createdAt: Date.now(),
      };

      setBooks((prevBooks) => [...prevBooks, newBook]);
      return newBook;
    },
    [setBooks]
  );

  /**
   * 進捗を更新
   */
  const updateProgress = useCallback(
    async (bookId: string, newPage: number): Promise<Book | null> => {
      const bookToUpdate = books.find((book) => book.id === bookId);
      if (!bookToUpdate) return null;

      // AIメッセージを生成
      const newDialogue = await generateDialogue({
        title: bookToUpdate.title,
        totalPage: bookToUpdate.totalPage,
        currentPage: newPage,
        reason: bookToUpdate.reason,
        character: bookToUpdate.character,
      });

      // 更新後の本を作成
      const updatedBook: Book = {
        ...bookToUpdate,
        currentPage: newPage,
        latestDialogue: newDialogue,
      };

      setBooks((prevBooks) =>
        prevBooks.map((book) => (book.id === bookId ? updatedBook : book))
      );

      return updatedBook;
    },
    [books, setBooks]
  );

  /**
   * 本を削除
   */
  const deleteBook = useCallback(
    (bookId: string) => {
      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
    },
    [setBooks]
  );

  return {
    addBook,
    updateProgress,
    deleteBook,
  };
}


