import mongoose from 'mongoose';

const ThreadSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    parentId: { type: String, default: null },
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'threads' }],
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'communities',
    },
  },
  {
    timestamps: true,
  }
);

export const ThreadModel =
  mongoose.models.threads || mongoose.model('threads', ThreadSchema);
