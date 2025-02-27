DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'chapters' AND column_name = 'chapter'
  ) THEN
    ALTER TABLE chapters RENAME COLUMN chapter TO "Chapter";
  END IF;
END $$;
