"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import QueryKeys from "@/app/lib/utils/queryKeys";

import getShoppingById from "@/app/lib/api/shoppings/getShoppingById";

import { ForbiddenError } from "@/app/lib/errors/customErrors";

import ShoppingForm from "./ShoppingForm";

const UpdateShopping = () => {
  const params = useParams();
  const router = useRouter();

  const { shoppingId } = params;

  const { data, error } = useQuery({
    queryKey: [QueryKeys.getCurrentShopping, shoppingId ?? "all"],
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
