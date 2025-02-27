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
      
      const mappedChapters = data?.map(item => ({
        _id: item.id,
        title: item.title,
        Chapter: item.Chapter || item.chapter || '',
        url: item.url,
        isFavorite: item.is_favorite,
        addedAt: item.created_at
      })) || [];
      
      setChapters(mappedChapters);
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
        .insert([{ 
          title: data.title,
          Chapter: data.Chapter,
          url: data.url,
          user_id: (await supabase.auth.getUser()).data.user?.id 
        }])
        .select()
        .single();

      if (error) throw error;
      
      const mappedChapter = {
        _id: newChapter.id,
        title: newChapter.title,
        Chapter: newChapter.Chapter || newChapter.chapter || '',
        url: newChapter.url,
        isFavorite: newChapter.is_favorite,
        addedAt: newChapter.created_at
      };
      
      setChapters(prev => [mappedChapter, ...prev]);
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
        .update({
          title: data.title,
          Chapter: data.Chapter,
          url: data.url
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const mappedChapter = {
        _id: updatedChapter.id,
        title: updatedChapter.title,
        Chapter: updatedChapter.Chapter || updatedChapter.chapter || '',
        url: updatedChapter.url,
        isFavorite: updatedChapter.is_favorite,
        addedAt: updatedChapter.created_at
      };
      
      setChapters(prev =>
        prev.map(ch => (ch._id === id ? { ...ch, ...mappedChapter } : ch))
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
