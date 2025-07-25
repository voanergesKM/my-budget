import React, { Suspense } from "react";

import GroupForm from "../../_components/GroupForm"; // назва з помилкою, краще GroupForm

export default async function CreateGroupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GroupForm />
    </Suspense>
  );
}
