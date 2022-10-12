import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'El nombre es requerido'],
    },
    email: {
      type: String,
      trim: true,
      required: [true, 'El correo es requerido'],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: 'El correo no es valido',
      },
    },
    usuario: {
      type: String,
      trim: true,
      required: [true, 'El usuario es requerido'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerido'],
      minlength: 6,
      select: false,
    },
    about: {},
    foto: {
      url: String,
      public_id: String,
    },
    seguidores: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    seguidos: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
)
// password  encriptar
UserSchema.pre('save', async function () {
  // console.log(this.modifiedPaths())
  if (!this.isModified('password')) return

  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id }, process.env.jWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password)
  return isMatch
}

export default mongoose.model('User', UserSchema)
