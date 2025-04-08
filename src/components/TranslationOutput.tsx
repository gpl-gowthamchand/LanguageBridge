
import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface TranslationOutputProps {
  text: string;
  loading: boolean;
  translationSource?: string;
}

export const TranslationOutput: React.FC<TranslationOutputProps> = ({ 
  text, 
  loading,
  // translationSource is still received but not used
}) => {
  return (
    <div className="flex flex-col flex-1">
      <Textarea
        className={`flex-1 resize-none ${loading ? "animate-pulse-light" : ""}`}
        value={loading ? "Translating..." : text}
        readOnly={true}
        placeholder="Translation will appear here..."
      />
    </div>
  );
};
