import React, { useState } from "react";
import { ArrowRightLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import TextPanel from "./TextPanel";
import { translateText, MAX_TEXT_LENGTH, MBART_SUPPORTED_LANGUAGES } from "@/services/translation-service";
import { toast } from "sonner";
import ThemeToggle from "./ThemeToggle";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getLanguageByCode } from "@/utils/language-utils";

const Translator: React.FC = () => {
  const [sourceText, setSourceText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto"); // Default to auto-detect
  const [targetText, setTargetText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("fr_XX");
  const [isTranslating, setIsTranslating] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  // Removing translationSource state
  
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error("Please enter text to translate");
      return;
    }
    
    setIsTranslating(true);
    setDetectedLanguage(null);
    
    try {
      // Check if target language is supported by mBart
      if (!MBART_SUPPORTED_LANGUAGES.includes(targetLanguage)) {
        toast.warning(`Note: ${getLanguageByCode(targetLanguage)?.name || targetLanguage} may have limited support.`);
      }
      
      // No longer tracking which service performed the translation
      
      const result = await translateText({
        text: sourceText,
        sourceLanguage,
        targetLanguage
      });
      
      setTargetText(result.translatedText);
      
      // Show detected language if auto was selected
      if (sourceLanguage === "auto" && result.detectedLanguage) {
        setDetectedLanguage(result.detectedLanguage);
        const detectedName = getLanguageByCode(result.detectedLanguage)?.name || result.detectedLanguage;
        toast.success(`Detected language: ${detectedName}`);
      }
      
      if (result.translatedText && result.translatedText !== sourceText) {
        if (!result.detectedLanguage) {
          toast.success("Translation completed");
        }
      } else {
        toast.warning("Translation returned same text. Try a different language combination.");
      }
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };
  
  const handleSwapLanguages = () => {
    if (isTranslating) return;
    
    // Don't swap if source is auto-detect
    if (sourceLanguage === "auto") {
      toast.info("Cannot swap when using Auto Detect");
      return;
    }
    
    const tempLang = sourceLanguage;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(tempLang);
    
    const tempText = sourceText;
    setSourceText(targetText);
    setTargetText(tempText);
  };
  
  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Character limit: {sourceText.length}/{MAX_TEXT_LENGTH}
        </p>
        <ThemeToggle />
      </div>
      
      {detectedLanguage && sourceLanguage === "auto" && (
        <Alert className="bg-muted/50 border-muted">
          <AlertDescription>
            Auto-detected language: {getLanguageByCode(detectedLanguage)?.name || detectedLanguage}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        <TextPanel
          type="source"
          text={sourceText}
          setText={setSourceText}
          language={sourceLanguage}
          setLanguage={setSourceLanguage}
          disabled={isTranslating}
        />
        <TextPanel
          type="target"
          text={targetText}
          setText={setTargetText}
          language={targetLanguage}
          setLanguage={setTargetLanguage}
          loading={isTranslating}
          // No longer passing translationSource
        />
      </div>
      
      <div className="flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={handleSwapLanguages}
          disabled={isTranslating || sourceLanguage === "auto"}
          className="w-10 h-10 p-0"
        >
          <ArrowRightLeft className="w-4 h-4" />
        </Button>
        
        <Button
          onClick={handleTranslate}
          disabled={!sourceText || isTranslating}
          className="bg-gradient-to-r from-translator-primary to-translator-secondary hover:opacity-90 flex gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Translate
        </Button>
      </div>
    </div>
  );
};

export default Translator;
