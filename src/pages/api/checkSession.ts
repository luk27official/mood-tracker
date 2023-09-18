import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const token = req.body.token;

    if (token == undefined) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await prisma.loginToken.findFirst({
        where: {
            token: token
        }
    });

    if (result) {
        console.log(`Session found, ${result.id}, ${result.token}, ${result.userId}`);

        const user = await prisma.user.findFirst({
            where: {
                id: result.userId
            },
        });

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        console.log(`User found, ${user.id}, ${user.username}, ${user.password}`);
        return res.status(201).json(user.username);
    }

    return res.status(401).json({ message: 'Unauthorized' });
}