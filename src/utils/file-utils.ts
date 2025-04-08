
import { toast } from "sonner";

export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.match("text.*")) {
      reject(new Error("Please select a valid text file"));
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };
    
    reader.readAsText(file);
  });
};

export const downloadTextFile = (text: string, filename: string): void => {
  if (!text) {
    toast.error("No text to download");
    return;
  }

  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || "translated-text.txt";
  
  // Append to the document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  URL.revokeObjectURL(url);
  
  toast.success(`Downloaded as ${filename}`);
};
