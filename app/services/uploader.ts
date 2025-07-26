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
    // Ensure the path maintains the file extension
    const cleanPath = uploadPath.replace(/^\/|\/$/g, '')
    
    const buffer = await fs.readFile(filePath)
    
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(cleanPath, buffer, {
        contentType,
        upsert: true,
        cacheControl: '3600',
      })
      

    if (error) {
      logger.error(`Upload failed for ${cleanPath}`, error)
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Return the full path including extension
    return cleanPath
  } catch (error) {
    logger.error('File upload error', error)
    throw error
  }
}

export async function getSignedUrl(filePath: string | null): Promise<string> {
  if (!filePath) return ''
  
  try {
    const cleanPath = filePath.replace(/^\/|\/$/g, '')
    
    // Handle old file paths that might be missing extensions or have wrong paths
    let finalPath = cleanPath
    
    // If the path doesn't have an extension, skip it
    if (!cleanPath.includes('.')) {
      return ''
    }
    
    // If the path starts with 'uploads/', convert it to the new format
    if (cleanPath.startsWith('uploads/')) {
      const filename = cleanPath.split('/').pop()
      if (filename) {
        finalPath = `tweets/${filename}`
      }
    }
    
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(finalPath, 60 * 60)

    if (error || !data?.signedUrl) {
      logger.error(`URL generation failed for ${finalPath}`, error)
      return ''
    }

    return data.signedUrl
  } catch (error) {
    logger.error('URL generation error', error)
    return ''
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


