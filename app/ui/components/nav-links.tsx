"use client";

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Button from "./button";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Groups", href: "/groups", icon: UserGroupIcon },
  {
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: DocumentDuplicateIcon,
  },
  { name: "Customers", href: "/dashboard/customers", icon: UserGroupIcon },
];

export default function NavLinks() {
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
