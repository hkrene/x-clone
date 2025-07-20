// services/uploader.ts
import fs from 'node:fs/promises'
import { supabase } from '#services/supabase'
import logger from '@adonisjs/core/services/logger'

const BUCKET = process.env.SUPABASE_BUCKET || 'xclone-database'

export async function uploadToSupabase(
  filePath: string, 
  uploadPath: string, 
  contentType: string
): Promise<string> {
  try {
    // Clean path (remove leading/trailing slashes)
    const cleanPath = uploadPath.replace(/^\/|\/$/g, '')
    
    // Read file
    const buffer = await fs.readFile(filePath)
    
    // Upload with error handling
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(cleanPath, buffer, {
        contentType,
        upsert: true, // Changed to true to prevent errors on re-upload
        cacheControl: '3600',
      })

    if (error) {
      logger.error(`Upload failed for ${cleanPath}`, error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    logger.info(`Uploaded to ${BUCKET}/${cleanPath}`)
    return cleanPath
  } catch (error) {
    logger.error('File upload error', error)
    throw error
  }
}

export async function deleteFromSupabase(filePath: string): Promise<void> {
  const cleanPath = filePath.replace(/^\/|\/$/g, '')
  
  try {
    // First check if file exists
    const { data: list } = await supabase.storage
      .from(BUCKET)
      .list('', {
        limit: 1,
        search: cleanPath,
      })

    if (!list || list.length === 0) {
      logger.warn(`File not found for deletion: ${cleanPath}`)
      return
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([cleanPath])

    if (error) {
      logger.error(`Deletion failed for ${cleanPath}`, error)
      throw new Error(`Deletion failed: ${error.message}`)
    }

    logger.info(`Deleted ${BUCKET}/${cleanPath}`)
  } catch (error) {
    logger.error('File deletion error', error)
    throw error
  }
}

export async function getSignedUrl(filePath: string | null): Promise<string> {
  if (!filePath) return ''

  const cleanPath = filePath.replace(/^\/|\/$/g, '')
  
  try {
    // First verify file exists
    const { data: list } = await supabase.storage
      .from(BUCKET)
      .list('', {
        limit: 1,
        search: cleanPath,
      })

    if (!list || list.length === 0) {
      logger.warn(`File not found for URL generation: ${cleanPath}`)
      return ''
    }

    // Generate URL
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(cleanPath, 60 * 60) 

    if (error || !data?.signedUrl) {
      logger.error(`URL generation failed for ${cleanPath}`, error)
      return ''
    }

    return data.signedUrl
  } catch (error) {
    logger.error('URL generation error', error)
    return ''
  }
}