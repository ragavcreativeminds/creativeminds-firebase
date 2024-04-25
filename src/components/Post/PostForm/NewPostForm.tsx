import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Stack,
  Textarea,
  Image,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { BiPoll } from "react-icons/bi";
import { BsArchive, BsLink45Deg, BsMic } from "react-icons/bs";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { useRecoilState, useSetRecoilState } from "recoil";
import { firestore, storage } from "../../../firebase/clientApp";
import TabItem from "./TabItem";
import { postState } from "../../../atoms/postsAtom";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import validUrl from "valid-url";
import imageCompression from "browser-image-compression";
import useSelectFile from "../../../hooks/useSelectFile";
import { useUploadFile } from "react-firebase-hooks/storage";
import TextEditor from "./TextEditor";

const formTabs = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  // {
  //   title: "Poll",
  //   icon: BiPoll,
  // },
  {
    title: "Assets",
    icon: BsArchive,
  },
];

export type TabItems = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostFormProps = {
  communityId: string;
  communityImageURL?: string;
  user: User;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  communityId,
  communityImageURL,
  user,
}) => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({
    title: "",
    body: "",
    links: "",
  });
  const {
    selectedFile,
    setSelectedFile,
    selectedFileUpload,
    setSelectedFileUpload,
    onSelectFile,
  } = useSelectFile();
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setPostItems = useSetRecoilState(postState);
  const [uploadFile, uploading, snapshot, uploadError] = useUploadFile();

  const handleCreatePost = async () => {

    for (let index = 0; index < 250; index++) {
     
      setLoading(true);
      const { title, body, links } = textInputs;
      try {
        // Validate title
        if (!title.trim()) throw new Error("Title cannot be empty");
  
        setError(""); // Clear any previous error
  
        const postLinkscheck = processLinks(links);
  
        const postDocRef = await addDoc(collection(firestore, "posts"), {
          communityId,
          communityImageURL: communityImageURL || "",
          creatorId: user.uid,
          userDisplayText: user.email!.split("@")[0],
          title,
          body,
          numberOfComments: 0,
          voteStatus: 0,
          createdAt: serverTimestamp() as Timestamp,
          editedAt: serverTimestamp() as Timestamp,
        });
  
        console.log("HERE IS NEW POST ID", postDocRef.id);
  
        if (postLinkscheck.success && postLinkscheck.postLinks?.length) {
          await updateDoc(postDocRef, { links: postLinkscheck.postLinks });
          console.log("Post Links URL:", postLinkscheck.postLinks);
        }
  
        if (selectedFileUpload) {
          const compressedImagePromise = getCompressedImage(selectedFileUpload);
          const compressedImage = await compressedImagePromise;
  
          if (compressedImage) {
            const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
            await uploadFile(imageRef, compressedImage);
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(postDocRef, { imageURL: downloadURL });
            console.log("Download URL:", downloadURL);
          }
        }
        // // Clear the cache to cause a refetch of the posts
        // setPostItems((prev) => ({
        //   ...prev,
        //   postUpdateRequired: true,
        // }));
        // router.back();
      } catch (error) {
        console.log("createPost error", error);
       // setError("Error creating post");
      }
      setLoading(false);
      
    }
    // setLoading(true);
    // const { title, body, links } = textInputs;
    // try {
    //   // Validate title
    //   if (!title.trim()) throw new Error("Title cannot be empty");

    //   setError(""); // Clear any previous error

    //   const postLinkscheck = processLinks(links);

    //   const postDocRef = await addDoc(collection(firestore, "posts"), {
    //     communityId,
    //     communityImageURL: communityImageURL || "",
    //     creatorId: user.uid,
    //     userDisplayText: user.email!.split("@")[0],
    //     title,
    //     body,
    //     numberOfComments: 0,
    //     voteStatus: 0,
    //     createdAt: serverTimestamp() as Timestamp,
    //     editedAt: serverTimestamp() as Timestamp,
    //   });

    //   console.log("HERE IS NEW POST ID", postDocRef.id);

    //   if (postLinkscheck.success && postLinkscheck.postLinks?.length) {
    //     await updateDoc(postDocRef, { links: postLinkscheck.postLinks });
    //     console.log("Post Links URL:", postLinkscheck.postLinks);
    //   }

    //   if (selectedFileUpload) {
    //     const compressedImagePromise = getCompressedImage(selectedFileUpload);
    //     const compressedImage = await compressedImagePromise;

    //     if (compressedImage) {
    //       const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
    //       await uploadFile(imageRef, compressedImage);
    //       const downloadURL = await getDownloadURL(imageRef);
    //       await updateDoc(postDocRef, { imageURL: downloadURL });
    //       console.log("Download URL:", downloadURL);
    //     }
    //   }
    //   // Clear the cache to cause a refetch of the posts
    //   setPostItems((prev) => ({
    //     ...prev,
    //     postUpdateRequired: true,
    //   }));
    //   router.back();
    // } catch (error) {
    //   console.log("createPost error", error);
    //   setError("Error creating post");
    // }
    // setLoading(false);
  };

  function processLinks(links: any) {
    try {
      // Split the links string into an array
      const linksArray = links.split(",");

      // Filter out invalid URLs
      const postLinks: string[] = linksArray
        .map((link: any) => String(link).trim()) // Convert each element to a string and trim whitespace
        .filter((link: string) => validUrl.isUri(link));

      return { success: true, postLinks };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  const getCompressedImage = async (file: any) => {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
      maxIteration: 3,
      fileType: "image/webp",
    };
    if (file) {
      const fileSize = file.size / 1024 / 1024;

      if (fileSize > 10) {
        throw new Error("Oops! Image exceeds 10MB limit.");
      } else {
        const compressedFile = await imageCompression(file, options);
        console.log(
          "compressedFile instanceof Blob",
          compressedFile instanceof Blob
        ); // true
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        return compressedFile;
      }
    }
  };

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target?.result as string);
      }
    };
  };

  const onTitleChange = (title: string) => {
    setTextInputs((prev) => ({
      ...prev,
      title: title,
    }));
  };

  const onBodyTextChange = (body: string) => {
    setTextInputs((prev) => ({
      ...prev,
      body: body,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex px={4} py={2} width="100%">
        <TextInputs
          textInput={textInputs.title}
          onChange={onTitleChange}
          height="25px"
          placeHolder="Title"
        />
      </Flex>
      <Flex px={4} py={2}>
        {selectedTab === "Post" && (
          <TextEditor
            textInput={textInputs.body}
            onChange={onBodyTextChange}
            readonly={false}
            theme="snow"
            height="300px"
            placeHolder="Description (Optional)"
          />
        )}
        {selectedTab === "Images" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            selectedFileUpload={selectedFileUpload}
            setSelectedFileUpload={setSelectedFileUpload}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
      <Flex px={4} py={2} mt={10} justify="flex-end">
        <Button
          height="34px"
          padding="0px 30px"
          disabled={!textInputs.title}
          isLoading={loading}
          onClick={handleCreatePost}
        >
          Post
        </Button>
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
