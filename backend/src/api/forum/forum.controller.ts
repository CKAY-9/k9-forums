import { Body, Controller, Get, Param, Res, HttpStatus, Post, Req, Put } from "@nestjs/common";
import { Response } from "express";
import { prisma } from "../../db/prisma";
import { UpdateForumDTO } from "./forum.dto";
import { UsergroupFlags, doesUserHavePermissionLevel } from "../admin/permissions";
import { validateUser } from "../user/user.utils";

@Controller("forum")
export class ForumController {
    @Get("info")
    async GeneralInfoForum(@Res() res: Response): Promise<any> {
        let forumInfo = await prisma.forum.findFirst({
            "select": {
                "categories": true,
                "community_name": true,
                "community_logo": true,
                "about": true,
                "custom_redirects": true,
            }
        });
        if (forumInfo === null) {
            let newTemp = {
                community_name: "K9 Forums",
                community_logo: "/default/default.png",
                about: "FOS Forum Software by CKAY9",
                custom_redirects: [],
            }

            await prisma.forum.create({data: newTemp});
        }

        const categories = await prisma.category.findMany();

        const updateForum = await prisma.forum.update({
            "data": {
                "categories": {
                    "set": categories
                }
            },
            "select": {
                "categories": true,
                "community_name": true,
                "community_logo": true,
                "about": true,
                "custom_redirects": true,
            },
            "where": {
                "community_name": forumInfo === null ? "K9 Forums" : forumInfo.community_name
            }
        });

        updateForum.categories = categories;

        return res.status(HttpStatus.OK).json(updateForum);
    }

    @Put("update")
    async updateForumInfo(@Req() req: Request, @Res() res: Response, @Body() updateForumDTO: UpdateForumDTO) {
        const user = await validateUser(req);
        
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const forum = await prisma.forum.findFirst();

        if (forum === null) {
            return res.status(HttpStatus.NOT_FOUND).json({"message": "Error fetching forum data"});
        }

        const forumUpdate = await prisma.forum.update({
            where: {
                community_name: forum.community_name
            },
            data: {
                about: updateForumDTO.about,
                community_name: updateForumDTO.name,
                community_logo: updateForumDTO.logo
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated forum information"});
    }
}