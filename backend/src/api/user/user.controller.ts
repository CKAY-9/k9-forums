import { Controller, Get, Req, Res, HttpStatus, Param } from "@nestjs/common";
import { Response } from "express";
import { validateUser } from "./user.utils";
import { prisma } from "../../db/prisma";

@Controller("user")
export class UserController {
    @Get("personal")
    async validateUserWithToken(@Req() req: Request, @Res() res: Response) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
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