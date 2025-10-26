import { Book, Character } from "./types";
import { Card } from "@/components/ui/card";
import React from "react";
import { Trash2 } from "lucide-react"; // Trash2 を追加

// Book type definition (再インポートの代わりに、直接 Book を使用)
// type Book = { ... }

// Home View Component - Book shelf grid
export default function HomeView({
  books,
  onSelectBook,
}: {
  books: Book[];
  onSelectBook: (book: Book) => void;
}) {
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600 dark:text-gray-400">
        <div className="text-6xl mb-4">📚</div>
        <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          本棚が空です
        </h2>
        <p className="mb-6">下の＋ボタンから本を追加しましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        あなたの積読タマたち
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {books.map((book) => {
          const progress = Math.round(
            (book.currentPage / book.totalPage) * 100
          );
          return (
            <Card
              key={book.id}
              className="p-4 cursor-pointer hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              onClick={() => onSelectBook(book)}
            >
              <div className="flex gap-4">
                {/* Book Cover */}
                <div className="flex-shrink-0">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-20 h-28 object-cover rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src =
                        "https://placehold.co/150x200/cccccc/333333?text=No+Cover";
                    }}
                  />
                </div>

                {/* Book Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate mb-1">
                    {book.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-2xl">{book.character.emoji}</span>
                    <span className="font-medium">{book.character.type}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-400">
                      <span>
                        {book.currentPage} / {book.totalPage}ページ
                      </span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Character Dialogue */}
                  <div className="bg-indigo-50 dark:bg-indigo-900/50 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-800">
                    <p className="font-semibold">{book.latestDialogue}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
