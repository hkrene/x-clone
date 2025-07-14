import fs from 'fs'
import { supabase } from '#services/supabase'

// const BUCKET = 'xclone-database'
// uploader.ts
const BUCKET = process.env.SUPABASE_BUCKET || 'xclone-database'


/**
 * Uploads a file to Supabase Storage under the given path.
 * @param filePath - Temporary file path on disk
 * @param uploadPath - Path inside the bucket (e.g. 'avatars/user123.png')
 * @param contentType - MIME type (e.g. 'image/jpeg')
 * @returns The file path inside the bucket (used to generate signed URL later)
 */
export async function uploadToSupabase(filePath: string, uploadPath: string, contentType: string): Promise<string> {
  const buffer = fs.readFileSync(filePath)

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(uploadPath, buffer, {
      contentType,
      upsert: false,
    })

  if (error) {
    throw new Error('Upload to Supabase failed: ' + error.message)
  }

  return uploadPath // store only path in DB, not full URL
}

/**
 * Deletes a file from Supabase Storage using its path.
 * @param filePath - Path inside the bucket (e.g. 'avatars/user123.png')
 */
export async function deleteFromSupabase(filePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([filePath])
  if (error) {
    throw new Error('Failed to delete from Supabase: ' + error.message)
  }
}

/**
 * Generates a signed URL for a private file.
 * @param filePath - Path inside the bucket (e.g. 'avatars/user123.png')
 * @returns A temporary signed URL valid for 1 hour or an empty string if failed
 */
export async function getSignedUrl(filePath: string): Promise<string> {
  if (!filePath) return ''

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .createSignedUrl(filePath, 60 * 60)

  if (error || !data?.signedUrl) {
    console.warn(`Supabase signed URL generation failed: ${filePath} (Object not found)`)
    return '' // prevent server crash
  }

  return data.signedUrl
}
