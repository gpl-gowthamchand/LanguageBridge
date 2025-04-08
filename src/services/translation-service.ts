// Translation Service - Core functionality
import { toast } from "sonner";
import { detectLanguage } from "@/utils/language-utils";
import { translateWithHuggingFace } from "./translation/huggingFace";
import { translateWithLibreTranslate } from "./translation/libreTranslate";
import { translateWithGoogle } from "./translation/googleTranslate";
import { mockTranslator } from "./translation/mockTranslator";

let DEFAULT_API_TOKEN = import.meta.env.VITE_HUGGINGFACE_API_KEY || "";

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  apiToken?: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
}

// Maximum text length for API calls to avoid rate limits
export const MAX_TEXT_LENGTH = 2000;

// List of languages supported by mBart-large-50
export const MBART_SUPPORTED_LANGUAGES = [
  "ar_AR", "cs_CZ", "de_DE", "en_XX", "es_XX", "et_EE", "fi_FI", "fr_XX", "gu_IN", 
  "hi_IN", "it_IT", "ja_XX", "kk_KZ", "ko_KR", "lt_LT", "lv_LV", "my_MM", "ne_NP", 
  "nl_XX", "ro_RO", "ru_RU", "si_LK", "tr_TR", "vi_VN", "zh_CN"
];

// Indian languages that work better with Google Translate
export const INDIAN_LANGUAGES = [
  "hi_IN", "bn_IN", "ta_IN", "te_IN", "ml_IN", "kn_IN", "mr_IN", 
  "gu_IN", "pa_IN", "or_IN", "as_IN"
];

export const translateText = async (request: TranslationRequest): Promise<TranslationResponse> => {
  try {
    // Check if text is empty
    if (!request.text.trim()) {
      throw new Error("Please enter text to translate");
    }

    // Clone the request to avoid modifying the original
    const translationRequest = { ...request };

    // Handle auto-detect for source language
    let detectedLanguage = request.sourceLanguage;
    if (translationRequest.sourceLanguage === "auto") {
      detectedLanguage = detectLanguage(translationRequest.text);
      console.log(`Auto-detected language: ${detectedLanguage}`);
      translationRequest.sourceLanguage = detectedLanguage;
    }
    
    // Don't translate if source and target languages are the same
    if (translationRequest.sourceLanguage === translationRequest.targetLanguage) {
      console.log("Source and target languages are the same, returning original text");
      return { 
        translatedText: translationRequest.text,
        detectedLanguage
      };
    }

    // Check if the source or target language is not supported by mBart
    const isIndianLanguageInvolved = 
      INDIAN_LANGUAGES.includes(translationRequest.sourceLanguage) ||
      INDIAN_LANGUAGES.includes(translationRequest.targetLanguage);

    // Check if text is too long
    if (translationRequest.text.length > MAX_TEXT_LENGTH) {
      toast.warning(`Text exceeds ${MAX_TEXT_LENGTH} characters limit. Translating first ${MAX_TEXT_LENGTH} characters.`);
      translationRequest.text = translationRequest.text.substring(0, MAX_TEXT_LENGTH);
    }

    // Choose services order based on language
    let services = [];
    
    if (isIndianLanguageInvolved) {
      // For Indian languages, try Google first
      services = [
        { name: "Google Translate", fn: () => translateWithGoogle(translationRequest) },
        { name: "Hugging Face (mBART)", fn: () => translateWithHuggingFace(translationRequest, DEFAULT_API_TOKEN) },
        { name: "LibreTranslate", fn: () => translateWithLibreTranslate(translationRequest) },
        { name: "Mock Service", fn: () => mockTranslator(translationRequest) }
      ];
    } else {
      // Original order for other languages
      services = [
        { name: "Hugging Face (mBART)", fn: () => translateWithHuggingFace(translationRequest, DEFAULT_API_TOKEN) },
        { name: "Google Translate", fn: () => translateWithGoogle(translationRequest) },
        { name: "LibreTranslate", fn: () => translateWithLibreTranslate(translationRequest) },
        { name: "Mock Service", fn: () => mockTranslator(translationRequest) }
      ];
    }
    
    let lastError = null;
    
    for (const service of services) {
      try {
        console.log(`Attempting translation with ${service.name}`);
        const result = await service.fn();
        
        // Validate the result
        if (result.translatedText && 
            result.translatedText.trim().length > 0 && 
            result.translatedText !== translationRequest.text) {
          console.log(`${service.name} translation successful`);
          return {
            ...result,
            detectedLanguage
          };
        }
        
        console.log(`${service.name} returned empty or unchanged text, trying next service`);
      } catch (error) {
        console.error(`${service.name} translation failed:`, error);
        lastError = error;
      }
    }

    // If we get here, all services failed
    throw lastError || new Error("All translation services failed. Please try again later.");

  } catch (error) {
    console.error("Translation error:", error);
    const errorMessage = error instanceof Error ? error.message : "Translation failed. Please try again.";
    toast.error(errorMessage);
    throw error;
  }
};

// Check if the language is officially supported by mBart-large-50
function isSupportedByMBart(languageCode: string): boolean {
  return MBART_SUPPORTED_LANGUAGES.includes(languageCode);
}
