import ProfileHeader from '@/components/shared/ProfileHeader';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser, useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(params.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  console.log({ id: userInfo.id, user_id: user.id });
  return (
    <section>
      <p className="text-light-2">profile</p>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.imgUrl}
        bio={userInfo.bio}
      />
      <div className="mt-9"></div>
    </section>
  );
}
