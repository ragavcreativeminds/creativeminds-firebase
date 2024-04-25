import { atom } from "recoil";

export interface UserPresence {
  userId: string;
  online: boolean;
  communityId: string;
}

export const defaultUserPresence: UserPresence = {
  userId: "",
  online: false,
  communityId: "",
};

export const userPresenceState = atom({
  key: "userPresenceState",
  default: defaultUserPresence,
});
