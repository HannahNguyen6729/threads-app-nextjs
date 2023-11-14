import ThreadCard from '@/components/cards/ThreadCard';
import { getPosts } from '@/lib/serverActions/thread.action';
import { currentUser } from '@clerk/nextjs';

export default async function Home() {
  const pageNumber = 1;
  const res = await getPosts(30, pageNumber);
  const user = await currentUser();
  if (!user) return null;
  return (
    <main>
      <h1 className="text-head  text-light-1">threads</h1>
      <section className="mt-9 flex flex-col gap-10">
        {res.posts.length === 0 ? (
          <p className="no-result">No threads found</p>
        ) : (
          <>
            {res.posts.map((post: any) => (
              <ThreadCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author}
                comments={post.children}
                community={post.community}
                createdAt={post.createdAt}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
}
