import { redirect } from 'next/navigation';
import ThreadCard from '../cards/ThreadCard';
import { getUserPosts } from '@/lib/serverActions/user.action';

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {
  // fetch user by userId
  const userResponse = await getUserPosts(accountId);
  if (!userResponse) redirect('/');

  return (
    <section className="mt-9 flex flex-col gap-10">
      {userResponse.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === 'User'
              ? {
                  name: userResponse.name,
                  image: userResponse.image,
                  id: userResponse.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          createdAt={thread.createdAt}
          comments={thread.children}
          community={thread.community}
        />
      ))}
    </section>
  );
};

export default ThreadsTab;
