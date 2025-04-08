
import { TranslationRequest, TranslationResponse } from "../translation-service";

// Fallback mock translator for when all services fail
export function mockTranslator(request: TranslationRequest): TranslationResponse {
  console.log("Using mock translator as fallback");
  
  // Basic mock dictionary for common phrases
  const mockDictionary: Record<string, Record<string, Record<string, string>>> = {
    'en_XX': {
      'hello': {
        'fr_XX': 'bonjour',
        'es_XX': 'hola',
        'de_DE': 'hallo',
        'hi_IN': 'नमस्ते',
        'zh_CN': '你好',
        'ja_XX': 'こんにちは',
        'ru_RU': 'привет',
        'ar_AR': 'مرحبا',
        'bn_IN': 'হ্যালো',
        'ta_IN': 'வணக்கம்',
        'te_IN': 'హలో'
      },
      'good morning': {
        'fr_XX': 'bonjour',
        'es_XX': 'buenos días',
        'de_DE': 'guten morgen',
        'hi_IN': 'सुप्रभात',
        'zh_CN': '早上好',
        'ja_XX': 'おはようございます',
        'ru_RU': 'доброе утро',
        'ar_AR': 'صباح الخير',
        'bn_IN': 'সুপ্রভাত',
      },
      'thank you': {
        'fr_XX': 'merci',
        'es_XX': 'gracias',
        'de_DE': 'danke',
        'hi_IN': 'धन्यवाद',
        'zh_CN': '谢谢',
        'ja_XX': 'ありがとう',
        'ru_RU': 'спасибо',
        'ar_AR': 'شكرا لك',
        'bn_IN': 'ধন্যবাদ',
      },
    }
  };

  const lowerText = request.text.toLowerCase().trim();
  
  // Check if we have a mock translation
  if (mockDictionary[request.sourceLanguage]?.[lowerText]?.[request.targetLanguage]) {
    return {
      translatedText: mockDictionary[request.sourceLanguage][lowerText][request.targetLanguage]
    };
  }
  
  // If no mock translation is available, generate a simple mock to show something changed
  // This is just for demonstration purposes when APIs fail
  const mockPrefix = `[${request.targetLanguage}] `;
  return {
    translatedText: mockPrefix + request.text
  };
}
