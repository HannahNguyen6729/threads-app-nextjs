'use server';
import { revalidatePath } from 'next/cache';
import { ThreadModel } from '../models/thread.model';
import { UserModel } from '../models/user.model';
import { connectDatabase } from '../mongoose';

interface Props {
  text: string;
  author: string;
  path: string;
  communityId: string | null;
}

export const createThread = async ({
  text,
  author,
  path,
  communityId,
}: Props) => {
  try {
    connectDatabase();

    //create a new thread
    const newThread = await new ThreadModel({
      text,
      author,
      community: null,
    });
    await newThread.save();

    //update user model
    await UserModel.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    }).lean();

    revalidatePath(path);

    return newThread;
  } catch (error: any) {
    throw new Error(`failed to update user: ${error.message}`);
  }
};

export const getPosts = async (pageSize = 20, pageNumber = 1) => {
  try {
    connectDatabase();

    const skipAmount = (pageNumber - 1) * pageSize;

    const posts = await ThreadModel.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author' })
      // .populate({ path: 'community' })
      .populate({
        path: 'children', //populate the children field
        populate: {
          path: 'author', // populate the author field in the children field
          select: '_id name image parentId',
        },
      })
      .lean();

    // count the number of posts/threads on top level those are not comments
    const totalPostsCount = await ThreadModel.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error: any) {
    throw new Error(`failed to fetch threads: ${error.message}`);
  }
};

export const getThreadById = async (threadId: string) => {
  try {
    connectDatabase();

    const thread = await ThreadModel.findById(threadId)
      .populate({ path: 'author', select: '_id id name image' })
      //  .populate({ path: 'communities', select: 'i_id id name image' })
      .populate({
        path: 'children',
        populate: [
          { path: 'author', select: '_id id name image parentId' },
          {
            path: 'children', // Populate the children field within children
            populate: {
              path: 'author', // Populate the author field within nested children
              select: '_id id name parentId image', // Select only _id and username fields of the author
            },
          },
        ],
      })
      .lean();

    return thread;
  } catch (error: any) {
    console.error('Error while fetching thread:', error);
    throw new Error(`thread not found`);
  }
};