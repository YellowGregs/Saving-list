import React, { useState, useEffect } from 'react';
import { BookOpen, LogOut } from 'lucide-react';
import { ChapterForm } from './components/ChapterForm';
import { ChapterList } from './components/ChapterList';
import { EditChapterModal } from './components/EditChapterModal';
import { Auth } from './components/Auth';
import { useChapters } from './hooks/useChapters';
import { supabase } from './lib/supabase';
import type { Chapter } from './types';

export default function App() {
  const { chapters, error, loading, addChapter, updateChapter, toggleFavorite, removeChapter } = useChapters();
  const [searchQuery, setSearchQuery] = useState('');
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BookOpen className="h-10 w-10 text-indigo-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-100">Saving List</h1>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center px-4 py-2 text-gray-300 hover:text-gray-100 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        </div>

        <div className="space-y-8">
          <ChapterForm onSubmit={addChapter} />

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search your saving list..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            />

            {loading ? (
              <div className="text-center py-12 text-gray-400">
                Loading your saving list...
              </div>
            ) : (
              <ChapterList
                chapters={filteredChapters}
                onToggleFavorite={toggleFavorite}
                onRemove={removeChapter}
                onEdit={setEditingChapter}
              />
            )}
          </div>
        </div>
      </div>

      {editingChapter && (
        <EditChapterModal
          chapter={editingChapter}
          onClose={() => setEditingChapter(null)}
          onSave={updateChapter}
        />
      )}
    </div>
  );
}
