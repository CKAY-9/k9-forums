import { Body, Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

@Controller("usergroup")
export class UsergroupController {
    @Get("permissions")
    async getUserGroupPerms(@Param() params: any, @Res() res: Response): Promise<any> {
        const usergroup = await prisma.usergroup.findUnique({
            where: {
                usergroup_id: params.usergroup_id
            }
        });

        if (usergroup === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "This usergroup couldn't be found"});
        }

        return res.status(HttpStatus.OK).json({"message": "Got permissions for usergroup!", "permissions": usergroup.permissions});
    }

    @Get("info")
    async getUserGroup(@Param() params: any, @Res() res: Response): Promise<any> {
        const usergroup = await prisma.usergroup.findUnique({
            where: {
                usergroup_id: params.usergroup_id
            }
        });

        if (usergroup === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "This usergroup couldn't be found"});
        }

        return res.status(HttpStatus.OK).json({"message": "Got details for usergroup!", "usergroup": usergroup});
    }
}