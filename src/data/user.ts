// Data access for the signed-in user. Replace the mock return with an API call later.

import { currentUser } from "@/mocks/user";
import type { User } from "@/types/user";

export async function getCurrentUser(): Promise<User> {
  return currentUser;
}
