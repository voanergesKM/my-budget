import { PageTitle } from "@/app/ui/components/PageTitle";
import { auth } from "@/auth";

export default async function Groups(props: { params: { groupId: string } }) {
  // const session = await auth();
  const pageParams = await props.params;

  console.log(pageParams);

  // console.log(session);

  return (
    <>
      <PageTitle />
    </>
  );
}
