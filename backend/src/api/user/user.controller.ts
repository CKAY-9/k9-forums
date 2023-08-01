import { Controller, Get, Req, Res, HttpStatus, Param, Query } from "@nestjs/common";
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

    @Get("public")
    async getPublicUser(@Query() query: {public_id: string}, @Res() res: Response) {
        const user = await prisma.user.findUnique({
            where: {
                public_id: Number.parseInt(query.public_id)
            }, 
            select: {
                username: true,
                posts: true,
                comments: true,
                time_created: true,
                reputation: true,
                profile_bio: true,
                last_online: true,
                usergroups: true
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "User couldn't be found"});
        }

        return res.status(HttpStatus.OK).json({"message": "Got public profile", "user": user});
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

    @Get("all")
    async getAllUsers(@Res() res: Response) {
        const users = await prisma.user.findMany();
        return res.status(HttpStatus.OK).json({"message": "Fetched all users", "users": users})
    }
}