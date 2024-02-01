// fix all existing users by replacing "default" salt with a random salt
// and update the passwords to be hashed with the new salt

import { NextApiRequest, NextApiResponse } from "next";
import prisma from '@/prisma';
import { randomBytes } from 'crypto';
import { hashPassword } from "@/app/passHash";

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method not allowed" });
    }

    const users = await prisma.user.findMany();

    const newUsers = [];

    for (const user of users) {
        if (user.salt === "default") {
            const salt = randomBytes(32).toString("hex");
            const hashedPass = hashPassword(user.password, salt);

            if (!hashedPass) {
                return res.status(500).json({ message: "Internal error" });
            }

            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    salt: salt,
                    password: hashedPass
                }
            });

            newUsers.push({ uname: user.username, upass: user.password, salt: salt, hashedPass: hashedPass });
        }
    }

    return res.status(200).json({ newUsers: newUsers });
}