/*
  # Fix column name case in chapters table
  
  1. Changes
     - Rename 'chapter' column to 'Chapter' to match the application code
  
  2. Security
     - No changes to security policies
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chapters' AND column_name = 'chapter'
  ) THEN
    ALTER TABLE chapters RENAME COLUMN chapter TO "Chapter";
  END IF;
END $$;
