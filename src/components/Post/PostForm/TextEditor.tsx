import React, { useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import dynamic from "next/dynamic";

type TextEditorProps = {
  textInput: string;
  onChange: any;
  placeHolder: string;
  readonly: boolean;
  theme: string;
  height: string;
};

const TextEditor: React.FC<TextEditorProps> = ({
  textInput,
  onChange,
  placeHolder,
  readonly,
  theme,
  height,
}) => {
  const editorChange = (
    _value: string,
    _delta: any,
    _source: any,
    _editor: any // ReactQuill.UnprivilegedEditor
  ) => {
    onChange(_value);
  };

  const _toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"], // remove formatting button
  ];

  const toolbarOptions = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ color: [] }, { background: [] }, { align: [] }],

    ["link"],
  ];

  return (
    <>
      <Flex width="100%" direction="column" bg="white" borderRadius={4}>
        <ReactQuill
          placeholder={placeHolder}
          readOnly={readonly}
          theme={theme}
          modules={{ toolbar: toolbarOptions }}
          style={{
            height: height,
            maxHeight: "300px",
            width: "100%",
          }}
          value={textInput}
          onChange={editorChange}
        />
      </Flex>
    </>
  );
};
export default TextEditor;
