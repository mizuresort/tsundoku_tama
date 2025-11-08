import { BookOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddBookDialog from "./AddBookDialog";

interface NavigationProps {
  currentView: "home" | "detail";
  isAddDialogOpen: boolean;
  onAddDialogChange: (open: boolean) => void;
  onNavigateHome: () => void;
  onAddBook: (
    title: string,
    genre: string,
    totalPage: number,
    coverImage: string,
    reason: string
  ) => Promise<unknown>;
}

export function Navigation({
  currentView,
  isAddDialogOpen,
  onAddDialogChange,
  onNavigateHome,
  onAddBook,
}: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-xl">
      <div className="max-w-2xl mx-auto flex items-center justify-around py-3">
        <Button
          variant={currentView === "home" ? "default" : "ghost"}
          size="sm"
          onClick={onNavigateHome}
          className="flex flex-col items-center gap-1 transition-all duration-200"
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-xs">本棚</span>
        </Button>

        <AddBookDialog
          isOpen={isAddDialogOpen}
          onOpenChange={onAddDialogChange}
          onAddBook={onAddBook}
        />

        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 text-gray-500 dark:text-gray-400"
        >
          <Settings className="w-5 h-5" />
          <span className="text-xs">設定</span>
        </Button>
      </div>
    </nav>
  );
}

