import React, { useState } from "react";

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<any>();

  const [selectedFileUpload, setSelectedFileUpload] = useState<any>();

  const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("THIS IS HAPPENING", event);

    var imageFile = event.target.files?.[0];

    setSelectedFileUpload(imageFile);

    const reader = new FileReader();

    if (imageFile) {
      reader.readAsDataURL(imageFile);
    }

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result);
      }
    };
  };

  return {
    selectedFile,
    setSelectedFile,
    selectedFileUpload,
    setSelectedFileUpload,
    onSelectFile,
  };
};
export default useSelectFile;
