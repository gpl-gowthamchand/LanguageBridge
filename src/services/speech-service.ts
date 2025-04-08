
import { getVoiceLanguageCode } from "../utils/language-utils";
import { toast } from "sonner";

export const speakText = (text: string, languageCode: string): void => {
  if (!text) {
    toast.error("No text to speak");
    return;
  }

  // Check if browser supports speech synthesis
  if (!window.speechSynthesis) {
    toast.error("Your browser doesn't support text-to-speech");
    return;
  }

  // Stop any existing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voiceLanguage = getVoiceLanguageCode(languageCode);
  utterance.lang = voiceLanguage;

  // Get available voices
  let voices = speechSynthesis.getVoices();
  
  // Function to find the best matching voice
  const findBestVoice = (voices: SpeechSynthesisVoice[], langCode: string) => {
    // Try exact match first
    let voice = voices.find((v) => v.lang === langCode);
    
    // Try matching the language part (before the hyphen)
    if (!voice) {
      const langPrefix = langCode.split('-')[0];
      voice = voices.find((v) => v.lang.startsWith(langPrefix));
    }
    
    // If still no match, try a more generic approach for language families
    if (!voice) {
      // For Indic languages, try Hindi as fallback
      if (['gu-IN', 'pa-IN', 'te-IN', 'kn-IN', 'ml-IN', 'mr-IN', 'ta-IN'].includes(langCode)) {
        voice = voices.find((v) => v.lang === 'hi-IN' || v.lang.startsWith('hi'));
      }
      // For European languages, try English as fallback
      else {
        voice = voices.find((v) => v.lang === 'en-US' || v.lang.startsWith('en'));
      }
    }
    
    return voice;
  };

  if (voices.length === 0) {
    // Some browsers need a delay to load voices
    setTimeout(() => {
      voices = speechSynthesis.getVoices();
      utterance.voice = findBestVoice(voices, voiceLanguage);
      window.speechSynthesis.speak(utterance);
    }, 200);
  } else {
    utterance.voice = findBestVoice(voices, voiceLanguage);
    window.speechSynthesis.speak(utterance);
  }
};

interface SpeechToTextOptions {
  language: string;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: Error) => void;
}

let recognition: SpeechRecognition | null = null;

export const startSpeechToText = ({ language, onResult, onError }: SpeechToTextOptions): (() => void) => {
  try {
    // Check browser compatibility
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      throw new Error("Speech recognition is not supported in this browser");
    }

    // Create a speech recognition instance
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognitionConstructor();

    // Configure the recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = getVoiceLanguageCode(language);

    // Set up event handlers
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        onResult(finalTranscript, true);
      } else if (interimTranscript) {
        onResult(interimTranscript, false);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Speech recognition error", event);
      onError(new Error(event.error || "Unknown speech recognition error"));
    };

    // Start recognition
    recognition.start();

    // Return a function to stop recognition
    return () => {
      if (recognition) {
        recognition.stop();
        recognition = null;
      }
    };
  } catch (error) {
    console.error("Speech to text setup error:", error);
    toast.error("Speech recognition failed to initialize");
    onError(error instanceof Error ? error : new Error("Unknown error"));
    return () => {};
  }
};

export const stopSpeechToText = (): void => {
  if (recognition) {
    recognition.stop();
    recognition = null;
  }
};
