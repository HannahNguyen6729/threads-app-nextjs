'use server';
// using server actions

import { revalidatePath } from 'next/cache';
import { UserModel } from '../models/user.model';
import { connectDatabase } from '../mongoose';
import { FilterQuery, SortOrder } from 'mongoose';

interface UserProps {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export const updateUser = async (user: UserProps): Promise<void> => {
  try {
    connectDatabase();

    await UserModel.findOneAndUpdate(
      { id: user.userId },
      {
        username: user.username,
        name: user.name,
        bio: user.bio,
        image: user.image,
        path: user.path,
        onboarded: true,
      },
      { upsert: true }
    );

    if (user.path === '/profile/edit') revalidatePath(user.path);
  } catch (error: any) {
    throw new Error(`failed to update user: ${error.message}`);
  }
};

export const getUser = async (userId: string): Promise<any> => {
  try {
    connectDatabase();

    const user = await UserModel.findOne({ id: userId });
    //.populate({ path: 'communities' })

    return user;
  } catch (error: any) {
    throw new Error(`failed to get user: ${error.message}`);
  }
};

export const getUserPosts = async (userId: string) => {
  try {
    connectDatabase();

    const user = await UserModel.findOne({ id: userId }).populate({
      path: 'threads',
      populate: [
        {
          path: 'children',
          populate: { path: 'author', select: 'name image id' },
        },
        //community
        // { path: 'community', select: 'name id image _id' },
      ],
    });

    return user;
  } catch (error: any) {
    throw new Error(`failed to get user: ${error.message}`);
  }
};

export const getUsers = async ({
  userId,
  searchString = '',
  pageSize = 20,
  pageNumber = 1,
  sortBy = 'desc',
}: {
  userId: string;
  searchString?: string;
  pageSize?: number;
  pageNumber?: number;
  sortBy?: SortOrder;
}) => {
  try {
    connectDatabase();

    //count the number of users to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    //create case-insensitive search string
    const regex = new RegExp(searchString, 'i');

    //create a query obj to filter users those match search criteria
    const query: FilterQuery<typeof UserModel> = { id: { $ne: userId } }; //remove the current user from the user list

    if (searchString.trim() !== '') {
      //if search string is not empty, add $or operator to match username/name
      query.$or = [
        { username: { $regex: regex } },
        { password: { $regex: regex } },
      ];
    }

    const users = await UserModel.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ createdAt: sortBy });

    //count the total number of users that match search criteria
    const totalUsersCount = await UserModel.countDocuments(query);

    //check if there are more users than the number of users on the current page
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error: any) {
    throw new Error(`failed to get users: ${error.message}`);
  }
};
