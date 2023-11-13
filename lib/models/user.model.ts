import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    image: { type: String },
    bio: { type: String },
    threads: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'threads',
      },
    ],
    communities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'communities',
      },
    ],
    onboarded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model('users', UserSchema);
