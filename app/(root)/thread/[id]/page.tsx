import ThreadCard from '@/components/cards/ThreadCard';
import { getThreadById } from '@/lib/serverActions/thread.action';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  console.log({ params });

  const thread = await getThreadById(params.id);
  if (!thread) return null;
  console.log({ thread });

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>
    </section>
  );
}
