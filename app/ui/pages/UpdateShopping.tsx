"use client";

import React from "react";
import ShoppingForm from "./ShoppingForm";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import getShoppingById from "@/app/lib/api/shoppings/getShoppingById";
import { ForbiddenError } from "@/app/lib/errors/customErrors";

const UpdateShopping = () => {
  const params = useParams();
  const router = useRouter();

  const { shoppingId } = params;

  const { data, error } = useQuery({
    queryKey: ["getShopping", shoppingId ?? "all"],
    queryFn: () => getShoppingById(shoppingId as string),
  });

  React.useEffect(() => {
    if (error instanceof ForbiddenError) {
      router.push("/forbidden");
    }
  }, [error, router]);

  if (!data) {
    return null;
  }

  return <ShoppingForm initialData={data.data} />;
};

export default UpdateShopping;
