import { Book, GenreKey, characterTemplates } from "@/app/types";

/**
 * サンプル本のデータを生成
 */
export function createSampleBooks(): Book[] {
  const studyChar = characterTemplates["study" as GenreKey];
  const novelChar = characterTemplates["novel" as GenreKey];

  return [
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
}


