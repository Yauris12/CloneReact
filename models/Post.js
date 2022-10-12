import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: {},
      // required: true,
    },
    postedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    image: {
      url: String,
      public_id: String,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        text: String,
        created: { type: Date, default: Date.now() },
        postedBy: {
          type: mongoose.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
)

export default mongoose.model('Post', PostSchema)
