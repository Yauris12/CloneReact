import User from '../models/User.js'

const addFollower = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      $addToSet: { seguidores: req.user.userId },
    })

    next()
  } catch (error) {
    console.log(error)
  }
}

export default addFollower
