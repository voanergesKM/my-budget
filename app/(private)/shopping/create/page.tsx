import { Suspense } from "react";

import ShoppingForm from "@/app/ui/pages/Shoppings/components/ShoppingForm";

export default async function ShoppingCreate() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ShoppingForm />
      </Suspense>
    </>
  );
}
