import { UnAuthenticatedError, BadRequestError } from '../errors/index.js'
import Post from '../models/Post.js'

const canEditDeletePost = async (req, res, next) => {
  try {
    // console.log(req.params)
    const post = await Post.findById(req.params.id)
    if (!post) {
      throw new BadRequestError('No existe el post.')
    }

    // console.log(post)
    if (req.user.userId !== post.postedBy.toString()) {
      throw new BadRequestError('No tienes permiso.')
    }

    next()
  } catch (error) {
    throw new BadRequestError('No tienes permiso.')
  }
}
// 627f0383c81a272fd42a2415
export default canEditDeletePost
