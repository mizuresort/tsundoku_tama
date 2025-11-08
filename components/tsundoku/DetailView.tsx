import { Book } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { BookCover } from "./BookCover";
import { CharacterDisplay } from "./CharacterDisplay";
import { BookInfo } from "./BookInfo";
import { ProgressControl } from "./ProgressControl";
import { useProgress } from "@/hooks/useProgress";

interface DetailViewProps {
  book: Book;
  onUpdateProgress: (bookId: string, newPage: number) => Promise<void>;
  onDelete: () => void;
}

export function DetailView({
  book,
  onUpdateProgress,
  onDelete,
}: DetailViewProps) {
  const handleUpdate = async (newPage: number) => {
    await onUpdateProgress(book.id, newPage);
  };

  const {
    localPage,
    isUpdating,
    handlePageChange,
    handlePageCommit,
    handleQuickUpdate,
  } = useProgress(book.currentPage, book.totalPage, handleUpdate);

  return (
    <div className="space-y-6">
      <BookCover title={book.title} coverImage={book.coverImage}>
        <CharacterDisplay
          character={book.character}
          dialogue={book.latestDialogue}
          isUpdating={isUpdating}
        />
      </BookCover>

      <BookInfo book={book} />

      <ProgressControl
        currentPage={book.currentPage}
        totalPage={book.totalPage}
        localPage={localPage}
        isUpdating={isUpdating}
        onPageChange={handlePageChange}
        onPageCommit={handlePageCommit}
        onQuickUpdate={handleQuickUpdate}
      />

      <Button
        variant="destructive"
        className="w-full bg-red-500 hover:bg-red-600 font-bold py-2 shadow-md"
        onClick={onDelete}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        この本を削除
      </Button>
    </div>
  );
}
