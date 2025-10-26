import { Book } from "./types";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import { Trash2, BookOpen } from "lucide-react"; // BookOpen を追加

// Detail View Component - Individual book with character
export default function DetailView({
  book,
  onUpdateProgress,
  onDelete,
}: {
  book: Book;
  onUpdateProgress: (bookId: string, newPage: number) => Promise<void>; // 💡 Promise<void> に変更
  onDelete: () => void;
}) {
  const progress = Math.round((book.currentPage / book.totalPage) * 100);
  const [localPage, setLocalPage] = useState(book.currentPage);
  const [isUpdating, setIsUpdating] = useState(false); // 更新中の状態

  useEffect(() => {
    setLocalPage(book.currentPage);
  }, [book.currentPage]);

  const handleProgressChange = (value: number[]) => {
    setLocalPage(value[0]);
  };

  // 進捗スライダーの変更が完了したときにAIメッセージを更新
  const handleProgressCommit = async (value: number[]) => {
    setIsUpdating(true);
    await onUpdateProgress(book.id, value[0]);
    setIsUpdating(false);
  };

  // クイックボタン用ハンドラ
  const handleQuickUpdate = async (delta: number) => {
    const newPage = Math.min(book.totalPage, Math.max(0, localPage + delta));
    setLocalPage(newPage);
    setIsUpdating(true);
    await onUpdateProgress(book.id, newPage);
    setIsUpdating(false);
  };

  return (
    <div className="space-y-6">
      {/* Book Cover & Character & Dialogue */}
      <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
        <div className="flex flex-col items-center text-center space-y-5">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-40 h-56 object-cover rounded-xl shadow-xl border-4 border-white dark:border-gray-700"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src =
                "https://placehold.co/150x200/cccccc/333333?text=No+Cover";
            }}
          />
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {book.title}
          </h2>
          <Separator className="w-1/3 bg-gray-300 dark:bg-gray-600" />

          {/* Character Display */}
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl">{book.character.emoji}</div>
            <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              {book.character.type}
            </div>
          </div>

          {/* Character Speech Bubble */}
          <div className="bg-indigo-100 dark:bg-indigo-900 rounded-3xl px-6 py-4 max-w-xs relative shadow-md">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rotate-45 border-t border-l border-indigo-200 dark:border-indigo-800" />
            <p className="text-gray-800 dark:text-white font-medium italic">
              {isUpdating ? "🤖 メッセージ生成中..." : book.latestDialogue}
            </p>
          </div>
        </div>
      </Card>

      {/* ✨ 購入理由表示エリア */}
      <Card className="p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-500" />
          積読した理由（あなたの熱意）
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-400 break-words p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 italic">
          {book.reason}
        </p>
      </Card>

      {/* Progress Control */}
      <Card className="p-6 space-y-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label className="text-xl font-bold text-gray-900 dark:text-white">
              読書進捗
            </Label>
            <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
              {progress}%
            </span>
          </div>
          <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
            現在 {localPage} / {book.totalPage} ページ
          </div>
        </div>

        <Slider
          value={[localPage]}
          onValueChange={handleProgressChange}
          onValueCommit={handleProgressCommit}
          max={book.totalPage}
          step={1}
          disabled={isUpdating}
          className="py-4 cursor-pointer"
        />

        {/* Quick Jump Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold"
            onClick={() => handleQuickUpdate(-50)}
            disabled={isUpdating}
          >
            -50P
          </Button>
          <Button
            variant="outline"
            className="flex-1 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold"
            onClick={() => handleQuickUpdate(50)}
            disabled={isUpdating}
          >
            +50P
          </Button>
        </div>

        {progress === 100 && (
          <div className="bg-green-100 dark:bg-green-900/50 rounded-xl p-4 text-center space-y-2 border border-green-300 dark:border-green-800 mt-4">
            <div className="text-4xl">🎉</div>
            <p className="font-bold text-green-700 dark:text-green-300">
              完読おめでとうございます！
            </p>
          </div>
        )}
      </Card>

      {/* Delete Button */}
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
