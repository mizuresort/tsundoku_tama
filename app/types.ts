//1.character type define
export type Character = {
  type: string;
  emoji: string;
  personality: string;
};

//2.Book type define
export type Book = {
  id: string;
  title: string;
  genre: string;
  totalPage: number;
  currentPage: number;
  reason: string; //なぜこの本を買ったのか
  latestDialogue: string;
  coverImage: string;
  character: Character;
  createdAt: number;
};

//Character templetes based on genre

export const characterTemplates: Record<string, Character> = {
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

// ジャンルキーの型定義（安全なアクセス用）
export type GenreKey = keyof typeof characterTemplates;
