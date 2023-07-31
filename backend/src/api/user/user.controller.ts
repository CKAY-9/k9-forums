import { Controller, Get, Req, Res, HttpStatus, Param } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

@Controller("user")
export class UserController {
    @Get("personal")
    async validateUserWithToken(@Req() req: Request, @Res() res: Response) {
        const token = JSON.parse(JSON.stringify((req.headers as any)))["authorization"];

        if (token === null) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "No token was provided"});
        }

        const user = await prisma.user.findUnique({
            where: {
                token: token
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "This user is invalid"});
        }

        return res.status(HttpStatus.OK).json({"message": "Got personal details", "user": user});
    }

    @Get("maxPermissionRole") 
    async getMaxPermissionsForUser(@Param() params: any, @Req() req: Request, @Res() res: Response) {
        const userID = params.user_id;
        const user = await prisma.user.findUnique({
            where: {
                public_id: userID
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find user"});
        }

        if ((user as any).usergroups === undefined || (user as any).usergroups === null) {
            return res.status(HttpStatus.BAD_REQUEST).json({"message": "Usergroup isn't assigned"});
        }
    }
}