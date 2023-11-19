'use server';
import { revalidatePath } from 'next/cache';
import { ThreadModel } from '../models/thread.model';
import { UserModel } from '../models/user.model';
import { connectDatabase } from '../mongoose';
import { CommunityModel } from '../models/community.model';

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

    const communityIdObject = await CommunityModel.findOne(
      { id: communityId },
      { _id: 1 }
    );

    //create a new thread
    const newThread = await new ThreadModel({
      text,
      author,
      community: communityIdObject,
    });
    await newThread.save();

    //update user model
    await UserModel.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await CommunityModel.findByIdAndUpdate(communityIdObject, {
        $push: { threads: newThread._id },
      });
    }
    console.log({ communityIdObject });

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
      .populate({ path: 'community' })
      .populate({
        path: 'children', //populate the children field
        populate: {
          path: 'author', // populate the author field in the children field
          select: '_id name image parentId',
        },
      });

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
      .populate({ path: 'community', select: '_id id name image' })
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
      });

    return thread;
  } catch (error: any) {
    console.error('Error while fetching thread:', error);
    throw new Error(`thread not found`);
  }
};

export const addCommentToThread = async ({
  threadId,
  commentText,
  userId,
  path,
}: {
  threadId: string;
  commentText: string;
  userId: string;
  path: string;
}) => {
  try {
    connectDatabase();

    //find the original thread by threadId
    const originalThread = await ThreadModel.findById(threadId);
    if (!originalThread) throw new Error('Could not find thread');

    //create a new comment/thread
    const comment = await ThreadModel.create({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    // Add the comment thread's ID to the original thread's children array
    await originalThread.children?.push(comment._id);

    // Save the updated original thread to the database
    await originalThread.save();

    revalidatePath(path);
  } catch (error: any) {
    console.error('Error while adding the new comment to thread:', error);
    throw new Error(`unable to add new comment: ${error.message}`);
  }
};
