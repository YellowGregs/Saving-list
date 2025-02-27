import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { ChapterFormData } from '../types';

interface ChapterFormProps {
  onSubmit: (data: ChapterFormData) => Promise<void>;
}

export function ChapterForm({ onSubmit }: ChapterFormProps) {
  const [formData, setFormData] = useState<ChapterFormData>({
    title: '',
    Chapter: '',
    url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.url.trim()) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ title: '', Chapter: '', url: '' });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-xl border border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
            Manhwa/Manga/Manhua Title
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter title"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="Chapter" className="block text-sm font-medium text-gray-300 mb-2">
            Chapter
          </label>
          <input
            type="text"
            id="Chapter"
            value={formData.Chapter}
            onChange={(e) => setFormData(prev => ({ ...prev, Chapter: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="e.g., Chapter 123"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
          Saving URL
        </label>
        <input
          type="url"
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500"
          placeholder="https://example.com/chapter-url"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white transition-colors ${
          isSubmitting
            ? 'bg-indigo-500 cursor-not-allowed opacity-70'
            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500'
        }`}
      >
        <Plus className="h-5 w-5 mr-2" />
        {isSubmitting ? 'Saving...' : 'Save Chapter'}
      </button>
    </form>
  );
}
