import { v2 as cloudinary } from 'cloudinary'
cloudinary.config({
  cloud_name: 'dbj7ftgyh',
  api_key: '235326455765929',
  api_secret: 'sg_TgVFVmF4hloQUpGLQGScZTfg',
})

export const uploadImage = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'instagram/user',
  })
}
export const uploadPost = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: 'instagram/post',
  })
}

export const deleteImage = async (id) => {
  return await cloudinary.uploader.destroy(id)
}
