import { Book } from "@/app/types";
import { BookCard } from "./BookCard";

interface HomeViewProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export function HomeView({ books, onSelectBook }: HomeViewProps) {
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
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={() => onSelectBook(book)}
          />
        ))}
      </div>
    </div>
  );
}
