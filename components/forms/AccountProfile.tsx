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
import { ChangeEvent } from 'react';

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
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof userSchemaValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log({ values });
  }

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    console.log({ e, fieldChange });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => {
            console.log({ field });
            return (
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
            );
          }}
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
