import { useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import type { GetServerSidePropsContext, NextPage } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilState } from "recoil";
import safeJsonStringify from "safe-json-stringify";
import { Community, communityState } from "../../../atoms/communitiesAtom";
import About from "../../../components/Community/About";
import CommunityNotFound from "../../../components/Community/CommunityNotFound";
import CreatePostLink from "../../../components/Community/CreatePostLink";
import Header from "../../../components/Community/Header";
import PageContentLayout from "../../../components/Layout/PageContent";
import Posts from "../../../components/Post/Posts";
import { auth, firestore } from "../../../firebase/clientApp";

interface CommunityPageProps {
  communityData: Community;
  onlineMembers: number;
}

const CommunityPage: NextPage<CommunityPageProps> = ({
  communityData,
  onlineMembers,
}) => {
  const [user, loadingUser] = useAuthState(auth);

  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  // useEffect(() => {
  //   // First time the user has navigated to this community page during session - add to cache
  //   const firstSessionVisit =
  //     !communityStateValue.visitedCommunities[communityData.id!];

  //   if (firstSessionVisit) {
  //     setCommunityStateValue((prev) => ({
  //       ...prev,
  //       visitedCommunities: {
  //         ...prev.visitedCommunities,
  //         [communityData.id!]: communityData,
  //       },
  //     }));
  //   }
  // }, [communityData]);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,

      onlineMembers: onlineMembers,
    }));
  }, [onlineMembers]);

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        {/* Left Content */}
        <>
          <CreatePostLink />
          <Posts
            communityData={communityData}
            userId={user?.uid}
            loadingUser={loadingUser}
          />
        </>
        {/* Right Content */}
        <>
          <About communityData={communityData} />
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.community as string
    );
    const communityDoc = await getDoc(communityDocRef);

    // query for online user against the community
    const userPresenceQuery = query(
      collection(firestore, "userpresence"),
      where("communityId", "==", context.query.community),
      where("online", "==", true)
    );

    const onlineMembers = (await getDocs(userPresenceQuery)).size;

    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
        onlineMembers: onlineMembers,
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}
