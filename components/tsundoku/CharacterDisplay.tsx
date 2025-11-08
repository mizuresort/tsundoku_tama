import { Character } from "@/app/types";

interface CharacterDisplayProps {
  character: Character;
  dialogue: string;
  isUpdating?: boolean;
}

export function CharacterDisplay({
  character,
  dialogue,
  isUpdating = false,
}: CharacterDisplayProps) {
  return (
    <>
      {/* Character Display */}
      <div className="flex flex-col items-center gap-2">
        <div className="text-6xl">{character.emoji}</div>
        <div className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
          {character.type}
        </div>
      </div>

      {/* Character Speech Bubble */}
      <div className="bg-indigo-100 dark:bg-indigo-900 rounded-3xl px-6 py-4 max-w-xs relative shadow-md">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-indigo-100 dark:bg-indigo-900 rotate-45 border-t border-l border-indigo-200 dark:border-indigo-800" />
        <p className="text-gray-800 dark:text-white font-medium italic">
          {isUpdating ? "🤖 メッセージ生成中..." : dialogue}
        </p>
      </div>
    </>
  );
}


