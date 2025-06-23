import { PageTitle } from "@/app/ui/components/PageTitle";
import { auth } from "@/auth";

interface PageProps {
  params: { groupId: string };
}

export default async function Groups({ params }: PageProps) {
  // const session = await auth();
  const pageParams = params.groupId;

  console.log(pageParams);

  // console.log(session);

  return (
    <>
      <PageTitle />
    </>
  );
}

