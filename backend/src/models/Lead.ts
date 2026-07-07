import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  contact: string;
  dateCreated: string;
  company: string;
  status: string;
  quality: string;
}

const leadSchema = new Schema<ILead>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    contact: { type: String },
    dateCreated: { type: String },
    company: { type: String },
    status: { type: String, default: 'Not Dialed' },
    quality: { type: String, default: '-' },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', leadSchema);
