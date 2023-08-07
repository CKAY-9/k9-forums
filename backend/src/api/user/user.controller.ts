import { Controller, Get, Req, Res, HttpStatus, Param, Query, Post, Body, Put } from "@nestjs/common";
import { Response } from "express";
import { validateUser } from "./user.utils";
import { prisma } from "../../db/prisma";
import { AddUsergroupDTO, RemoveUsergroupDTO, UpdateUserDTO } from "./user.dto";
import {doesUserHavePermissionLevel, UsergroupFlags} from "../admin/permissions";

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
                usergroups: true,
                profile_picture: true,
                public_id: true
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "User couldn't be found"});
        }

        return res.status(HttpStatus.OK).json({"message": "Got public profile", "userData": user});
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
        const users = await prisma.user.findMany({
            select: {
                username: true,
                posts: true,
                comments: true,
                time_created: true,
                reputation: true,
                profile_bio: true,
                last_online: true,
                usergroups: true,
                profile_picture: true,
                public_id: true
            }
        });
        return res.status(HttpStatus.OK).json({"message": "Fetched all users", "users": users})
    }

    @Put("update")
    async updateUserProfile(@Req() req: Request, @Res() res: Response, @Body() body: UpdateUserDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        const update = await prisma.user.update({
            where: {
                token: user.token
            },
            data: {
                username: body.username,
                profile_bio: body.bio,
                profile_picture: body.pfp,
                last_online: new Date()
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated profile"});
    }

    @Put("addUsergroup")
    async addUsergroup(@Req() req: Request, @Res() res: Response, @Body() body: AddUsergroupDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const u = await prisma.user.findUnique({
            where: {
                public_id: body.user_id
            }
        });

        if (u === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Coudln't find user"});
        }

        u.usergroups.push(body.usergroup_id.toString());

        const uUpdate = await prisma.user.update({
            where: {
                public_id: u.public_id
            },
            data: {
                usergroups: u.usergroups
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Added usergroup to user"});
    }

    @Put("removeUsergroup")
    async removeUsergroup(@Req() req: Request, @Res() res: Response, @Body() body: RemoveUsergroupDTO) {
        const user = await validateUser(req);
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const u = await prisma.user.findUnique({
            where: {
                public_id: body.user_id
            }
        });

        if (u === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Couldn't find user"});
        }

        const i = u.usergroups.indexOf(body.usergroup_id.toString());
        u.usergroups.splice(i, 1);

        const uRemoval = await prisma.user.update({
            where: {
                public_id: body.user_id
            },
            data: {
                usergroups: u.usergroups
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Removed usergroup"});
    }

    @Get("posts")
    async getUserPosts(@Query() query: {public_id: string}, @Res() res: Response) {
        const user = await prisma.user.findUnique({
            where: {
                public_id: Number.parseInt(query.public_id)
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "User couldn't be found"});
        }

        const posts = await prisma.post.findMany({
            where: {
                user_id: user.public_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Fetched user posts", "posts": posts});
    }

    @Get("comments")
    async getUserComments(@Query() query: {public_id: string}, @Res() res: Response) {
        const user = await prisma.user.findUnique({
            where: {
                public_id: Number.parseInt(query.public_id)
            }
        });

        if (user === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "User couldn't be found"});
        }

        const comments = await prisma.comment.findMany({
            where: {
                user_id: user.public_id
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Fetched user posts", "comments": comments});
    }
}
