/*
# Create AI Course Generator Tables

## Changes
1. New Tables:
   - `courseList`: Stores AI-generated courses. Each row belongs to an authenticated user via `user_id` (defaults to auth.uid()). Also stores display email, name, profile image, course metadata, banner URL, and publish status.
   - `chapters`: Stores chapter content and YouTube video IDs for each course chapter.

2. Security:
   - RLS enabled on both tables.
   - `courseList`: Public SELECT (courses are viewable by anyone), authenticated INSERT/UPDATE/DELETE scoped to the row owner via user_id.
   - `chapters`: Public SELECT (chapter content is public), authenticated INSERT/UPDATE/DELETE.

3. Storage:
   - Creates a public `course-banners` bucket for course banner image uploads.
   - Allows public reads and authenticated uploads/updates.
*/

CREATE TABLE IF NOT EXISTS "courseList" (
  id serial PRIMARY KEY,
  "courseId" varchar NOT NULL UNIQUE,
  name varchar NOT NULL,
  category varchar NOT NULL,
  level varchar NOT NULL,
  "includeVideo" varchar NOT NULL DEFAULT 'Yes',
  "courseOutput" jsonb NOT NULL,
  "createdBy" varchar NOT NULL,
  "userName" varchar,
  "userProfileImage" varchar,
  "courseBanner" varchar DEFAULT '/placeholder.png',
  publish boolean DEFAULT false,
  user_id uuid DEFAULT auth.uid()
);

CREATE TABLE IF NOT EXISTS "chapters" (
  id serial PRIMARY KEY,
  "courseId" varchar NOT NULL,
  "chapterId" integer NOT NULL,
  content jsonb NOT NULL,
  "videoId" varchar NOT NULL
);

ALTER TABLE "courseList" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chapters" ENABLE ROW LEVEL SECURITY;

-- courseList policies
DROP POLICY IF EXISTS "public_select_courseList" ON "courseList";
CREATE POLICY "public_select_courseList" ON "courseList" FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_courseList" ON "courseList";
CREATE POLICY "auth_insert_courseList" ON "courseList" FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "auth_update_courseList" ON "courseList";
CREATE POLICY "auth_update_courseList" ON "courseList" FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "auth_delete_courseList" ON "courseList";
CREATE POLICY "auth_delete_courseList" ON "courseList" FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- chapters policies
DROP POLICY IF EXISTS "public_select_chapters" ON "chapters";
CREATE POLICY "public_select_chapters" ON "chapters" FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_chapters" ON "chapters";
CREATE POLICY "auth_insert_chapters" ON "chapters" FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_chapters" ON "chapters";
CREATE POLICY "auth_update_chapters" ON "chapters" FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_chapters" ON "chapters";
CREATE POLICY "auth_delete_chapters" ON "chapters" FOR DELETE
  TO authenticated USING (true);

-- Storage: course-banners bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-banners', 'course-banners', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "public_read_course_banners" ON storage.objects;
CREATE POLICY "public_read_course_banners" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'course-banners');

DROP POLICY IF EXISTS "auth_upload_course_banners" ON storage.objects;
CREATE POLICY "auth_upload_course_banners" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'course-banners');

DROP POLICY IF EXISTS "auth_update_course_banners" ON storage.objects;
CREATE POLICY "auth_update_course_banners" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'course-banners');
