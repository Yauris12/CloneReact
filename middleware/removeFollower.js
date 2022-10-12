import User from '../models/User.js'

const removeFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $pull: { seguidores: req.user.userId },
    })

    next()
  } catch (error) {
    console.log(error)
  }
}

export default removeFollower
