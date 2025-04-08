
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import LanguageSelector from "./LanguageSelector";
import { TextControls } from "./TextControls";
import { TranslationInput } from "./TranslationInput";
import { TranslationOutput } from "./TranslationOutput";
import { getLanguageByCode } from "@/utils/language-utils";

interface TextPanelProps {
  type: "source" | "target";
  text: string;
  setText: (text: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  loading?: boolean;
  disabled?: boolean;
  translationSource?: string | null;
}

const TextPanel: React.FC<TextPanelProps> = ({
  type,
  text,
  setText,
  language,
  setLanguage,
  loading = false,
  disabled = false,
  translationSource = null,
}) => {
  const selectedLanguage = getLanguageByCode(language);
  const supportsVoice = selectedLanguage?.supportsVoice ?? false;
  
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-col h-full p-4 space-y-4">
        <div className="flex justify-between items-center">
          <LanguageSelector
            value={language}
            onChange={setLanguage}
            disabled={disabled || (type === "target" && loading)}
          />
          
          <TextControls 
            type={type} 
            text={text} 
            setText={setText}
            language={language}
            disabled={disabled || loading}
            supportsVoice={supportsVoice}
          />
        </div>
        
        {type === "source" ? (
          <TranslationInput
            text={text}
            setText={setText}
            disabled={disabled}
          />
        ) : (
          <TranslationOutput
            text={text}
            loading={loading}
            translationSource={translationSource || undefined}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default TextPanel;
