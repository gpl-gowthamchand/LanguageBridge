
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TranslationInputProps {
  text: string;
  setText: (text: string) => void;
  disabled: boolean;
}

export const TranslationInput: React.FC<TranslationInputProps> = ({ 
  text, 
  setText, 
  disabled 
}) => {
  return (
    <Textarea
      className="flex-1 resize-none"
      value={text}
      onChange={(e) => setText(e.target.value)}
      placeholder="Enter text to translate..."
      readOnly={disabled}
    />
  );
};
