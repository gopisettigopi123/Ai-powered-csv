import { Request, Response } from 'express';
import { parse } from 'csv-parse';
import { AIService } from '../services/ai.service';
import { CRMRecord } from '../types';
import { Lead } from '../models/Lead';

const aiService = new AIService();
const BATCH_SIZE = 25; // Default batch size from prompt

export class ImportController {
  
  public async upload(req: Request, res: Response) {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
      const csvData = req.file.buffer.toString('utf-8');
      
      parse(csvData, { columns: true, skip_empty_lines: true }, async (err: any, records: any[]) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to parse CSV file' });
        }

        const allParsedRecords: CRMRecord[] = [];
        let totalImported = 0;
        let totalSkipped = 0;
        const initialRowCount = records.length;

        // Process in batches
        for (let i = 0; i < records.length; i += BATCH_SIZE) {
          const batch = records.slice(i, i + BATCH_SIZE);
          const parsedBatch = await aiService.processBatch(batch);
          
          if (parsedBatch.length > 0) {
            // Save to MongoDB
            try {
              await Lead.insertMany(parsedBatch);
            } catch (dbError) {
              console.error("Failed to save batch to DB", dbError);
            }
          }
          
          allParsedRecords.push(...parsedBatch);
        }

        totalImported = allParsedRecords.length;
        totalSkipped = initialRowCount - totalImported;

        res.json({
          success: true,
          data: allParsedRecords,
          totalImported,
          totalSkipped,
          totalOriginalRows: initialRowCount
        });
      });

    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public async uploadBatch(req: Request, res: Response) {
    try {
      const { batch } = req.body;
      if (!batch || !Array.isArray(batch)) {
        return res.status(400).json({ error: 'Invalid batch data' });
      }

      const parsedBatch = await aiService.processBatch(batch);
      
      if (parsedBatch.length > 0) {
        try {
          await Lead.insertMany(parsedBatch);
        } catch (dbError) {
          console.error("Failed to save batch to DB", dbError);
        }
      }

      res.json({
        success: true,
        imported: parsedBatch.length,
        skipped: batch.length - parsedBatch.length
      });
    } catch (error) {
      console.error("Batch Server Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
