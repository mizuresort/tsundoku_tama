import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { calculateProgress, clampPage } from "@/lib/progress";

interface ProgressControlProps {
  currentPage: number;
  totalPage: number;
  localPage: number;
  isUpdating: boolean;
  onPageChange: (page: number) => void;
  onPageCommit: (page: number) => Promise<void>;
  onQuickUpdate: (delta: number) => Promise<void>;
}

export function ProgressControl({
  currentPage,
  totalPage,
  localPage,
  isUpdating,
  onPageChange,
  onPageCommit,
  onQuickUpdate,
}: ProgressControlProps) {
  const progress = calculateProgress(currentPage, totalPage);

  const handleProgressChange = (value: number[]) => {
    onPageChange(value[0]);
  };

  const handleProgressCommit = async (value: number[]) => {
    await onPageCommit(value[0]);
  };

  return (
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
          現在 {localPage} / {totalPage} ページ
        </div>
      </div>

      <Slider
        value={[localPage]}
        onValueChange={handleProgressChange}
        onValueCommit={handleProgressCommit}
        max={totalPage}
        step={1}
        disabled={isUpdating}
        className="py-4 cursor-pointer"
      />

      {/* Quick Jump Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold"
          onClick={() => onQuickUpdate(-50)}
          disabled={isUpdating}
        >
          -50P
        </Button>
        <Button
          variant="outline"
          className="flex-1 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-bold"
          onClick={() => onQuickUpdate(50)}
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
  );
}


