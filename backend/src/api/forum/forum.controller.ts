import { Body, Controller, Get, Param, Res, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { prisma } from "../../db/prisma";

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

        return res.status(HttpStatus.OK).json(updateForum);
    }
}