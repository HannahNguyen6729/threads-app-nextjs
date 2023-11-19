import { PostThread } from '@/components/forms/PostThread';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  return (
    <>
      <h1 className="text-head  text-light-1"> Create A New Thread</h1>
      <PostThread userId={userInfo._id} />
    </>
  );
}
