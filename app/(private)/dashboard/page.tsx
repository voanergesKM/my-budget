import { PageTitle } from "@/app/ui/components/PageTitle";

import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  return <PageTitle />;
}
