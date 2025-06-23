import { auth } from "@/auth";
import { PageTitle } from "../ui/components/PageTitle";

export default async function Dashboard() {
  const session = await auth();

  return <PageTitle />;
}
