import { Body, Controller, Get, Param, Res, HttpStatus, Post, Req, Put } from "@nestjs/common";
import { Response } from "express";
import { prisma } from "../../db/prisma";
import { UpdateForumDTO, UpdateLinksDTO } from "./forum.dto";
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
                "motd": true
            }
        });

        if (forumInfo === null) {
            let newTemp = {
                community_name: "K9 Forums",
                community_logo: "/default/default.png",
                about: "FOS Forum Software by CKAY9",
                motd: ""
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
                "motd": true
            },
            "where": {
                "community_name": forumInfo === null ? "K9 Forums" : forumInfo.community_name
            }
        });

        updateForum.categories = categories;

        return res.status(HttpStatus.OK).json(updateForum);
    }

    @Get("links")
    async getCustomLinks(@Res() res: Response) {
        const links = await prisma.customLink.findMany();
        return res.status(HttpStatus.OK).json({"message": "Fetched custom links", "links": links});
    }

    @Put("updateLinks")
    async updateCustomLinks(@Res() res: Response, @Req() req: Request, @Body() updateLinksDTO: UpdateLinksDTO) {
        const user = await validateUser(req);
        
        if (user === undefined) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Token couldn't be verified"});
        }

        if (!doesUserHavePermissionLevel(user, UsergroupFlags.FORUM_MANAGEMENT)) {
            return res.status(HttpStatus.UNAUTHORIZED).json({"message": "Permission level not met"}); 
        }

        const steam = await prisma.customLink.findUnique({
            where: {
                type: 0,
                custom_link_id: 1
            }
        });

        if (steam === null) {
            await prisma.customLink.create({
                data: {
                    type: 0,
                    url: updateLinksDTO.steam || ""
                }
            });
        }

        const steamUpdate = await prisma.customLink.update({
            where: {
                type: 0,
                custom_link_id: 1
            },
            data: {
                url: updateLinksDTO.steam || ""
            }
        });


        const store = await prisma.customLink.findUnique({
            where: {
                type: 1,
                custom_link_id: 2
            }
        });

        if (store === null) {
            await prisma.customLink.create({
                data: {
                    type: 1,
                    url: updateLinksDTO.store || ""
                }
            });
        }

        const storeUpdate = await prisma.customLink.update({
            where: {
                type: 1,
                custom_link_id: 2
            },
            data: {
                url: updateLinksDTO.store || ""
            }
        });


        const discord = await prisma.customLink.findUnique({
            where: {
                type: 2,
                custom_link_id: 3
            }
        });

        if (discord === null) {
            await prisma.customLink.create({
                data: {
                    type: 2,
                    url: updateLinksDTO.discord || ""
                }
            });
        }

        const discordUpdate = await prisma.customLink.update({
            where: {
                type: 2,
                custom_link_id: 3
            },
            data: {
                url: updateLinksDTO.discord || ""
            }
        });


        return res.status(HttpStatus.OK).json({"message": "Updated links"});
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
                community_logo: updateForumDTO.logo,
                motd: updateForumDTO.motd
            }
        });

        return res.status(HttpStatus.OK).json({"message": "Updated forum information"});
    }
}
