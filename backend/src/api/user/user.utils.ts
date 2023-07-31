import { PrismaClient, User } from "@prisma/client";

export const validateUser = async (req: Request): Promise<User | undefined> => {
    const prisma = new PrismaClient();
    const token = JSON.parse(JSON.stringify((req.headers as any)))["authorization"];

    if (token === null) {
        return undefined;
    }

    const user = await prisma.user.findUnique({
        where: {
            token: token
        }
    });

    if (user === null) return undefined;
    return user;
}