import { auth } from "@/auth";

export default async function Dashboard() {
  const session = await auth();

  console.log(session);

  console;
  return <h1>Dashboard</h1>;
}
