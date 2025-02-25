import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { Chapter } from '../types';

interface EditChapterModalProps {
  chapter: Chapter;
  onClose: () => void;
  onSave: (id: string, data: { title: string; Chapter: string; url: string }) => Promise<void>;
}

export function EditChapterModal({ chapter, onClose, onSave }: EditChapterModalProps) {
  const [formData, setFormData] = useState({
    title: chapter.title,
    Chapter: chapter.Chapter,
    url: chapter.url,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;

    setIsSubmitting(true);
    setError(null);
    
    try {
      await onSave(chapter._id, formData);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-300"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-100 mb-6">Edit Chapter</h2>

        {error && (
          <div className="mb-4 bg-red-900/50 border border-red-500 text-red-100 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-gray-300 mb-2">
              Title
            </label>
            <input
              id="edit-title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-chapter" className="block text-sm font-medium text-gray-300 mb-2">
              Chapter
            </label>
            <input
              id="edit-chapter"
              type="text"
              value={formData.Chapter}
              onChange={(e) => setFormData(prev => ({ ...prev, Chapter: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-300 mb-2">
              URL
            </label>
            <input
              id="edit-url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-gray-300 hover:text-gray-100 bg-gray-700 hover:bg-gray-600"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded-lg text-white font-medium ${
                isSubmitting
                  ? 'bg-indigo-500 cursor-not-allowed opacity-70'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}