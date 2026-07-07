import { GoogleGenAI } from '@google/genai';
import { crmSchemaPrompt } from '../prompts/crm.prompt';
import { CRMRecord } from '../types';

export class AIService {
  private ai: GoogleGenAI | null = null;

  private getAI(): GoogleGenAI {
    if (!this.ai) {
      this.ai = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY || '',
      });
    }
    return this.ai;
  }

  public async processBatch(batch: any[]): Promise<CRMRecord[]> {
    let retries = 3;
    
    while (retries > 0) {
      try {
        const prompt = crmSchemaPrompt + "\n\n**Batch to Process (JSON):**\n" + JSON.stringify(batch);
        
        const aiClient = this.getAI();
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.1,
            responseMimeType: "application/json",
          }
        });

        const responseText = response.text;
        
        if (!responseText) {
            throw new Error("Empty response from AI");
        }

        let cleanText = responseText.trim();
        if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/```json\n?/, '').replace(/```\n?$/, '');
        } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/```\n?/, '').replace(/```\n?$/, '');
        }
        cleanText = cleanText.trim();

        try {
           const parsedBatch = JSON.parse(cleanText) as CRMRecord[];
           return parsedBatch;
        } catch(e) {
           console.error("Failed to parse JSON response from Gemini", e);
           // If it's a parsing error, retrying with the same prompt rarely helps. We could return empty here.
           return [];
        }

      } catch (apiError: any) {
        console.error(`Gemini API Error (Retries left: ${retries - 1}):`, apiError.message || apiError);
        retries--;
        if (retries === 0) {
          console.error("Failed to process batch after multiple retries. Skipping batch.");
          return [];
        } else {
          // Wait 3 seconds before retrying
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    }
    return [];
  }
}
