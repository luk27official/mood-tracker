import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

// POST /api/user
// Required fields in body: username, password
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    if (req.body.username == undefined || req.body.password == undefined) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const userExists = await prisma.user.findFirst({
        where: {
            username: req.body.username
        },
    });

    if (userExists) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const result = await prisma.user.create({
        data: {
            ...req.body,
        },
    });
    console.log(`New user registered, ${result.id}, ${result.username}, ${result.password}`);
    return res.status(201).json(result);
}