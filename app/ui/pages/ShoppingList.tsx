"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Button from "@/app/ui/components/Button";
import { getShoppingsList } from "@/app/lib/api/shoppings/getShoppingsList";
import { useParams } from "next/navigation";
import { Shopping } from "@/app/lib/definitions";
import { formatDate } from "@/app/lib/utils/dateUtils";

export default function ShoppingList() {
  const params = useParams();
  const router = useRouter();

  const groupId = params?.groupId as string;

  const shoppingListKey = ["shoppingList", groupId ?? "all"];

  const { data } = useQuery({
    queryKey: shoppingListKey,
    queryFn: () => getShoppingsList(groupId),
  });

  const handleCreate = () => {
    const location = groupId ? `/shopping/create/${groupId}` : "/shopping/create";
    router.push(location);
  };

  return (
    <>
      <div className="mt-2 w-[150px]">
        <Button onClick={handleCreate}>Create List</Button>
      </div>

      {data && (
        <ul className="flex flex-col items-center gap-4">
          {data.map((list: Shopping) => (
            <li key={list._id} className="flex items-center gap-2">
              <span>{list.title}</span>
              <span>{list.items.length}</span>
              <span>{formatDate(list.createdAt, "time")}</span>
              <span>{formatDate(list.updatedAt, "time")}</span>
              <span>{list.createdBy.fullName}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
