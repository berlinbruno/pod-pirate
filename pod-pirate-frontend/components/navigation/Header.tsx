import { auth } from "@/lib/utils";
import HeaderWrapper from "./HeaderWrapper";

export default async function Header() {
  const session = await auth();

  const user = session?.user
    ? {
        userName: session.user.userName,
        profileUrl: session.user.profileUrl,
        roles: session.user.roles,
      }
    : null;

  return <HeaderWrapper user={user} />;
}
