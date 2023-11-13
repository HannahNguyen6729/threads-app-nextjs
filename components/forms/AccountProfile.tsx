'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { userSchemaValidation } from '@/lib/validation/user';
import { z } from 'zod';
import { Textarea } from '../ui/textarea';
import Image from 'next/image';
import { ChangeEvent, useState } from 'react';
import { isBase64Image } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [imgFiles, setImgFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing('media');

  // 1. Define your form.
  const form = useForm<z.infer<typeof userSchemaValidation>>({
    resolver: zodResolver(userSchemaValidation),
    defaultValues: {
      username: user.username ?? '',
      name: user.name ?? '',
      bio: user.bio ?? '',
      profile_photo: user.image ?? '',
    },
  });
  console.log({ user });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const uploadedImgFile = e.target.files[0];
      if (!uploadedImgFile.type.includes('image')) return;
      setImgFiles(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || '';

        //update the image data field
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(uploadedImgFile);
    }
  };

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof userSchemaValidation>) => {
    const avatarUrl = values.profile_photo;

    const hasImageChanged = isBase64Image(avatarUrl);
    if (hasImageChanged) {
      //upload image to uploadthing
      const imgResponse = await startUpload(imgFiles);
      if (imgResponse && imgResponse[0].url) {
        //update avatar image url with useUploadThing hook
        values.profile_photo = imgResponse[0].url;
      }
      console.log({ values, imgFiles, imgResponse });
    }

    // Todo: call backend function to update user profile
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex gap-4 items-center">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile_icon"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile_icon"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                )}
              </FormLabel>

              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  onChange={(e) => handleImage(e, field.onChange)}
                  type="file"
                  accept="image/*"
                  className="account-form_image-input"
                  placeholder="Add profile photo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-2">Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="account-form_input"
                  placeholder="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-2">Username</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="account-form_input"
                  placeholder="username"
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-2">Bio</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={12}
                  className="account-form_input"
                  placeholder="Type bio here"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue">
          {btnTitle}
        </Button>
      </form>
    </Form>
  );
};
export default AccountProfile;
