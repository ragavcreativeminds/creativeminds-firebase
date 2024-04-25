import { useEffect } from "react";
import "firebase/database";
import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";
import useNetworkStatus from "./useNetworkStatus";

const useUserPresence = (user: User | null | undefined) => {
  const isOnline = useNetworkStatus();

  useEffect(() => {
    if (user && isOnline) {
      const setUserPresence = async (online: boolean) => {
        const batch = writeBatch(firestore);
        const userPresenceQuery = query(
          collection(firestore, "userpresence"),
          where("userId", "==", user?.uid)
        );

        const userPresenceDocs = await getDocs(userPresenceQuery);
        userPresenceDocs.forEach((doc) => {
          batch.update(doc.ref, { online });
        });

        await batch.commit();
      };

      const setOnlineStatus = () => {
        setUserPresence(true);
      };

      const setOfflineStatus = () => {
        setUserPresence(false);
      };

      // Update user presence status to "online" when component mounts
      setOnlineStatus();

      // Update user presence status to "offline" when component unmounts or tab is closed
      window.addEventListener("beforeunload", () => {
        setOfflineStatus();
      });

      // Update user presence status to "offline" when component unmounts or tab is closed
      window.addEventListener("visibilitychange", () => {
        setOnlineStatus();
        if (document.visibilityState === "hidden") {
          // Update user presence status to "offline"
          // You can use Firebase Realtime Database or Firestore to update the status
          setOfflineStatus();
        } else {
          // Update user presence status to "online"
          // You can use Firebase Realtime Database or Firestore to update the status
          setOnlineStatus();
        }
      });

      return () => {
        setOfflineStatus();
      };
    }
  }, [user]);
};

export default useUserPresence;
