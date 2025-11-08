import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, ScanLine } from "lucide-react";
import { useState } from "react";
import { BarcodeScanner } from "./BarcodeScanner";
import { fetchBookFromOpenBD } from "@/lib/openbd";

interface AddBookDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (
    title: string,
    genre: string,
    totalPage: number,
    coverImage: string,
    reason: string
  ) => Promise<void>;
}

export default function AddBookDialog({
  isOpen,
  onOpenChange,
  onAddBook,
}: AddBookDialogProps) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("study");
  const [totalPage, setTotalPage] = useState("300");
  const [coverImage, setCoverImage] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isFetchingBook, setIsFetchingBook] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = Number.parseInt(totalPage, 10);
    if (!title || !totalPage || !reason || isNaN(pageNum) || pageNum <= 0) {
      return;
    }

    setIsLoading(true);

    const imageUrl =
      coverImage ||
      `https://placehold.co/150x200/4f46e5/ffffff?text=${encodeURIComponent(
        title
      )}`;

    await onAddBook(title, genre, pageNum, imageUrl, reason);

    // Reset form
    setTitle("");
    setGenre("study");
    setTotalPage("300");
    setCoverImage("");
    setReason("");
    setIsLoading(false);
    onOpenChange(false);
  };

  const handleBarcodeScan = async (isbn: string) => {
    setIsFetchingBook(true);
    try {
      const bookInfo = await fetchBookFromOpenBD(isbn);
      if (bookInfo) {
        setTitle(bookInfo.title);
        setGenre(bookInfo.genre);
        if (bookInfo.totalPage > 0) {
          setTotalPage(bookInfo.totalPage.toString());
        }
        if (bookInfo.coverImage) {
          setCoverImage(bookInfo.coverImage);
        }
      } else {
        alert("本の情報を取得できませんでした。手動で入力してください。");
      }
    } catch (error) {
      console.error("Failed to fetch book info:", error);
      alert("本の情報の取得に失敗しました。手動で入力してください。");
    } finally {
      setIsFetchingBook(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="flex flex-col items-center gap-1 bg-indigo-600 hover:bg-indigo-700 rounded-full w-16 h-16 shadow-lg transform transition-transform duration-200 hover:scale-105"
        >
          <Plus className="w-6 h-6 text-white" />
          <span className="text-xs hidden">追加</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-white dark:bg-gray-800 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            新しい本を追加
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* バーコード読み取りボタン */}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsScannerOpen(true)}
              disabled={isLoading || isFetchingBook}
              className="flex-1"
            >
              <ScanLine className="w-4 h-4 mr-2" />
              バーコードをスキャン
            </Button>
          </div>

          {isFetchingBook && (
            <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-blue-700 dark:text-blue-300 text-sm">
              本の情報を取得中...
            </div>
          )}

          {/* 1. 本のタイトル */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              本のタイトル
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：React完全ガイド"
              required
              disabled={isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* 2. 購入理由 */}
          <div className="space-y-2">
            <Label
              htmlFor="reason"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              積んだ理由 (この本を買った理由)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="例：この技術をマスターして転職したいから！"
              required
              disabled={isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white min-h-[80px]"
            />
          </div>

          {/* 3. ジャンル */}
          <div className="space-y-2">
            <Label
              htmlFor="genre"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              ジャンル（タマの人格）
            </Label>
            <Select value={genre} onValueChange={setGenre} disabled={isLoading}>
              <SelectTrigger
                id="genre"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="study">勉強・技術書 💪 (熱血系)</SelectItem>
                <SelectItem value="novel">
                  小説・文学 🌸 (ロマンチスト)
                </SelectItem>
                <SelectItem value="philosophy">
                  哲学・思想 🧘 (達観系)
                </SelectItem>
                <SelectItem value="magazine">
                  雑誌・趣味 😊 (フレンドリー)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 4. 総ページ数 */}
          <div className="space-y-2">
            <Label
              htmlFor="pages"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              総ページ数
            </Label>
            <Input
              id="pages"
              type="number"
              value={totalPage}
              onChange={(e) => setTotalPage(e.target.value)}
              placeholder="300"
              required
              min="1"
              disabled={isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* 5. 表紙画像URL */}
          <div className="space-y-2">
            <Label
              htmlFor="cover"
              className="font-semibold text-gray-700 dark:text-gray-300"
            >
              表紙画像URL（任意）
            </Label>
            <Input
              id="cover"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              disabled={isLoading}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              空欄の場合は自動生成されます
            </p>
          </div>

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "AIメッセージ生成中..." : "本を追加"}
          </Button>
        </form>

        <BarcodeScanner
          isOpen={isScannerOpen}
          onClose={() => setIsScannerOpen(false)}
          onScanSuccess={handleBarcodeScan}
        />
      </DialogContent>
    </Dialog>
  );
}
