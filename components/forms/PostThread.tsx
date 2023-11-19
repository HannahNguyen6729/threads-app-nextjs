'use client';

import { useForm } from 'react-hook-form';
import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Textarea } from '../ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ThreadSchemaValidation } from '@/lib/validation/thread';
import { usePathname, useRouter } from 'next/navigation';
import { createThread } from '@/lib/serverActions/thread.action';
import { useOrganization } from '@clerk/nextjs';

interface Props {
  userId: string;
}

export const PostThread = ({ userId }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { organization } = useOrganization();

  // 1. Define your form.
  const form = useForm<z.infer<typeof ThreadSchemaValidation>>({
    resolver: zodResolver(ThreadSchemaValidation),
    defaultValues: {
      thread: '',
      accountId: userId,
    },
  });

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof ThreadSchemaValidation>) => {
    // call async function to create a thread
    await createThread({
      text: values.thread,
      author: userId,
      path: pathname,
      communityId: organization ? organization.id : null,
    });

    router.push('/');
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-light-2">Thread Content</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={16}
                  className="account-form_input"
                  placeholder="Type a new thread here"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="bg-blue">
          Post Thread
        </Button>
      </form>
    </Form>
  );
};
