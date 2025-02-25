export interface Chapter {
  _id: string;
  title: string;
  Chapter: string;
  url: string;
  isFavorite: boolean;
  addedAt: string;
}

export interface ChapterFormData {
  title: string;
  Chapter: string;
  url: string;
}