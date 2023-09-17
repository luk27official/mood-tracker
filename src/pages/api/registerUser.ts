import type { NextApiRequest, NextApiResponse } from 'next'
import prisma from '@/prisma'

// POST /api/user
// Required fields in body: username, password
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const result = await prisma.user.create({
        data: {
        ...req.body,
        },
    });
    console.log(`New user registered, ${result.id}, ${result.username}, ${result.password}`);
    return res.status(201).json(result);
}