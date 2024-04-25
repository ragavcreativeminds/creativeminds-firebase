import React from "react";
import { Stack, Input, Textarea, Flex, Button } from "@chakra-ui/react";


type TextInputsProps = {
  textInput: string;
  onChange: any;
  placeHolder: string;
  height: string;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInput,
  onChange,
  placeHolder,
  height,
}) => {
  const textChange = (_value: string) => {
    onChange(_value);
  };

  const onTextChange = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(value);
  };

  return (
    <Stack spacing={3} width="100%">
      <Textarea
        value={textInput}
        onChange={onTextChange}
        _placeholder={{ opacity: 1, color: 'gray.700' , fontStyle:'italic', fontWeight:600}}
        _focus={{
          outline: "none",
          bg: "white",
         
        }}
        fontSize="10pt"
        borderRadius={4}
        color={'#00000'}
        fontWeight={900}
        height={height}
        placeholder={placeHolder}
        focusBorderColor='blue.500'
      />
    </Stack>
  );
};
export default TextInputs;
