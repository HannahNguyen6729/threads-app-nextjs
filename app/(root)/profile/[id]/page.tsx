import ProfileHeader from '@/components/shared/ProfileHeader';
import { getUser } from '@/lib/serverActions/user.action';
import { currentUser, useAuth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import ThreadsTab from '@/components/shared/ThreadsTab';

export default async function Page({ params }: { params: { id: string } }) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(params.id);
  if (!userInfo?.onboarded) redirect('/onboarding');

  console.log({ id: userInfo, user_id: user.id });
  return (
    <section>
      <ProfileHeader
        accountId={userInfo.id}
        authUserId={user.id}
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />
      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === 'Threads' && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {userInfo.threads.length}
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          {profileTabs.map((tab) => (
            <TabsContent
              key={`content-${tab.label}`}
              value={tab.value}
              className="w-full text-light-2"
            >
              <ThreadsTab
                currentUserId={user.id}
                accountId={userInfo.id}
                accountType={'User'}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
