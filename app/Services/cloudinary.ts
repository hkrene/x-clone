import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// Configure Cloudinary once
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (error, result) => {
      if (error) return reject(error)

      // Remove the file after upload (non-blocking)
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete temp file:', err)
      })

      if (!result?.secure_url) {
        return reject(new Error('No URL returned from Cloudinary'))
      }
      resolve(result.secure_url)
    })
  })
}

// Usage example — ensure filePath is defined before calling
async function handleUpload(bannerImage: { filePath?: string }, user: any) {
  if (bannerImage.filePath) {
    try {
      const bannerUrl = await uploadToCloudinary(bannerImage.filePath)
      user.bannerImage = bannerUrl
    } catch (err) {
      console.error('Upload failed:', err)
      // Handle error accordingly
    }
  } else {
    console.warn('No banner image file path provided')
    // Handle missing filePath case accordingly
  }
}
