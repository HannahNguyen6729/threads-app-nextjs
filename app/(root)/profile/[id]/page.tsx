import { getUser } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
  // if (!params.id) return null;
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(params.id);
  if (!userInfo?.onboarded) redirect('/onboarding');
  console.log({ userInfo });
  return (
    <section>
      <p className="text-light-2">profile</p>
      <div className="mt-9"></div>
    </section>
  );
}
