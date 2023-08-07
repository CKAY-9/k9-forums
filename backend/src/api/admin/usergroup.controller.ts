import { Req, Controller, Get, Param, Res, HttpStatus, Query, Body, Post, Put } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { Response } from "express";
import { UserController } from "../user/user.controller";
import { validateUser } from "../user/user.utils";
import { UsergroupFlags, doesUserHavePermissionLevel } from "./permissions";
import { prisma } from "../../db/prisma";
import { NewGroupDTO, UpdateGroupDTO } from "./admin.dto";

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
    async getUserGroup(@Query() query: {usergroup_id: string}, @Res() res: Response): Promise<any> {
        const usergroup = await prisma.usergroup.findUnique({
            where: {
                usergroup_id: Number.parseInt(query.usergroup_id) + 1
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

    @Put("updateGroup")
    async updateUsergroup(@Req() req: Request, @Res() res: Response, @Body() updateDTO: UpdateGroupDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const existing = await prisma.usergroup.findUnique({
            where: {
                usergroup_id: updateDTO.usergroup_id
            }
        });

        if (existing === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Failed to find usergroup"});
        }

        const update = await prisma.usergroup.update({where: {usergroup_id: updateDTO.usergroup_id}, data: {
            "color": updateDTO.color,
            "name": updateDTO.name,
            "permissions": updateDTO.permissions,
            "usergroup_id": updateDTO.new_usergroup_id
        }});

        return res.status(HttpStatus.OK).json({"message": "Updated usergroup", "group": update});
    }

    @Post("createGroup")
    async createNewGroup(@Req() req: Request, @Res() res: Response, @Body() newDTO: NewGroupDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const insert = await prisma.usergroup.create({data: {
            color: newDTO.color,
            name: newDTO.name,
            permissions: newDTO.permissions
        }});

        return res.status(HttpStatus.OK).json({"message": "Successful creation of new group", group: insert});
    }
}
