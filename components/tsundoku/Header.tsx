import { BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  currentView: "home" | "detail";
  onBack?: () => void;
}

export function Header({ currentView, onBack }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm">
      <div className="max-w-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
            積読タマ
          </h1>
        </div>
        {currentView === "detail" && onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
          >
            <ChevronRight className="w-5 h-5 rotate-180 mr-1" /> 戻る
          </Button>
        )}
      </div>
    </header>
  );
}
