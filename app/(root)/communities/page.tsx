import Searchbar from '@/components/shared/Searchbar';
import { fetchCommunities } from '@/lib/serverActions/community.actions';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default async function ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const result = await fetchCommunities({
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? Number(searchParams.page) : 1,
    pageSize: 25,
  });

  return (
    <>
      <h1 className="head-text">Communities</h1>
      <div className="mt-5">
        <Searchbar routeType="communities" />
      </div>

      <section className="mt-9 flex flex-wrap gap-4"></section>
    </>
  );
}
