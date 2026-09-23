import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Validation schema for creating a certificate
const createCertificateSchema = z.object({
  certificateNumber: z.string().min(1),
  recipientName: z.string().min(1),
  recipientId: z.string().optional(),
  organizationName: z.string().min(1),
  organizationLogo: z.string().optional(),
  certificateTitle: z.string().min(1),
  description: z.string().optional(),
  dateOfIssue: z.string().datetime().or(z.date()),
  verificationDate: z.string().datetime().or(z.date()).optional(),
  certificateImageUrl: z.string().url().optional(),
  certificatePdfUrl: z.string().url().optional(),
  status: z.string().default('verified'),
});

// GET /api/certificates/:certificateNumber
app.get('/api/certificates/:certificateNumber', async (req, res) => {
  try {
    const { certificateNumber } = req.params;
    
    if (!certificateNumber) {
      return res.status(400).json({ success: false, message: 'Certificate number is required' });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber },
    });

    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found' });
    }

    return res.status(200).json({
      success: true,
      certificate,
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// POST /api/certificates (Admin / Testing endpoint)
app.post('/api/certificates', async (req, res) => {
  try {
    const validatedData = createCertificateSchema.parse(req.body);

    const certificate = await prisma.certificate.create({
      data: {
        ...validatedData,
        dateOfIssue: new Date(validatedData.dateOfIssue),
        verificationDate: validatedData.verificationDate ? new Date(validatedData.verificationDate) : undefined,
      },
    });

    return res.status(201).json({
      success: true,
      certificate,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, message: 'Validation error', errors: error.issues });
    }
    console.error('Error creating certificate:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
