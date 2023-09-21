import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

// POST /api/user
// Required fields in body: username, password
export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    //const parsedBody = JSON.parse(req.body);
    const parsedBody = req.body;

    if (parsedBody.username == undefined || parsedBody.password == undefined) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const userExists = await prisma.user.findFirst({
        where: {
            username: parsedBody.username
        },
    });

    if (userExists) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    const result = await prisma.user.create({
        data: {
            // watch out that passwords should be hashed and not stored in plaintext. as long as there is no sensitive data and no password requirements,
            // no hashing is currently done, moreover - rainbow tables exist.
            username: parsedBody.username,
            password: parsedBody.password
        },
    });
    console.log(`New user registered, ${result.id}, ${result.username}, ${result.password}`);
    return res.status(201).json(result);
}