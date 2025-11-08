import { Book } from "@/app/types";
import { Card } from "@/components/ui/card";
import { BookOpen as BookOpenIcon } from "lucide-react";

interface BookInfoProps {
  book: Book;
}

export function BookInfo({ book }: BookInfoProps) {
  return (
    <Card className="p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
        <BookOpenIcon className="w-5 h-5 text-indigo-500" />
        積読した理由（あなたの熱意）
      </h3>
      <p className="text-base text-gray-600 dark:text-gray-400 break-words p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 italic">
        {book.reason}
      </p>
    </Card>
  );
}


