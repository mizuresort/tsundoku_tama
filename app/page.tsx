"use client";

import { useState } from "react";
import { useBooks } from "@/hooks/useBooks";
import { useNavigation } from "@/hooks/useNavigation";
import { Header } from "@/components/tsundoku/Header";
import { Navigation } from "@/components/tsundoku/Navigation";
import { HomeView } from "@/components/tsundoku/HomeView";
import { DetailView } from "@/components/tsundoku/DetailView";

export default function TsundokuTama() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { books, addBook, updateProgress, deleteBook } = useBooks();
  const { currentView, selectedBook, navigateToHome, navigateToDetail } =
    useNavigation();

  const handleDeleteBook = (bookId: string) => {
    deleteBook(bookId);
    if (selectedBook?.id === bookId) {
      navigateToHome();
    }
  };

  const handleUpdateProgress = async (bookId: string, newPage: number) => {
    const updatedBook = await updateProgress(bookId, newPage);
    if (selectedBook?.id === bookId && updatedBook) {
      navigateToDetail(updatedBook);
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50 dark:bg-gray-900 font-inter">
      <Header currentView={currentView} onBack={navigateToHome} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        {currentView === "home" ? (
          <HomeView books={books} onSelectBook={navigateToDetail} />
        ) : (
          selectedBook && (
            <DetailView
              book={selectedBook}
              onUpdateProgress={handleUpdateProgress}
              onDelete={() => handleDeleteBook(selectedBook.id)}
            />
          )
        )}
      </main>

      <Navigation
        currentView={currentView}
        isAddDialogOpen={isAddDialogOpen}
        onAddDialogChange={setIsAddDialogOpen}
        onNavigateHome={navigateToHome}
        onAddBook={addBook}
      />
    </div>
  );
}
