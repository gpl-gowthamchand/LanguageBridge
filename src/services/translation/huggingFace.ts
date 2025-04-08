
import { TranslationRequest, TranslationResponse } from "../translation-service";

// Translation using Hugging Face API
export async function translateWithHuggingFace(request: TranslationRequest, token: string): Promise<TranslationResponse> {
  // Use the mbart model which has good multilingual support
  const models = [
    "facebook/mbart-large-50-many-to-many-mmt"
  ];
  
  for (const model of models) {
    const API_URL = `https://api-inference.huggingface.co/models/${model}`;
    
    try {
      console.log(`Trying Hugging Face model: ${model}`);
      
      // Prepare headers with auth token
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      };

      // Make sure language codes are compatible with the mBart model
      // The mBart model requires specific language codes for source and target
      
      const response = await fetch(API_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          inputs: request.text,
          parameters: {
            src_lang: request.sourceLanguage,
            tgt_lang: request.targetLanguage,
            max_length: 1000
          },
          options: {
            wait_for_model: true,
            use_cache: false
          }
        }),
        cache: 'no-store'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `API error: ${response.status}` }));
        console.error("Hugging Face API error:", errorData);
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      // Parse successful response
      const result = await response.json();
      console.log("Hugging Face API response:", result);
      
      // Handle different response formats
      let translatedText = "";
      if (Array.isArray(result)) {
        translatedText = result[0]?.translation_text || "";
      } else if (typeof result === 'object' && result !== null) {
        translatedText = result.generated_text || "";
      }
      
      if (translatedText && translatedText !== request.text) {
        return { translatedText };
      }
      
      throw new Error("Model returned empty or unchanged translation");
    } catch (error) {
      console.warn(`Failed with model ${model}:`, error);
      // Continue to next model
    }
  }
  
  throw new Error("All Hugging Face models failed");
}
