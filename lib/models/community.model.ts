import mongoose from 'mongoose';

const communitySchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'threads',
    },
  ],
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    },
  ],
});

export const CommunityModel =
  mongoose.models.communities || mongoose.model('communities', communitySchema);
