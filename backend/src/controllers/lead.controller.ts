import { Request, Response } from 'express';
import { Lead } from '../models/Lead';

export class LeadController {
  public async getLeads(req: Request, res: Response) {
    try {
      // Fetch leads sorted by newest first
      const leads = await Lead.find().sort({ createdAt: -1 });
      res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }
}
