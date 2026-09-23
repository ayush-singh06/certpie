import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const cert1 = await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-XPIM-TY3C' },
    update: {},
    create: {
      certificateNumber: 'CERT-XPIM-TY3C',
      recipientName: 'Aditya B Gugawad',
      recipientId: '1AT23CG007',
      organizationName: 'Connect4Society',
      certificateTitle: 'Certificate of Participation',
      dateOfIssue: new Date('2026-09-06'),
      status: 'verified',
      verificationDate: new Date('2026-09-23'),
      certificateImageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
    },
  })

  const cert2 = await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-DEMO-0002' },
    update: {},
    create: {
      certificateNumber: 'CERT-DEMO-0002',
      recipientName: 'John Doe',
      recipientId: 'EMP-001',
      organizationName: 'Acme Corp',
      certificateTitle: 'Employee of the Month',
      dateOfIssue: new Date('2026-08-15'),
      status: 'verified',
      verificationDate: new Date('2026-09-01'),
      certificateImageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
    },
  })

  const cert3 = await prisma.certificate.upsert({
    where: { certificateNumber: 'CERT-DEMO-0003' },
    update: {},
    create: {
      certificateNumber: 'CERT-DEMO-0003',
      recipientName: 'Jane Smith',
      recipientId: 'STU-1029',
      organizationName: 'University of Technology',
      certificateTitle: 'Degree of Bachelor of Science',
      dateOfIssue: new Date('2026-05-20'),
      status: 'verified',
      verificationDate: new Date('2026-06-10'),
      certificateImageUrl: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80',
    },
  })

  console.log({ cert1, cert2, cert3 })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
