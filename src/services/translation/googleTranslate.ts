
import { TranslationRequest, TranslationResponse } from "../translation-service";

// Map language codes from our format to Google Translate format
const languageMap: Record<string, string> = {
  'auto': 'auto',
  'en_XX': 'en',
  'fr_XX': 'fr',
  'de_DE': 'de',
  'es_XX': 'es',
  'it_IT': 'it',
  'pt_XX': 'pt',
  'ru_RU': 'ru',
  'zh_CN': 'zh-CN',
  'ja_XX': 'ja',
  'ko_KR': 'ko',
  'ar_AR': 'ar',
  'hi_IN': 'hi',
  'bn_IN': 'bn',
  'pa_IN': 'pa',
  'ta_IN': 'ta',
  'te_IN': 'te',
  'ml_IN': 'ml',
  'kn_IN': 'kn',
  'mr_IN': 'mr',
  'gu_IN': 'gu',
  'or_IN': 'or',
  'as_IN': 'as',
  'tr_TR': 'tr',
  'nl_XX': 'nl',
  'pl_PL': 'pl',
  'ro_RO': 'ro',
  'fi_FI': 'fi',
  'cs_CZ': 'cs',
  'sv_SE': 'sv',
  'vi_VN': 'vi',
  'hu_HU': 'hu',
  'el_GR': 'el',
  'da_DK': 'da',
  'no_NO': 'no',
  'id_ID': 'id',
  'th_TH': 'th',
  'he_IL': 'he',
  'ms_MY': 'ms',
  // Add more mappings as needed
};

// Get Google Translate language code from our code format
const getGoogleLanguageCode = (code: string): string => {
  return languageMap[code] || code.split('_')[0]; // Use first part of code if mapping not found
};

// Browser-compatible Google Translate API implementation using fetch
export async function translateWithGoogle(request: TranslationRequest): Promise<TranslationResponse> {
  try {
    console.log(`Attempting Google Translate translation from ${request.sourceLanguage} to ${request.targetLanguage}`);
    
    // Get language codes in Google Translate format
    const from = request.sourceLanguage === 'auto' ? 'auto' : getGoogleLanguageCode(request.sourceLanguage);
    const to = getGoogleLanguageCode(request.targetLanguage);
    
    try {
      // Create a URL for the free Google Translate API
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(request.text)}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Google Translate API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // The response format is an array of arrays, with the translations in the first position
      // of each inner array within the first element of the outer array
      if (!data || !data[0]) {
        throw new Error("Google Translate returned unexpected data format");
      }
      
      // Extract translated text from the response
      let translatedText = '';
      
      // Handle different possible response structures
      if (Array.isArray(data[0])) {
        translatedText = data[0]
          .map((chunk: any) => chunk && chunk[0])
          .filter(Boolean)
          .join('');
      } else if (typeof data[0] === 'string') {
        translatedText = data[0];
      }
      
      if (!translatedText || translatedText.trim().length === 0) {
        throw new Error("Google Translate returned empty result");
      }
      
      console.log("Google Translate translation successful");
      return { translatedText };
    } catch (error) {
      console.error("Google Translate API error:", error);
      // Re-throw to allow fallback to other translation services
      throw new Error(`Google Translate failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  } catch (error) {
    console.error("Google Translate preparation error:", error);
    throw error;
  }
}
