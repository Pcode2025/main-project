/*
# Add aiModel column to courseList

Stores which OpenRouter model the user selected when creating the course,
so chapter generation can reuse the same model.
*/

ALTER TABLE "courseList" ADD COLUMN IF NOT EXISTS "aiModel" varchar;
