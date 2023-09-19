import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    //const parsedBody = JSON.parse(req.body);
    const parsedBody = req.body;
    const token = parsedBody.token;

    if (token == undefined) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = await prisma.loginToken.findFirst({
        where: {
            token: token
        }
    });

    if (!result) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(`Session found, ${result.id}, ${result.token}, ${result.userId}`);

    const reports = await prisma.moodReport.findMany({
        where: {
            userId: result.userId
        }
    });

    if (!reports) {
        return res.status(201).json({});
    }

    console.log(`Reports found, ${reports.length}`);

    return res.status(201).json(reports);
};