
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  supportsVoice: boolean;
}

const autoDetectLanguage: Language = {
  code: "auto",
  name: "Auto Detect",
  nativeName: "Auto Detect",
  supportsVoice: false
};

const unsortedLanguages: Language[] = [
  autoDetectLanguage,
  { code: "ar_AR", name: "Arabic", nativeName: "العربية", supportsVoice: true },
  { code: "as_IN", name: "Assamese", nativeName: "অসমীয়া", supportsVoice: false },
  { code: "bn_IN", name: "Bengali", nativeName: "বাংলা", supportsVoice: true },
  { code: "cs_CZ", name: "Czech", nativeName: "Čeština", supportsVoice: true },
  { code: "de_DE", name: "German", nativeName: "Deutsch", supportsVoice: true },
  { code: "en_XX", name: "English", nativeName: "English", supportsVoice: true },
  { code: "es_XX", name: "Spanish", nativeName: "Español", supportsVoice: true },
  { code: "et_EE", name: "Estonian", nativeName: "Eesti", supportsVoice: true },
  { code: "fi_FI", name: "Finnish", nativeName: "Suomi", supportsVoice: true },
  { code: "fr_XX", name: "French", nativeName: "Français", supportsVoice: true },
  { code: "gu_IN", name: "Gujarati", nativeName: "ગુજરાતી", supportsVoice: true },
  { code: "hi_IN", name: "Hindi", nativeName: "हिन्दी", supportsVoice: true },
  { code: "it_IT", name: "Italian", nativeName: "Italiano", supportsVoice: true },
  { code: "ja_XX", name: "Japanese", nativeName: "日本語", supportsVoice: true },
  { code: "kk_KZ", name: "Kazakh", nativeName: "Қазақ", supportsVoice: false },
  { code: "kn_IN", name: "Kannada", nativeName: "ಕನ್ನಡ", supportsVoice: true },
  { code: "ko_KR", name: "Korean", nativeName: "한국어", supportsVoice: true },
  { code: "lt_LT", name: "Lithuanian", nativeName: "Lietuvių", supportsVoice: true },
  { code: "lv_LV", name: "Latvian", nativeName: "Latviešu", supportsVoice: true },
  { code: "ml_IN", name: "Malayalam", nativeName: "മലയാളം", supportsVoice: true },
  { code: "mr_IN", name: "Marathi", nativeName: "मराठी", supportsVoice: true },
  { code: "my_MM", name: "Burmese", nativeName: "မြန်မာ", supportsVoice: false },
  { code: "ne_NP", name: "Nepali", nativeName: "नेपाली", supportsVoice: false },
  { code: "nl_XX", name: "Dutch", nativeName: "Nederlands", supportsVoice: true },
  { code: "or_IN", name: "Odia", nativeName: "ଓଡ଼ିଆ", supportsVoice: false },
  { code: "pa_IN", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", supportsVoice: true },
  { code: "ro_RO", name: "Romanian", nativeName: "Română", supportsVoice: true },
  { code: "ru_RU", name: "Russian", nativeName: "Русский", supportsVoice: true },
  { code: "si_LK", name: "Sinhala", nativeName: "සිංහල", supportsVoice: false },
  { code: "ta_IN", name: "Tamil", nativeName: "தமிழ்", supportsVoice: true },
  { code: "te_IN", name: "Telugu", nativeName: "తెలుగు", supportsVoice: true },
  { code: "tr_TR", name: "Turkish", nativeName: "Türkçe", supportsVoice: true },
  { code: "uk_UA", name: "Ukrainian", nativeName: "Українська", supportsVoice: true },
  { code: "vi_VN", name: "Vietnamese", nativeName: "Tiếng Việt", supportsVoice: true },
  { code: "zh_CN", name: "Chinese", nativeName: "中文", supportsVoice: true },
];

export const languages: Language[] = unsortedLanguages.sort((a, b) => {
  if (a.code === "auto") return -1;
  if (b.code === "auto") return 1;
  
  return a.name.localeCompare(b.name);
});

export const getLanguageByCode = (code: string): Language | undefined => {
  return languages.find((lang) => lang.code === code);
};

export const getVoiceLanguageCode = (languageCode: string): string => {
  const langMap: Record<string, string> = {
    "ar_AR": "ar-SA",
    "bn_IN": "bn-IN",
    "cs_CZ": "cs-CZ",
    "de_DE": "de-DE",
    "en_XX": "en-US",
    "es_XX": "es-ES",
    "et_EE": "et-EE",
    "fi_FI": "fi-FI",
    "fr_XX": "fr-FR",
    "gu_IN": "gu-IN",
    "hi_IN": "hi-IN",
    "it_IT": "it-IT",
    "ja_XX": "ja-JP",
    "kn_IN": "kn-IN",
    "ko_KR": "ko-KR",
    "lt_LT": "lt-LT",
    "lv_LV": "lv-LV",
    "ml_IN": "ml-IN",
    "mr_IN": "mr-IN",
    "nl_XX": "nl-NL",
    "pa_IN": "pa-IN",
    "ro_RO": "ro-RO",
    "ru_RU": "ru-RU",
    "ta_IN": "ta-IN",
    "te_IN": "te-IN",
    "tr_TR": "tr-TR",
    "uk_UA": "uk-UA",
    "vi_VN": "vi-VN",
    "zh_CN": "zh-CN",
  };

  return langMap[languageCode] || "en-US";
};

export const detectLanguage = (text: string): string => {
  const normalizedText = text.toLowerCase().trim();
  
  if (!normalizedText) return "en_XX";
  
  const langPatterns = [
    { code: "hi_IN", pattern: /[\u0900-\u097F]/g, threshold: 0.2 },
    { code: "bn_IN", pattern: /[\u0980-\u09FF]/g, threshold: 0.2 },
    { code: "pa_IN", pattern: /[\u0A00-\u0A7F]/g, threshold: 0.2 },
    { code: "gu_IN", pattern: /[\u0A80-\u0AFF]/g, threshold: 0.2 },
    { code: "or_IN", pattern: /[\u0B00-\u0B7F]/g, threshold: 0.2 },
    { code: "ta_IN", pattern: /[\u0B80-\u0BFF]/g, threshold: 0.2 },
    { code: "te_IN", pattern: /[\u0C00-\u0C7F]/g, threshold: 0.2 },
    { code: "kn_IN", pattern: /[\u0C80-\u0CFF]/g, threshold: 0.2 },
    { code: "ml_IN", pattern: /[\u0D00-\u0D7F]/g, threshold: 0.2 },
    { code: "ar_AR", pattern: /[\u0600-\u06FF]/g, threshold: 0.2 },
    { code: "ru_RU", pattern: /[\u0400-\u04FF]/g, threshold: 0.2 },
    { code: "zh_CN", pattern: /[\u3400-\u9FFF]/g, threshold: 0.2 },
    { code: "ja_XX", pattern: /[\u3040-\u30FF]/g, threshold: 0.2 },
    { code: "ko_KR", pattern: /[\u1100-\u11FF\uAC00-\uD7AF]/g, threshold: 0.2 }
  ];
  
  for (const { code, pattern, threshold } of langPatterns) {
    const matches = normalizedText.match(pattern);
    if (matches && matches.length / normalizedText.length > threshold) {
      return code;
    }
  }
  
  const words = normalizedText.split(/\s+/);
  
  const languageWords = {
    "fr_XX": ["le", "la", "les", "un", "une", "des", "et", "est", "sont", "ce", "cette", "ces", "dans", "avec", "pour", "vous", "nous", "ils", "elles"],
    "de_DE": ["der", "die", "das", "ein", "eine", "und", "ist", "sind", "nicht", "ich", "du", "sie", "wir", "für", "auf", "mit", "zu", "haben", "werden"],
    "es_XX": ["el", "la", "los", "las", "un", "una", "y", "es", "son", "no", "que", "en", "por", "con", "para", "como", "pero", "más", "este", "esta"],
    "it_IT": ["il", "la", "i", "le", "un", "una", "e", "è", "sono", "non", "che", "per", "con", "come", "ma", "più", "questo", "questa"],
    "nl_XX": ["de", "het", "een", "is", "zijn", "niet", "en", "in", "op", "met", "voor", "dat", "deze", "dit", "maar", "ook"],
    "en_XX": ["the", "and", "is", "in", "to", "of", "a", "for", "that", "this", "with", "you", "it", "not", "or", "be", "are", "from", "at", "as"]
  };
  
  const langScores: Record<string, number> = {};
  
  for (const [langCode, langWords] of Object.entries(languageWords)) {
    langScores[langCode] = 0;
    
    for (const word of words) {
      if (langWords.includes(word)) {
        langScores[langCode]++;
      }
    }
    
    langScores[langCode] = langScores[langCode] / langWords.length;
  }
  
  let maxScore = 0;
  let detectedLang = "en_XX";
  
  for (const [langCode, score] of Object.entries(langScores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = langCode;
    }
  }
  
  if (maxScore > 0.1) {
    return detectedLang;
  }
  
  // Fix the letter frequencies object by using proper syntax
  const letterFrequencies = {
    "fr_XX": { "é": 0.01, "è": 0.01, "ê": 0.01, "à": 0.01, "ç": 0.01, "ù": 0.01 },
    "de_DE": { "ä": 0.01, "ö": 0.01, "ü": 0.01, "ß": 0.01 },
    "es_XX": { "á": 0.01, "é": 0.01, "í": 0.01, "ó": 0.01, "ú": 0.01, "ñ": 0.01, "¿": 0.01, "¡": 0.01 },
    "it_IT": { "à": 0.01, "è": 0.01, "é": 0.01, "ì": 0.01, "ò": 0.01, "ù": 0.01 }
  };
  
  for (const [langCode, frequencies] of Object.entries(letterFrequencies)) {
    for (const [letter, _] of Object.entries(frequencies)) {
      if (normalizedText.includes(letter)) {
        return langCode;
      }
    }
  }
  
  return "en_XX";
};
