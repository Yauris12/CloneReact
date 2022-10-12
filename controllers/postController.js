import Post from '../models/Post.js'
import User from '../models/User.js'

import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

import { uploadPost, deleteImage } from '../libs/cloudinary.js'
import fs from 'fs-extra'

const newsPost = async (req, res) => {
  const user = await User.findById(req.user.userId)
  let following = user.seguidos
  following.push(user._id)

  console.log('follo', following)

  const posts = await Post.find({ postedBy: { $in: following } })
    .populate('postedBy', 'usuario foto _id')
    .sort({ createdAt: -1 })
    .limit(10)

  res.status(200).json({ posts })
}

const getPost = async (req, res) => {
  console.log(req.params)
  if (!req.params.id) {
    throw new BadRequestError('Se requiere un ID')
  }

  const post = await Post.findOne({ _id: req.params.id })
    .populate('postedBy', 'usuario foto _id')
    .populate('comments.postedBy', 'usuario foto _id')

  // res.status(200).json({ post })
  res.status(200).json({ post })
}

const createPost = async (req, res) => {
  const { content } = req.body

  if (!content) {
    throw new BadRequestError('Se requiere una description')
  }
  if (!req.files && !req.files.foto) {
    throw new BadRequestError('Se requieren una imagen')
  }

  req.body.postedBy = req.user.userId
  let image
  if (req.files && req.files.foto) {
    const result = await uploadPost(req.files.foto.tempFilePath)
    await fs.remove(req.files.foto.tempFilePath)

    // console.log(result)
    image = {
      url: result.secure_url,
      public_id: result.public_id,
    }
    req.body.image = image
  }

  const post = await Post.create(req.body)

  res.status(201).json(req.body)
}
const deletePost = async (req, res) => {
  res.json('pasamos')
}
const updatePost = async (req, res) => {}

export { createPost, deletePost, updatePost, newsPost, getPost }
