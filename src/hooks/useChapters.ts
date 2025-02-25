import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Chapter, ChapterFormData } from '../types';

export function useChapters() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChapters();
  }, []);

  const fetchChapters = async () => {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChapters(data || []);
    } catch (error) {
      setError('Failed to fetch chapters');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const addChapter = async (data: ChapterFormData) => {
    try {
      const { data: newChapter, error } = await supabase
        .from('chapters')
        .insert([{ ...data, user_id: (await supabase.auth.getUser()).data.user?.id }])
        .select()
        .single();

      if (error) throw error;
      setChapters(prev => [newChapter, ...prev]);
      setError(null);
    } catch (error) {
      setError('Failed to add chapter');
      throw error;
    }
  };

  const updateChapter = async (id: string, data: Partial<ChapterFormData>) => {
    try {
      const { data: updatedChapter, error } = await supabase
        .from('chapters')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setChapters(prev =>
        prev.map(ch => (ch._id === id ? { ...ch, ...updatedChapter } : ch))
      );
      setError(null);
    } catch (error) {
      setError('Failed to update chapter');
      throw error;
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const chapter = chapters.find(ch => ch._id === id);
      if (!chapter) return;

      const { error } = await supabase
        .from('chapters')
        .update({ is_favorite: !chapter.isFavorite })
        .eq('id', id);

      if (error) throw error;
      setChapters(prev =>
        prev.map(ch => (ch._id === id ? { ...ch, isFavorite: !ch.isFavorite } : ch))
      );
      setError(null);
    } catch (error) {
      setError('Failed to update favorite status');
    }
  };

  const removeChapter = async (id: string) => {
    try {
      const { error } = await supabase
        .from('chapters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setChapters(prev => prev.filter(ch => ch._id !== id));
      setError(null);
    } catch (error) {
      setError('Failed to remove chapter');
    }
  };

  return {
    chapters,
    error,
    loading,
    addChapter,
    updateChapter,
    toggleFavorite,
    removeChapter,
  };
}