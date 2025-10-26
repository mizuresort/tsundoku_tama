//Generate AI prompt and call API

import { Book, Character, GenreKey, characterTemplates } from "./types";

//本のデータ（買った理由）とキャラクター情報（ジャンル）に基づきAIにメッセージを生成させる関数

export async function generateDialogue(bookData: {
  title: string;
  totalPage: number;
  currentPage: number;
  reason: string;
  character: Character;
}): Promise<string> {
  //進捗管理
  const progress = Math.round(
    (bookData.currentPage / bookData.totalPage) * 100
  );

  //プロンプトの構築
  const characterPrompt = `あなたは「${bookData.character.type}」（人格:${bookData.character.personality})です`;
  const infoPrompt = `本「${bookData.title}」の現在の進捗は${progress}%です。この本を買った理由は「${bookData.reason}」です。`;

  //to AI instruction
  const instruction = `${characterPrompt} ${infoPrompt}あなたがこの本の魂として、購入理由と現在の進捗を踏まえて、読者を励まし、読み進めるのを思い出させるための、一言メッセージ（50字以内)を生成してください。`;

  //API呼び出し
  try {
    //Gemini APIを使用する場合の実装例:
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    // Gemini APIクライアントの初期化
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    // APIリクエスト
    const result = await model.generateContent(instruction);
    const response = await result.response;
    const text = response.text();

    // テキストが取得できた場合は返す
    if (text && text.trim()) {
      return text.trim();
    }
  } catch (error) {
    console.error("AI生成エラー:", error);
    return `進捗${progress}%…？ おい、俺たちの約束、忘れちまったのか？`;
  }
}
