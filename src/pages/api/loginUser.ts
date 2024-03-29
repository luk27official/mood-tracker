import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/prisma';
import { randomBytes } from 'crypto';
import { hashPassword } from "@/app/passHash";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST' || req.headers['content-type'] !== 'application/json') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  //const parsedBody = JSON.parse(req.body);
  const parsedBody = req.body;

  const user = await prisma.user.findFirst({
    where: {
      username: parsedBody.username
    },
  });

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const salt = user.salt;
  const hashedPass = hashPassword(parsedBody.password, salt);

  if (!hashedPass) {
    return res.status(500).json({ message: 'Internal error' });
  }

  const result = await prisma.user.findFirst({
    where: {
      username: parsedBody.username,
      password: hashedPass
    },
  });

  if (result) {
    console.log(`User logged in, ${result.id}, ${result.username}, ${result.password}`);

    //if session exists, delete it
    const sessionExists = await prisma.loginToken.findFirst({
      where: {
        userId: result.id
      },
    });

    if (sessionExists) {
      await prisma.loginToken.delete({
        where: {
          id: sessionExists.id
        },
      });
    }

    const session = await prisma.loginToken.create({
      data: {
        userId: result.id,
        token: randomBytes(32).toString('hex')
      },
    });

    console.log(`New session created, ${session.id}, ${session.token}, ${session.userId}`);
    return res.status(201).json(session);
  }

  return res.status(401).json({ message: 'Unauthorized' });
}