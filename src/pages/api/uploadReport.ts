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

    console.log(result);

    if (!result) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    console.log(`Session found, ${result.id}, ${result.token}, ${result.userId}`);

    if (parsedBody.mood == undefined) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const report = await prisma.moodReport.create({
        data: {
            userId: result.userId,
            date: new Date(),
            mood: parsedBody.mood,
            comment: parsedBody.comment ? parsedBody.comment : '',
            anythingNew: parsedBody.anythingNew ? parsedBody.anythingNew : ''
        }
    });

    if (!report) {
        return res.status(500).json({ message: 'Internal server error' });
    }

    console.log(`Report created, ${report.id}, ${report.userId}, ${report.date}, ${report.mood}, ${report.comment}, ${report.anythingNew}`);

    return res.status(201).json({ message: 'Report created' });
};