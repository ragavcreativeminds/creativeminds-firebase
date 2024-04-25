import { user } from "firebase-functions/v1/auth";
import { query, collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/clientApp";
import { User } from "firebase/auth";

export const getMySnippets = async (userId: string) => {
  const snippetQuery = query(
    collection(firestore, `users/${userId}/communitySnippets`)
  );

  const snippetDocs = await getDocs(snippetQuery);
  return snippetDocs.docs.map((doc) => ({ ...doc.data() }));
};

export const updateUserPresence = async (isOnline: boolean, user?: User) => {
  if (user && user.uid) {
    const userDocRef = doc(collection(firestore, `users`), user.uid);
    updateDoc(userDocRef, { online: isOnline });
  }
};
