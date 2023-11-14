'use client';

import { CommentValidation } from '@/lib/validation/comment';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { addCommentToThread } from '@/lib/serverActions/thread.action';

interface Props {
  threadId: string;
  currentUserImg: string;
  currentUserId: string;
}

export default function Comment({
  threadId,
  currentUserId,
  currentUserImg,
}: Props) {
  const pathname = usePathname();

  const form = useForm<z.infer<typeof CommentValidation>>({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    // call server action to create a new comment

    await addCommentToThread({
      threadId,
      commentText: values.thread,
      userId: JSON.parse(currentUserId),
      path: pathname,
    });

    form.reset();
  };

  return (
    <Form {...form}>
      <form className="comment-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="current_user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  {...field}
                  placeholder="Enter Comment..."
                  className="no-focus text-light-1 outline-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit" className="comment-form_btn">
          Reply
        </Button>
      </form>
    </Form>
  );
}
