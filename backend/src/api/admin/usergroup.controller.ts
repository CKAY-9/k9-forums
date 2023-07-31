import { Controller, Get, Param, Res, HttpStatus, Query } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";

const prisma = new PrismaClient();

/*
    Permissions

    View posts = 0x400
    View comments = 0x410
    View profiles = 0x420

    Post = 0x4000
    Comment = 0x4100

    Delete Posts = 0x5000
    Delete Comments = 0x5100

    Post Management = 0x08
    Forum Managment = 0x04

*/

@Controller("usergroup")
export class UsergroupController {
    @Get("permissions")
    async getUserGroupPerms(@Query() params: any, @Res() res: Response): Promise<any> {
        const usergroup = await prisma.usergroup.findUnique({
            where: {
                usergroup_id: Number.parseInt(params.usergroup_id)
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

    @Get("allGroups")
    async getAllUserGroups(@Res() res: Response) {
        const usergroups = await prisma.usergroup.findMany();
        return res.status(HttpStatus.OK).json({"message": "Fetched all groups!", "groups": usergroups});
    }
}