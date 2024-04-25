import React from "react";
import { Flex, Stack, Button, Image, Text, Icon } from "@chakra-ui/react";
import { RiUploadCloud2Fill } from "react-icons/ri";

type ImageUploadProps = {
  selectedFile?: string;
  setSelectedFile: (value: string) => void;
  selectedFileUpload?: string;
  setSelectedFileUpload: (value: any) => void;

  setSelectedTab: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const ImageUpload: React.FC<ImageUploadProps> = ({
  selectedFile,
  setSelectedFile,
  selectedFileUpload,
  setSelectedFileUpload,
  setSelectedTab,
  selectFileRef,
  onSelectImage,
}) => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      width="100%"
      fontWeight={700}
    >
      {selectedFile ? (
        <>
          <Image
            src={selectedFile as string}
            height={"272px"}
            width={"100%"}
            maxWidth="400px"
            maxHeight="400px"
          />
          <Stack direction="row" mt={4}>
            <Button
              variant="outline"
              height="28px"
              onClick={() =>  {
                setSelectedFile("")
                setSelectedFileUpload(null)
              }}
            >
              Remove
            </Button>
          </Stack>
        </>
      ) : (
        <Flex
          justify="center"
          align="center"
          p={20}
          border="1px dashed"
          borderColor="gray.200"
          borderRadius={4}
          width="100%"
          direction={"column"}
          height={"300px"}
          cursor={"pointer"}
          onClick={() => selectFileRef.current?.click()}
        >
          <Text p={2} color={"gray.500"} fontSize="10pt">
            Max Upload Image size: 2mb
          </Text>
          <Icon as={RiUploadCloud2Fill} mr={2} color="blue.500" fontSize={24} />

          <input
            id="file-upload"
            type="file"
            // accept="image/x-png,image/gif,image/jpeg"
            hidden
            ref={selectFileRef}
            onChange={onSelectImage}
          />
        </Flex>
      )}
    </Flex>
  );
};
export default ImageUpload;
