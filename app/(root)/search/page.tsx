import UserCard from '@/components/cards/UserCard';
import Searchbar from '@/components/shared/Searchbar';
import { getUser, getUsers } from '@/lib/serverActions/user.action';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

const Page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  const usersResponse = await getUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageSize: 6,
    pageNumber: searchParams?.page ? Number(searchParams.page) : 1,
  });

  console.log({ usersResponse: usersResponse.users });
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Searchbar */}
      <Searchbar routeType="search" />

      <div className="mt-14 flex flex-col gap-9">
        render users
        {usersResponse.users.length === 0 ? (
          <p>No result</p>
        ) : (
          <>
            {usersResponse.users.map((user: any) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default Page;
