import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BookCoverProps {
  title: string;
  coverImage: string;
  children?: React.ReactNode;
}

export function BookCover({ title, coverImage, children }: BookCoverProps) {
  return (
    <Card className="p-6 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
      <div className="flex flex-col items-center text-center space-y-5">
        <img
          src={coverImage}
          alt={title}
          className="w-40 h-56 object-cover rounded-xl shadow-xl border-4 border-white dark:border-gray-700"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src =
              "https://placehold.co/150x200/cccccc/333333?text=No+Cover";
          }}
        />
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <Separator className="w-1/3 bg-gray-300 dark:bg-gray-600" />
        {children}
      </div>
    </Card>
  );
}
