import request from 'supertest';
import express from 'express';
import importRoutes from '../routes/import.routes';

// Mock mongoose Lead model
jest.mock('../models/Lead', () => ({
  Lead: {
    find: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([
      { name: 'John Doe', email: 'john@example.com', crm_status: 'Good Lead', createdAt: new Date() }
    ])
  }
}));

const app = express();
app.use(express.json());
app.use('/api', importRoutes);

describe('Lead Controller Tests', () => {
  it('should fetch leads successfully', async () => {
    const res = await request(app).get('/api/leads');
    
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBe(1);
    expect(res.body[0].name).toBe('John Doe');
  });
});
