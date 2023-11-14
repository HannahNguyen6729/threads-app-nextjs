'use server';
// using server actions

import { revalidatePath } from 'next/cache';
import { UserModel } from '../models/user.model';
import { connectDatabase } from '../mongoose';

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
    ).lean();

    if (user.path === '/profile/edit') revalidatePath(user.path);
  } catch (error: any) {
    throw new Error(`failed to update user: ${error.message}`);
  }
};

export const getUser = async (userId: string): Promise<any> => {
  try {
    connectDatabase();

    const user = await UserModel.findOne({ id: userId })
      //.populate({ path: 'communities' })
      .lean();

    return user;
  } catch (error: any) {
    throw new Error(`failed to get user: ${error.message}`);
  }
};
