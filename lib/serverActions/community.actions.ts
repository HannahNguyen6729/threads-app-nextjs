'use server';

import { FilterQuery, SortOrder } from 'mongoose';

import { CommunityModel } from '../models/community.model';
import { ThreadModel } from '../models/thread.model';
import { UserModel } from '../models/user.model';

import { connectDatabase } from '../mongoose';

export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string // Change the parameter name to reflect it's an id
) {
  try {
    connectDatabase();

    // Find the user with the provided unique id
    const user = await UserModel.findOne({ id: createdById });

    if (!user) {
      throw new Error('UserModel not found'); // Handle the case if the user with the id is not found
    }

    const newCommunityModel = new CommunityModel({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id, // Use the mongoose ID of the user
    });

    const createdCommunityModel = await newCommunityModel.save();

    // Update UserModel model
    user.communities.push(createdCommunityModel._id);
    await user.save();

    return createdCommunityModel;
  } catch (error) {
    // Handle any errors
    console.error('Error creating community:', error);
    throw error;
  }
}

export async function fetchCommunityDetails(id: string) {
  try {
    connectDatabase();

    const communityDetails = await CommunityModel.findOne({ id }).populate([
      'createdBy',
      {
        path: 'members',
        model: UserModel,
        select: 'name username image _id id',
      },
    ]);

    return communityDetails;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching community details:', error);
    throw error;
  }
}

export async function fetchCommunityPosts(id: string) {
  try {
    connectDatabase();

    const communityPosts = await CommunityModel.findById(id).populate({
      path: 'threads',
      model: ThreadModel,
      populate: [
        {
          path: 'author',
          model: UserModel,
          select: 'name image id', // Select the "name" and "_id" fields from the "UserModel" model
        },
        {
          path: 'children',
          model: ThreadModel,
          populate: {
            path: 'author',
            model: UserModel,
            select: 'image _id', // Select the "name" and "_id" fields from the "UserModel" model
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    // Handle any errors
    console.error('Error fetching community posts:', error);
    throw error;
  }
}

export async function fetchCommunities({
  searchString = '',
  pageNumber = 1,
  pageSize = 20,
  sortBy = 'desc',
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    connectDatabase();

    // Calculate the number of communities to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, 'i');

    // Create an initial query object to filter communities.
    const query: FilterQuery<typeof CommunityModel> = {};

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== '') {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched communities based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    // Create a query to fetch the communities based on the search and sort criteria.
    const communitiesQuery = CommunityModel.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate('members');

    // Count the total number of communities that match the search criteria (without pagination).
    const totalCommunitiesCount = await CommunityModel.countDocuments(query);

    const communities = await communitiesQuery.exec();

    // Check if there are more communities beyond the current page.
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error('Error fetching communities:', error);
    throw error;
  }
}

export async function addMemberToCommunity(
  communityId: string,
  memberId: string
) {
  try {
    connectDatabase();

    // Find the community by its unique id
    const community = await CommunityModel.findOne({ id: communityId });

    if (!community) {
      throw new Error('CommunityModel not found');
    }

    // Find the user by their unique id
    const user = await UserModel.findOne({ id: memberId });

    if (!user) {
      throw new Error('UserModel not found');
    }

    // Check if the user is already a member of the community
    if (community.members.includes(user._id)) {
      throw new Error('UserModel is already a member of the community');
    }

    // Add the user's _id to the members array in the community
    community.members.push(user._id);
    await community.save();

    // Add the community's _id to the communities array in the user
    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    // Handle any errors
    console.error('Error adding member to community:', error);
    throw error;
  }
}

export async function removeUserFromCommunity(
  userId: string,
  communityId: string
) {
  try {
    connectDatabase();

    const userIdObject = await UserModel.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await CommunityModel.findOne(
      { id: communityId },
      { _id: 1 }
    );

    if (!userIdObject) {
      throw new Error('UserModel not found');
    }

    if (!communityIdObject) {
      throw new Error('CommunityModel not found');
    }

    // Remove the user's _id from the members array in the community
    await CommunityModel.updateOne(
      { _id: communityIdObject._id },
      { $pull: { members: userIdObject._id } }
    );

    // Remove the community's _id from the communities array in the user
    await UserModel.updateOne(
      { _id: userIdObject._id },
      { $pull: { communities: communityIdObject._id } }
    );

    return { success: true };
  } catch (error) {
    // Handle any errors
    console.error('Error removing user from community:', error);
    throw error;
  }
}

export async function updateCommunityInfo(
  communityId: string,
  name: string,
  username: string,
  image: string
) {
  try {
    connectDatabase();

    // Find the community by its _id and update the information
    const updatedCommunityModel = await CommunityModel.findOneAndUpdate(
      { id: communityId },
      { name, username, image }
    );

    if (!updatedCommunityModel) {
      throw new Error('CommunityModel not found');
    }

    return updatedCommunityModel;
  } catch (error) {
    // Handle any errors
    console.error('Error updating community information:', error);
    throw error;
  }
}

export async function deleteCommunity(communityId: string) {
  try {
    connectDatabase();

    // Find the community by its ID and delete it
    const deletedCommunityModel = await CommunityModel.findOneAndDelete({
      id: communityId,
    });

    if (!deletedCommunityModel) {
      throw new Error('CommunityModel not found');
    }

    // Delete all threads associated with the community
    await ThreadModel.deleteMany({ community: communityId });

    // Find all users who are part of the community
    const communityUserModels = await UserModel.find({
      communities: communityId,
    });

    // Remove the community from the 'communities' array for each user
    const updateUserModelPromises = communityUserModels.map((user) => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserModelPromises);

    return deletedCommunityModel;
  } catch (error) {
    console.error('Error deleting community: ', error);
    throw error;
  }
}
