import { Character } from "./types";

/**
 * 本のデータとキャラクター情報に基づき、AIにメッセージを生成させる関数
 * 実際にはここでGemini APIを呼び出すロジックが入る
 */
export async function generateDialogue(bookData: {
  title: string;
  totalPage: number;
  currentPage: number;
  reason: string;
  character: Character;
}): Promise<string> {
  const progress = Math.round(
    (bookData.currentPage / bookData.totalPage) * 100
  );

  // API呼び出し（Gemini APIを使用する場合）
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (apiKey) {
    try {
      // Gemini APIを使用する場合の実装
      // 注意: @google/generative-ai パッケージが必要です
      // const { GoogleGenerativeAI } = await import("@google/generative-ai");
      // const genAI = new GoogleGenerativeAI(apiKey);
      // const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      // const instruction = `あなたは「${bookData.character.type}」（人格:${bookData.character.personality})です。本「${bookData.title}」の現在の進捗は${progress}%です。この本を買った理由は「${bookData.reason}」です。あなたがこの本の魂として、購入理由と現在の進捗を踏まえて、読者を励まし、読み進めるのを思い出させるための、一言メッセージ（50字以内)を生成してください。`;
      // const result = await model.generateContent(instruction);
      // const response = await result.response;
      // const text = response.text();
      // if (text && text.trim()) {
      //   return text.trim();
      // }
    } catch (error) {
      console.error("AI生成エラー:", error);
    }
  }

  // モック実装（APIキーがない場合、またはエラー時）
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

  // AI応答の遅延をシミュレート
  await new Promise((resolve) => setTimeout(resolve, 800));
  return mockMessages[Math.floor(Math.random() * mockMessages.length)];
}
