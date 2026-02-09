import { Session } from "next-auth";
import { useCurrentUser } from "./use-current-user";

export const useCurrentRole = () => {
  const user = useCurrentUser() as Session["user"];

  return user?.roles;
};
