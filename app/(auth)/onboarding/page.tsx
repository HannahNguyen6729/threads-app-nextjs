import AccountProfile from '@/components/forms/AccountProfile';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo: any = await getUser(user.id);

  const userData = {
    id: user.id,
    objectId: userInfo?._id,
    name: userInfo ? userInfo.name : user.firstName ?? '',
    username: userInfo ? userInfo.username : user.username,
    bio: userInfo ? userInfo?.bio : '',
    image: userInfo ? userInfo?.image : user.imageUrl,
  };
  // console.log({ userData, user });
  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now to use Threads
      </p>
      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userData} btnTitle="Continue" />
      </section>
    </main>
  );
}
