import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'
import User from '../models/User.js'
import { uploadImage, deleteImage } from '../libs/cloudinary.js'
import fs from 'fs-extra'
import { response } from 'express'
const register = async (req, res) => {
  const { usuario } = req.body

  if (usuario.includes(' ')) {
    throw new BadRequestError(
      'Los nombres de usuario solo pueden contener letras, números, guiones bajos y puntos.'
    )
  }

  const user = await User.create(req.body)
  const token = user.createJWT()

  user.password = undefined
  res.status(201).json({ user, token })
}
const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Se requieren llenar todos los  campos')
  }

  if (password.length < 6) {
    throw new BadRequestError(
      'La contraseña debe tener 6 caracteres como minimo'
    )
  }

  const user = await User.findOne({ email }).select('+password')
  if (!user) {
    throw new UnAuthenticatedError(
      'No hemos podido conectar con Instagram. Asegúrate de que estás conectado a internet y vuelve a intentarlo.'
    )
  }

  const isPasswordCorrect = await user.comparePassword(password)

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError(
      'No hemos podido conectar con Instagram. Asegúrate de que estás conectado a internet y vuelve a intentarlo.'
    )
  }

  const token = user.createJWT()
  user.password = undefined
  res.status(200).json({ user, token })
}
const updateUser = async (req, res) => {
  const { email, usuario, name, about, foto } = req.body

  console.log('probando')
  if (!usuario || !email) {
    throw new BadRequestError('Se requieren los campos usuario , email')
  }

  if (usuario.includes(' ')) {
    throw new BadRequestError(
      'Los nombres de usuario solo pueden contener letras, números, guiones bajos y puntos.'
    )
  }

  const user = await User.findOne({ _id: req.user.userId })

  let image
  if (req.files && req.files.foto) {
    if (user.foto && user.foto.public_id) {
      await deleteImage(user.foto.public_id)
    }

    const result = await uploadImage(req.files.foto.tempFilePath)
    await fs.remove(req.files.foto.tempFilePath)

    console.log(result)
    image = {
      url: result.secure_url,
      public_id: result.public_id,
    }
    user.foto = image
  }
  user.email = email
  user.usuario = usuario
  user.name = name
  user.about = about
  await user.save()
  const token = user.createJWT()
  res.status(200).json({ user, token })
}

const updateImagePerfil = async (req, res) => {
  const user = await User.findOne({ _id: req.user.userId })
  let image
  if (req.files && req.files.foto) {
    if (user.foto && user.foto.public_id) {
      await deleteImage(user.foto.public_id)
    }

    const result = await uploadImage(req.files.foto.tempFilePath)
    await fs.remove(req.files.foto.tempFilePath)

    console.log(result)
    image = {
      url: result.secure_url,
      public_id: result.public_id,
    }
    user.foto = image
  }
  if (!image) {
    return res.json('no hay imagen')
  }

  await user.save()
  const token = user.createJWT()
  res.status(200).json({ user, token })
}

const updatePassword = async (req, res) => {
  const { password, newPassword } = req.body

  if (newPassword.length < 6) {
    throw new BadRequestError(
      'La contraseña debe tener 6 caracteres como minimo'
    )
  }

  if (!password || !newPassword) {
    throw new BadRequestError('Proporcionen todos los valores')
  }
  const user = await User.findOne({ _id: req.user.userId }).select('+password')

  console.log(user)

  const isPasswordCorrect = await user.comparePassword(password)
  console.log(isPasswordCorrect)
  if (!isPasswordCorrect) {
    throw new BadRequestError('Credenciales Invalidas')
  }
  user.password = newPassword
  await user.save()
  res.status(200).json('Se ha cambiado la contraseña')
}

const findPeople = async (req, res) => {
  const user = await User.findById(req.user.userId)
  console.log(user)
  let following = user.seguidos
  following.push(user._id)

  const people = await User.find({ _id: { $nin: following } }).limit(5)
  res.status(200).json(people)
}

const searchUser = async (req, res) => {
  const people = await User.find({})

  res.status(200).json(people)
}

const userFollow = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      $addToSet: { seguidos: req.body._id },
    },
    {
      new: true,
    }
  )
  res.status(200).json(user)
}

const userUnFollow = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.userId,
    {
      $pull: { seguidos: req.body._id },
    },
    {
      new: true,
    }
  )
  res.status(200).json(user)
}

const getUser = async (req, res) => {
  if (!req.params.id) {
    throw new BadRequestError('Se requiere un USUARIO')
  }

  const user = await User.findOne({ usuario: req.params.id })
    .select('-email')
    .populate('seguidores', 'usuario foto name _id')
    .populate('seguidos', 'usuario foto name _id')

  res.status(200).json({ user })
}

// const updateUser = async (req, res) => {
//   const { email, usuario, name, about, foto } = req.body

//   console.log('probando')
//   if (!usuario || !email) {
//     throw new BadRequestError('Se requieren los campos usuario , email')
//   }

//   const user = await User.findOne({ _id: req.user.userId })

//   let image
//   if (req.files && req.files.foto) {
//     if (user.foto && user.foto.public_id) {
//       await deleteImage(user.foto.public_id)
//     }

//     const result = await uploadImage(req.files.foto.tempFilePath)
//     await fs.remove(req.files.foto.tempFilePath)

//     console.log(result)
//     image = {
//       url: result.secure_url,
//       public_id: result.public_id,
//     }
//     user.foto = image
//   }

//   user.email = email
//   user.usuario = usuario
//   user.name = name
//   user.about = about
//   await user.save()
//   const token = user.createJWT()
//   res.status(200).json({ user, token })
// }

export {
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
}
