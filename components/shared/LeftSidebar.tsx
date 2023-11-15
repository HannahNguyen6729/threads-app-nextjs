'use client';

import { SignOutButton, SignedIn, currentUser, useAuth } from '@clerk/nextjs';
import Image from 'next/image';
import { sidebarLinks } from '@/constants';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function LeftSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { userId } = useAuth();

  return (
    <section className=" custom-scrollbar leftsidebar">
      <div className="flex w-ful flex-1 flex-col gap-6 px-6">
        {sidebarLinks.map((link) => {
          const isActiveLink =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route.length > 1);

          if (link.route === '/profile') link.route = `${link.route}/${userId}`;

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`leftsidebar_link ${isActiveLink && 'bg-blue'}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden"> {link.label}</p>
            </Link>
          );
        })}
      </div>
      <div className="px-6 mt-10">
        <SignedIn>
          <SignOutButton signOutCallback={() => router.push('/sign-in')}>
            <div className="flex cursor-pointer gap-4 p-4">
              <Image
                src="/assets/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-1 max-lg:hidden">Logout</p>
            </div>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
}
