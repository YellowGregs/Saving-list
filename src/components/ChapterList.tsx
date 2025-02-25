import React from 'react';
import { Star, Trash2, ExternalLink, Edit2 } from 'lucide-react';
import type { Chapter } from '../types';

interface ChapterListProps {
  chapters: Chapter[];
  onToggleFavorite: (id: string) => void;
  onRemove: (id: string) => void;
  onEdit: (chapter: Chapter) => void;
}

export function ChapterList({ chapters, onToggleFavorite, onRemove, onEdit }: ChapterListProps) {
  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <div
          key={chapter._id}
          className={`bg-gray-800 p-6 rounded-xl shadow-xl transition-all border ${
            chapter.isFavorite ? 'border-yellow-500' : 'border-gray-700'
          }`}
        >
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-100">{chapter.title}</h3>
                <p className="text-indigo-400 mt-1">Chapter: {chapter.Chapter}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(chapter)}
                  className="p-2 text-gray-400 hover:text-gray-100 bg-gray-700 rounded-lg transition-colors"
                >
                  <Edit2 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onToggleFavorite(chapter._id)}
                  className={`p-2 rounded-lg transition-colors ${
                    chapter.isFavorite
                      ? 'text-yellow-500 hover:text-yellow-600 bg-gray-700'
                      : 'text-gray-400 hover:text-yellow-500 bg-gray-700'
                  }`}
                >
                  <Star className="h-5 w-5" fill={chapter.isFavorite ? 'currentColor' : 'none'} />
                </button>
                <button
                  onClick={() => onRemove(chapter._id)}
                  className="p-2 text-red-400 hover:text-red-500 bg-gray-700 rounded-lg transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <a
              href={chapter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors group"
            >
              Continue Reading
              <ExternalLink className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-sm text-gray-400">
              Added: {new Date(chapter.addedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
      {chapters.length === 0 && (
        <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-xl border border-gray-700">
          No chapters added yet. Start by adding your first chapter above!
        </div>
      )}
    </div>
  );
}