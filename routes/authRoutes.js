import express from 'express'
import {
  register,
  login,
  updateUser,
  updateImagePerfil,
  updatePassword,
  findPeople,
  searchUser,
  userFollow,
  userUnFollow,
  getUser,
} from '../controllers/authController.js'

import protect from '../middleware/auth.js'
import addFollower from '../middleware/addFollower.js'
import removeFollower from '../middleware/removeFollower.js'

const router = express.Router()

router.route('/register').post(register)

router.route('/login').post(login)
router.route('/updateUser').put(protect, updateUser)
router.route('/updateImage').put(protect, updateImagePerfil)
router.route('/updatePassword').put(protect, updatePassword)
router.route('/find-people').get(protect, findPeople)
router.route('/search-user').get(protect, searchUser)
router.route('/user-follow').put(protect, addFollower, userFollow)
router.route('/user-unfollow').put(protect, removeFollower, userUnFollow)
router.route('/user/:id').get(protect, getUser)

export default router
