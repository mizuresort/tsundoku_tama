"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Settings,
  ChevronRight,
  Plus,
  Trash2,
  BookOpen as BookOpenIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Textarea をインポート
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
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
import { Separator } from "@/components/ui/separator";

// --- 1. TYPES AND TEMPLATES ---

// Character type definition
type Character = {
  type: string;
  emoji: string;
  personality: string;
};

// Book type definition (AI関連フィールドを含む)
type Book = {
  id: string;
  title: string;
  genre: string;
  totalPage: number;
  currentPage: number;
  reason: string; // 購入理由
  latestDialogue: string; // AI生成メッセージ
  coverImage: string;
  character: Character;
  createdAt: number;
};

// Character templates based on genre
const characterTemplates: Record<string, Character> = {
  study: {
    type: "熱血系",
    emoji: "💪",
    personality: "passionate",
  },
  novel: {
    type: "ロマンチスト",
    emoji: "🌸",
    personality: "romantic",
  },
  philosophy: {
    type: "達観系",
    emoji: "🧘",
    personality: "zen",
  },
  magazine: {
    type: "フレンドリー",
    emoji: "😊",
    personality: "friendly",
  },
};
type GenreKey = keyof typeof characterTemplates;

// --- 2. UTILITY FUNCTIONS (MOCKED AI) ---

/**
 * 本のデータとキャラクター情報に基づき、AIにメッセージを生成させる関数 (モック)
 * 実際にはここでGemini APIを呼び出すロジックが入る
 */
async function generateDialogue(bookData: {
  title: string;
  totalPage: number;
  currentPage: number;
  reason: string;
  character: Character;
}): Promise<string> {
  const progress = Math.round(
    (bookData.currentPage / bookData.totalPage) * 100
  );

  // 💡 実行可能にするためのモック（ダミー）応答
  const mockMessages = [
    `進捗${progress}%！「${(bookData.reason || "この本").substring(
      0,
      10
    )}...」を達成するんだ！`,
    `買った理由を忘れてない？ ${bookData.character.emoji}思い出せ！`,
    `あなたの「${bookData.reason}」という夢は、この${bookData.title}の中に。`,
    `${bookData.character.type}からの一言: あと少しで目標に近づくよ！`,
    `まだ${bookData.currentPage}ページ。君の決意が試されているぞ！`,
  ];

  // API呼び出しの代わりにランダムな応答を返す (非同期を維持)
  await new Promise((resolve) => setTimeout(resolve, 800)); // AI応答の遅延をシミュレート
  return mockMessages[Math.floor(Math.random() * mockMessages.length)];
}

// --- 3. SUB COMPONENTS (INCLUDED IN SINGLE FILE) ---

// Home View Component - Book shelf grid
function HomeView({
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

                  {/* Character Dialogue (latestDialogueを表示) */}
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

// Detail View Component - Individual book with character
function DetailView({
  book,
  onUpdateProgress,
  onDelete,
}: {
  book: Book;
  onUpdateProgress: (bookId: string, newPage: number) => Promise<void>;
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

          {/* Character Speech Bubble (latestDialogueを表示) */}
          <div className="bg-indigo-100 dark:bg-indigo-900 rounded-3xl px-6 py-4 max-w-xs relative shadow-md">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rotate-45 border-t border-l border-indigo-200 dark:border-indigo-800" />
            <p className="text-gray-800 dark:text-white font-medium italic">
              {isUpdating ? "🤖 メッセージ生成中..." : book.latestDialogue}
            </p>
          </div>
        </div>
      </Card>

      {/* 購入理由表示エリア */}
      <Card className="p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-indigo-500" />
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

// Add Book Dialog Component
function AddBookDialog({
  isOpen,
  onOpenChange,
  onAddBook,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddBook: (
    title: string,
    genre: string,
    totalPage: number,
    coverImage: string,
    reason: string
  ) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("study");
  const [totalPage, setTotalPage] = useState("300");
  const [coverImage, setCoverImage] = useState("");
  const [reason, setReason] = useState(""); // reason の状態
  const [isLoading, setIsLoading] = useState(false); // 登録中の状態

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // reason も必須チェックに追加
    if (!title || !totalPage || !reason) return;

    setIsLoading(true);

    const imageUrl =
      coverImage ||
      `https://placehold.co/150x200/4f46e5/ffffff?text=${encodeURIComponent(
        title
      )}`;

    await onAddBook(title, genre, Number.parseInt(totalPage), imageUrl, reason);

    // Reset form
    setTitle("");
    setGenre("study");
    setTotalPage("300");
    setCoverImage("");
    setReason("");
    setIsLoading(false);
    onOpenChange(false); // ダイアログを閉じる
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

          {/* 2. 購入理由（新規追加） */}
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

          {/* 3. ジャンル (キャラクター人格の選択) */}
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

          {/* 5. 表紙画像URL (任意) */}
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
      </DialogContent>
    </Dialog>
  );
}

// --- 4. MAIN COMPONENT ---

export default function TsundokuTama() {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentView, setCurrentView] = useState<"home" | "detail">("home");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Load books from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("tsundoku-books");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      // サンプルデータ: 新しい型 (reason, latestDialogue) に対応
      const studyChar: Character = characterTemplates["study" as GenreKey];
      const novelChar: Character = characterTemplates["novel" as GenreKey];

      const sampleBooks: Book[] = [
        {
          id: "1",
          title: "Next.jsとReactの教科書",
          genre: "study",
          totalPage: 350,
          currentPage: 120,
          reason: "この技術をマスターして、ウェブ開発のプロになりたい！",
          latestDialogue: "進捗34%！目標達成のために、熱血パワーで進むぞ！",
          coverImage:
            "https://placehold.co/150x200/505050/ffffff?text=Next.js+React",
          character: studyChar,
          createdAt: Date.now(),
        },
        {
          id: "2",
          title: "海辺の静かな物語",
          genre: "novel",
          totalPage: 280,
          currentPage: 50,
          reason: "忙しい日常から離れて、心が洗われるような感動を得たい。",
          latestDialogue: "🌸素敵な物語が、あなたを待っています...",
          coverImage: "https://placehold.co/150x200/1e40af/ffffff?text=Novel",
          character: novelChar,
          createdAt: Date.now(),
        },
      ];
      setBooks(sampleBooks);
      localStorage.setItem("tsundoku-books", JSON.stringify(sampleBooks));
    }
  }, []);

  // Save books to localStorage whenever they change
  useEffect(() => {
    // booksが空の配列の場合は保存しないようにチェック (初期化時を除く)
    if (books.length > 0) {
      localStorage.setItem("tsundoku-books", JSON.stringify(books));
    }
  }, [books]);

  /**
   * 新しい本を追加し、同時にAIメッセージを生成する
   */
  const addBook = async (
    title: string,
    genre: string,
    totalPage: number,
    coverImage: string,
    reason: string // 購入理由
  ) => {
    const selectedCharacter =
      characterTemplates[genre as GenreKey] || characterTemplates.magazine;

    // 1. AIキャラクターのメッセージを非同期で生成
    const initialDialogue = await generateDialogue({
      title,
      totalPage,
      currentPage: 0,
      reason,
      character: selectedCharacter,
    });

    // 2. 本の情報を登録
    const newBook: Book = {
      id: Date.now().toString(),
      title,
      genre,
      totalPage,
      currentPage: 0,
      coverImage,
      character: selectedCharacter,
      reason, // reason を保存
      latestDialogue: initialDialogue, // 生成したメッセージを保存
      createdAt: Date.now(),
    };
    setBooks([...books, newBook]);
  };

  /**
   * 進捗を更新し、同時にAIメッセージを再生成する
   */
  const updateProgress = async (bookId: string, newPage: number) => {
    const bookToUpdate = books.find((book) => book.id === bookId);
    if (!bookToUpdate) return;

    // 1. 新しい AI メッセージを生成 (API呼び出しをシミュレート)
    const newDialogue = await generateDialogue({
      title: bookToUpdate.title,
      totalPage: bookToUpdate.totalPage,
      currentPage: newPage,
      reason: bookToUpdate.reason,
      character: bookToUpdate.character,
    });

    // 2. 本の状態を更新 (currentPage と latestDialogue の両方を更新)
    const updatedBooks = books.map((book) =>
      book.id === bookId
        ? { ...book, currentPage: newPage, latestDialogue: newDialogue }
        : book
    );

    setBooks(updatedBooks);

    // 3. 詳細ビューの状態も更新
    if (selectedBook?.id === bookId) {
      // setBooksが非同期で実行されるため、selectedBookも明示的に更新する必要がある
      setSelectedBook({
        ...bookToUpdate,
        currentPage: newPage,
        latestDialogue: newDialogue,
      });
    }
  };

  /**
   * 本を削除する
   */
  const deleteBook = (bookId: string) => {
    setBooks(books.filter((book) => book.id !== bookId));
    // 削除後、ホーム画面に戻る
    if (selectedBook?.id === bookId) {
      setSelectedBook(null);
      setCurrentView("home");
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 font-inter">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-4 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
              積読タマ
            </h1>
          </div>
          {currentView === "detail" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentView("home");
                setSelectedBook(null);
              }}
              className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-700"
            >
              <ChevronRight className="w-5 h-5 rotate-180 mr-1" /> 戻る
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentView === "home" ? (
          <HomeView
            books={books}
            onSelectBook={(book) => {
              setSelectedBook(book);
              setCurrentView("detail");
            }}
          />
        ) : (
          selectedBook && (
            <DetailView
              book={selectedBook}
              onUpdateProgress={updateProgress}
              onDelete={() => deleteBook(selectedBook.id)}
            />
          )
        )}
      </main>

      {/* Bottom Navigation (Fixed) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-xl">
        <div className="max-w-2xl mx-auto flex items-center justify-around py-3">
          <Button
            variant={currentView === "home" ? "default" : "ghost"}
            size="sm"
            onClick={() => {
              setCurrentView("home");
              setSelectedBook(null);
            }}
            className="flex flex-col items-center gap-1 transition-all duration-200"
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">本棚</span>
          </Button>

          {/* Add Book Dialog */}
          <AddBookDialog
            isOpen={isAddDialogOpen}
            onOpenChange={setIsAddDialogOpen}
            onAddBook={addBook}
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
    </div>
  );
}
