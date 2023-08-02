import { User } from "@prisma/client";
import { prisma } from "../../db/prisma";

export const validateUser = async (req: Request): Promise<User | undefined> => {
    const token = JSON.parse(JSON.stringify((req.headers as any)))["authorization"];

    if (token === null) {
        return undefined;
    }

    const user = await prisma.user.findUnique({
        where: {
            token: token
        },
    });

    if (user === null) return undefined;
    
    const updateNow = await prisma.user.update({
        where: {
            token: user.token
        },
        data: {
            last_online: new Date()
        }
    })

    return user;
}