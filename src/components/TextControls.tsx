
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Upload, Download, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { speakText, startSpeechToText, stopSpeechToText } from "@/services/speech-service";
import { readTextFile, downloadTextFile } from "@/utils/file-utils";
import { getLanguageByCode } from "@/utils/language-utils";

interface TextControlsProps {
  type: "source" | "target";
  text: string;
  setText: (text: string) => void;
  language: string;
  disabled: boolean;
  supportsVoice: boolean;
}

export const TextControls: React.FC<TextControlsProps> = ({
  type,
  text,
  setText,
  language,
  disabled,
  supportsVoice,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState("");
  const stopRecordingRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSpeechToText = () => {
    if (isRecording) {
      if (stopRecordingRef.current) {
        stopRecordingRef.current();
        stopRecordingRef.current = null;
      }
      stopSpeechToText();
      setIsRecording(false);
      setInterimTranscript("");
      return;
    }
    
    try {
      const stopRecording = startSpeechToText({
        language,
        onResult: (transcript, isFinal) => {
          if (isFinal) {
            // Fix: Create a new string instead of using a function
            const newText = text ? `${text} ${transcript}`.trim() : transcript;
            setText(newText);
            setInterimTranscript("");
          } else {
            setInterimTranscript(transcript);
          }
        },
        onError: (error) => {
          console.error("Speech recognition error:", error);
          toast.error("Speech recognition error: " + error.message);
          setIsRecording(false);
        },
      });
      
      stopRecordingRef.current = stopRecording;
      setIsRecording(true);
      toast.success("Listening...");
    } catch (error) {
      console.error("Failed to start speech recognition:", error);
      toast.error("Failed to start speech recognition");
    }
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    try {
      const file = e.target.files[0];
      const content = await readTextFile(file);
      setText(content);
      toast.success(`Uploaded "${file.name}"`);
    } catch (error) {
      console.error("File upload error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to upload file");
    } finally {
      // Reset the input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  
  const handleDownload = () => {
    if (!text) {
      toast.error("No text to download");
      return;
    }
    
    const langName = getLanguageByCode(language)?.name || "text";
    downloadTextFile(text, `translated-${langName.toLowerCase()}.txt`);
  };
  
  const handleTextToSpeech = () => {
    if (!text) {
      toast.error("No text to speak");
      return;
    }
    
    if (!supportsVoice) {
      toast.error("Text-to-speech is not available for this language");
      return;
    }
    
    speakText(text, language);
  };

  if (type === "source") {
    return (
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          title="Upload text file"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".txt,.md,.html,.json"
          onChange={handleFileUpload}
          disabled={disabled}
        />
        <Button
          variant={isRecording ? "destructive" : "outline"}
          size="icon"
          onClick={handleSpeechToText}
          disabled={disabled || !supportsVoice}
          title={isRecording ? "Stop recording" : "Start speech to text"}
        >
          {isRecording ? (
            <MicOff className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </Button>
        
        {isRecording && interimTranscript && (
          <div className="text-sm text-gray-500 italic">
            {interimTranscript}...
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleDownload}
        disabled={!text || disabled}
        title="Download as text file"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleTextToSpeech}
        disabled={!text || !supportsVoice || disabled}
        title="Text to speech"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
