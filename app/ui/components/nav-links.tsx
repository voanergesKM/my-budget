"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import Button from "./button";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Button
            key={link.name}
            href={link.href}
            startIcon={<LinkIcon className="w-6" />}
            classes={{
              root: clsx("flex  justify-start"),
            }}
          >
            {link.name}
          </Button>
        );
      })}
    </>
  );
}
