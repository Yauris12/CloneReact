import express from 'express'
import protect from '../middleware/auth.js'
import canEditDeletePost from '../middleware/canEditandDelete.js'
const router = express.Router()
import {
  createPost,
  deletePost,
  updatePost,
  newsPost,
  getPost,
} from '../controllers/postController.js'

router.route('/').post(protect, createPost)
router.route('/news-posts').get(protect, newsPost)
router
  .route('/:id')
  .delete(protect, canEditDeletePost, deletePost)
  .put(protect, canEditDeletePost, updatePost)
  .get(protect, getPost)

export default router
