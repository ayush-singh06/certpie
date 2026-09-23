import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
});

export interface Certificate {
  id: string;
  certificateNumber: string;
  recipientName: string;
  recipientId?: string;
  organizationName: string;
  organizationLogo?: string;
  certificateTitle: string;
  description?: string;
  dateOfIssue: string;
  verificationDate?: string;
  certificateImageUrl?: string;
  certificatePdfUrl?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
