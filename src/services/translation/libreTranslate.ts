
import { TranslationRequest, TranslationResponse } from "../translation-service";

// Basic language code mappings for LibreTranslate
const languageMap: Record<string, string> = {
  'auto': 'auto',
  'en_XX': 'en',
  'fr_XX': 'fr',
  'de_DE': 'de',
  'es_XX': 'es',
  'it_IT': 'it',
  'pt_XX': 'pt',
  'ru_RU': 'ru',
  'zh_CN': 'zh',
  'ja_XX': 'ja',
  'ko_KR': 'ko',
  'hi_IN': 'hi',
  'ta_IN': 'ta',
  'te_IN': 'te',
  'bn_IN': 'bn',
  'kn_IN': 'kn',
  'ml_IN': 'ml',
  'mr_IN': 'mr',
  'pa_IN': 'pa',
  'gu_IN': 'gu',
  'nl_XX': 'nl',
  'ar_AR': 'ar',
  'fi_FI': 'fi',
  'ro_RO': 'ro',
  'tr_TR': 'tr'
  // More mappings can be added as needed
};

// Translation using LibreTranslate API (no auth required)
export async function translateWithLibreTranslate(request: TranslationRequest): Promise<TranslationResponse> {
  // Map language codes from Hugging Face format to LibreTranslate format
  const sourceCode = languageMap[request.sourceLanguage] || 'en';
  const targetCode = languageMap[request.targetLanguage] || 'fr';
  
  // Try multiple LibreTranslate instances (some may be down)
  const libreSources = [
    "https://libretranslate.de/translate",
    "https://translate.argosopentech.com/translate",
    "https://translate.terraprint.co/translate"
  ];

  let lastError;
  
  // Try each source until one works
  for (const API_URL of libreSources) {
    try {
      console.log(`Trying LibreTranslate source: ${API_URL}`);
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: request.text,
          source: sourceCode,
          target: targetCode,
          format: "text",
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        let errorText;
        try {
          const errorData = await response.json();
          errorText = errorData.error || `${response.status}: ${response.statusText}`;
        } catch {
          errorText = `${response.status}: ${response.statusText}`;
        }
        
        throw new Error(`Translation service error: ${errorText}`);
      }

      const data = await response.json();
      console.log("LibreTranslate API response:", data);
      
      // Different APIs might have different response formats
      const translatedText = data.translatedText || data.translation || "";
      
      if (translatedText && translatedText !== request.text) {
        return { translatedText };
      }
      
      throw new Error("Service returned empty or unchanged translation");
    } catch (error) {
      lastError = error;
      console.error(`Failed with ${API_URL}:`, error);
      // Try next source
    }
  }
  
  throw lastError || new Error("All LibreTranslate services failed");
}
