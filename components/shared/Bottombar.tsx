'use client';

import { usePathname } from 'next/navigation';
import { sidebarLinks } from '@/constants';
import Image from 'next/image';
import Link from 'next/link';

export default function Bottombar() {
  const pathname = usePathname();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const activeLink =
            link.route === pathname ||
            (pathname.includes(link.route) && link.route.length > 1);

          return (
            <Link
              href={link.route}
              key={link.label}
              className={`bottom_link ${activeLink && 'bg-blue'} `}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="object-contain"
              />
              <p className="text-light-1text-subtle-medium  max-sm:hidden ">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
